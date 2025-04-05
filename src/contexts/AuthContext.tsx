'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, UserType } from '@/types/user';
import { isProfileComplete, isFirstLogin } from '@/services/profileService';

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
  const fetchUserData = async (email: string) => {
    try {
      const response = await fetch(`/api/user/profile?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        const isComplete = isProfileComplete(userData);
        const isFirst = isFirstLogin(userData);
        setProfileComplete(isComplete);
        setFirstLogin(isFirst);

        // Redirecionar para a página de perfil se for o primeiro login
        if (isFirst && !isComplete) {
          router.push('/perfil');
        }

        return userData;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
  };

  // Função para atualizar os dados do usuário (pode ser chamada após atualizações)
  const refreshUserData = async () => {
    if (session?.user?.email) {
      await fetchUserData(session.user.email);
    }
  };

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    if (!session) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    // Buscar dados completos do usuário
    if (session.user?.email) {
      setIsLoading(true);
      fetchUserData(session.user.email)
        .finally(() => setIsLoading(false));
    } else {
      // Fallback para os dados básicos da sessão se não conseguir buscar do banco
      const currentUser: User = {
        id: session.user?.id || '',
        name: session.user?.name || '',
        email: session.user?.email || '',
        image: session.user?.image || '',
        userType: (session.user?.userType as UserType) || UserType.BASIC,
      };

      setUser(currentUser);
      setProfileComplete(isProfileComplete(currentUser));
      setFirstLogin(isFirstLogin(currentUser));
      setIsLoading(false);
    }
  }, [session, status, router]);

  const checkUserAccess = (requiredTypes: UserType[]): boolean => {
    if (!user) return false;
    return requiredTypes.includes(user.userType);
  };

  const login = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const logout = () => {
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