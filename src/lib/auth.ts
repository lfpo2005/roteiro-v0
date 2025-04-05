import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from './prisma';
import GoogleProvider from 'next-auth/providers/google';
import { upsertUser } from '@/services/userService';
import { UserType } from '@/types/user';
import { logger } from './logger';
import { User } from '@prisma/client';

// Garante que exista um segredo para produção
if (!process.env.NEXTAUTH_SECRET) {
    console.error('NEXTAUTH_SECRET não está definido');
    logger.error('NEXTAUTH_SECRET não está definido', 'auth', {
        environment: process.env.NODE_ENV,
        nextauthUrl: process.env.NEXTAUTH_URL,
    });
    throw new Error('A variável de ambiente NEXTAUTH_SECRET deve ser definida');
}

// Log de inicialização do NextAuth
logger.info('Inicializando NextAuth', 'auth', {
    environment: process.env.NODE_ENV,
    nextauthUrl: process.env.NEXTAUTH_URL,
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    debug: process.env.NODE_ENV === 'development',
});

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 dias
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            }
        }
    },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            logger.info('Tentativa de login', 'auth', {
                email: user?.email,
                provider: account?.provider,
                hasProfile: !!profile,
                hasCredentials: !!credentials
            });

            // Verificar se temos as informações necessárias
            if (!user || !user.email) {
                logger.error('Falha no login: usuário ou email ausente', 'auth', {
                    user: !!user,
                    email: !!user?.email,
                    provider: account?.provider
                });
                return false;
            }

            // Se o login foi bem-sucedido e temos informações do usuário
            if (user.email && account?.provider === 'google') {
                try {
                    // Cria ou atualiza o usuário no banco de dados
                    const dbUser = await upsertUser({
                        email: user.email,
                        name: user.name || undefined,
                        image: user.image || undefined,
                    });

                    logger.auth.login(dbUser.id, dbUser.email);
                    logger.info(`Login bem-sucedido: ${user.email}`, 'auth', {
                        userId: dbUser.id,
                        provider: account.provider
                    });
                    return true;
                } catch (error) {
                    logger.error('Erro ao persistir dados do usuário', 'auth', {
                        error,
                        email: user.email,
                        provider: account.provider
                    });
                    // Permitir o login mesmo se houver erro ao salvar os dados
                    return true;
                }
            }
            if (user.email && account?.provider) {
                logger.info(`Login com provedor: ${account.provider}`, 'auth', {
                    email: user.email
                });
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.userType = (user as any).userType || UserType.BASIC;
                logger.info('JWT criado/atualizado', 'auth', {
                    userId: user.id,
                    tokenProvided: !!token
                });
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id as string;
                session.user.userType = token.userType as UserType;
                logger.info('Sessão criada/atualizada', 'auth', {
                    userId: token.id as string,
                    sessionProvided: !!session
                });
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
    events: {
        async createUser(message) {
            // Quando um usuário é criado, define os valores padrão
            const { id, email } = message.user;
            if (!id || !email) {
                logger.error('Dados de usuário inválidos no evento createUser', 'auth');
                return;
            }

            try {
                await prisma.user.update({
                    where: { id },
                    data: {
                        userType: UserType.BASIC,
                        settings: JSON.stringify({
                            emailNotificacoes: true,
                            novosRecursos: true,
                            dicas: true,
                            temaEscuro: false,
                        })
                    }
                });
                logger.auth.signup(id, email);
                logger.success(`Usuário ${id} criado e configurado com sucesso`, 'auth', { email });
            } catch (error) {
                logger.error(`Erro ao configurar usuário ${id}`, 'auth', { error, email });
            }
        },
        async signIn(message) {
            if (message.user.email) {
                logger.auth.login(message.user.id, message.user.email);
            }
        },
        async signOut(message) {
            if (message.user?.email) {
                logger.auth.logout(message.user.id, message.user.email);
            }
        }
    },
    logger: {
        error(code, metadata) {
            logger.error(`NextAuth Error: ${code}`, 'auth', metadata || {});
        },
        warn(code) {
            logger.warning(`NextAuth Warning: ${code}`, 'auth');
        },
        debug(code, metadata) {
            if (process.env.NODE_ENV === 'development') {
                logger.info(`NextAuth Debug: ${code}`, 'auth', metadata || {});
            }
        }
    },
    debug: process.env.NODE_ENV === 'development',
}; 