'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, UserType } from '@/types/user';
import { isProfileComplete, isFirstLogin } from '@/services/profileService';
import { logger } from '@/lib/logger';

// Adding additional user fields for client registration
// User interface is imported from @/types/user and includes:
// id, name, email, image, userType, telefone, endereco, cidade, estado, cep, documento, dataNascimento

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  isFirstLogin: boolean;
  checkUserAccess: (requiredType: UserType[]) => boolean;
  login: () => void;
  logout: () => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profileComplete, setProfileComplete] = useState<boolean>(false);
  const [firstLogin, setFirstLogin] = useState<boolean>(false);
  const router = useRouter();

  // Função para buscar os dados completos do usuário
  const fetchUserData = useCallback(async (email: string) => {
    try {
      // Se não tem email, não faz requisição
      if (!email) {
        logger.warning('Nenhum email fornecido para buscar perfil', 'auth');
        setUser(null);
        return null;
      }

      logger.info('Buscando dados do usuário', 'auth', { email });
      const response = await fetch(`/api/user/profile`);

      // Se a resposta for 401, o usuário não está autenticado
      if (response.status === 401) {
        logger.warning('Usuário não autenticado ao buscar perfil', 'auth', { email });
        setUser(null);
        return null;
      }

      if (!response.ok) {
        logger.error('Erro ao buscar perfil', 'auth', {
          status: response.status,
          statusText: response.statusText,
          email
        });
        setUser(null);
        return null;
      }

      const userData = await response.json();
      logger.info('Dados do usuário recebidos', 'auth', {
        userId: userData.id,
        email: userData.email
      });

      setUser(userData);

      const isComplete = isProfileComplete(userData);
      const isFirst = isFirstLogin(userData);
      setProfileComplete(isComplete);
      setFirstLogin(isFirst);

      // Redirecionar para a página de perfil se for o primeiro login
      if (isFirst && !isComplete) {
        logger.info('Primeiro login detectado, redirecionando para perfil', 'auth', {
          userId: userData.id
        });
        router.push('/perfil');
      }

      return userData;
    } catch (error) {
      logger.error('Erro ao buscar dados do usuário', 'auth', { error, email });
      setUser(null);
      return null;
    }
  }, [router]);

  // Função para atualizar os dados do usuário (pode ser chamada após atualizações)
  const refreshUserData = async () => {
    if (session?.user?.email) {
      logger.info('Atualizando dados do usuário', 'auth', { email: session.user.email });
      return await fetchUserData(session.user.email);
    }
    return null;
  };

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    if (!session) {
      logger.info('Sessão não encontrada, limpando usuário', 'auth');
      setUser(null);
      setIsLoading(false);
      return;
    }

    // Buscar dados completos do usuário
    if (session.user?.email) {
      logger.info('Sessão detectada, buscando dados do usuário', 'auth', {
        email: session.user.email
      });
      setIsLoading(true);
      fetchUserData(session.user.email)
        .catch(error => {
          logger.error('Erro no efeito ao buscar dados', 'auth', { error });
          // Se houver erro ao buscar dados, limpa o usuário
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      logger.warning('Sessão sem email, limpando usuário', 'auth');
      setUser(null);
      setIsLoading(false);
    }
  }, [session, status, fetchUserData]);

  const checkUserAccess = (requiredTypes: UserType[]): boolean => {
    if (!user) return false;
    const hasAccess = requiredTypes.includes(user.userType);

    if (!hasAccess) {
      logger.warning('Tentativa de acesso não autorizado', 'auth', {
        userId: user.id,
        userType: user.userType,
        requiredTypes
      });
    }

    return hasAccess;
  };

  const login = () => {
    logger.info('Iniciando fluxo de login', 'auth');
    signIn('google', { callbackUrl: '/' });
  };

  const logout = () => {
    if (user?.id) {
      logger.info('Iniciando logout', 'auth', { userId: user.id });
    }
    signOut({ callbackUrl: '/' });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isProfileComplete: profileComplete,
        isFirstLogin: firstLogin,
        checkUserAccess,
        login,
        logout,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}