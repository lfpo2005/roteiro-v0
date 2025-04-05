import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from './prisma';
import GoogleProvider from 'next-auth/providers/google';
import { upsertUser } from '@/services/userService';
import { UserType } from '@/types/user';
import { logger } from './logger';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 dias
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            // Se o login foi bem-sucedido e temos informações do usuário
            if (user && user.email && account?.provider === 'google') {
                try {
                    // Cria ou atualiza o usuário no banco de dados
                    const dbUser = await upsertUser({
                        email: user.email,
                        name: user.name || undefined,
                        image: user.image || undefined,
                    });

                    logger.auth.login(dbUser.id, dbUser.email);
                    return true;
                } catch (error) {
                    logger.error('Erro ao persistir dados do usuário', 'auth', {
                        error,
                        email: user.email
                    });
                    // Permitir o login mesmo se houver erro ao salvar os dados
                    return true;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.userType = (user as any).userType || UserType.BASIC;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id as string;
                session.user.userType = token.userType as UserType;
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
            try {
                await prisma.user.update({
                    where: { id },
                    data: {
                        userType: UserType.BASIC,
                        settings: {
                            emailNotificacoes: true,
                            novosRecursos: true,
                            dicas: true,
                            temaEscuro: false,
                        }
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
        },
    },
    debug: process.env.NODE_ENV === 'development',
}; 