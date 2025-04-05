'use client';

import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { logger } from '@/lib/logger';

// Componente para o loading state
function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Verificando autenticação...</p>
      </div>
    </div>
  );
}

// Componente interno que usa searchParams
function SignInContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const errorType = searchParams.get('error');

  useEffect(() => {
    // Verificar erros na URL
    if (errorType) {
      setError(getErrorMessage(errorType));
      logger.error('Erro na autenticação', 'auth', { errorType });
    }

    // Redirecionar se já autenticado
    if (status === 'authenticated') {
      logger.info('Usuário já autenticado, redirecionando', 'auth');
      router.push(callbackUrl);
    }
  }, [errorType, status, router, callbackUrl]);

  const getErrorMessage = (errorType: string): string => {
    switch (errorType) {
      case 'OAuthSignin':
        return 'Erro ao iniciar a autenticação com o Google.';
      case 'OAuthCallback':
        return 'Erro ao processar o retorno da autenticação.';
      case 'OAuthCreateAccount':
        return 'Não foi possível criar a conta com o Google.';
      case 'EmailCreateAccount':
        return 'Não foi possível criar a conta com o email.';
      case 'Callback':
        return 'Erro durante o processo de callback.';
      case 'OAuthAccountNotLinked':
        return 'Este email já está associado a outra conta.';
      case 'AccessDenied':
        return 'Acesso negado. Você não tem permissão para acessar este recurso.';
      default:
        return 'Ocorreu um erro na autenticação. Tente novamente.';
    }
  };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      logger.info('Iniciando autenticação com Google', 'auth');
      await signIn('google', { callbackUrl });
    } catch (error) {
      logger.error('Erro ao fazer login com Google', 'auth', { error });
      setError('Ocorreu um erro ao tentar fazer login. Tente novamente.');
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Link href="/">
              <Image
                src="/roteiro-logo.svg"
                alt="Logo Roteiro"
                width={180}
                height={40}
                className="dark:invert"
                priority
              />
            </Link>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Bem-vindo ao Roteiro</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Faça login para acessar todos os recursos
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
                Entrar com Google
              </>
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}

// Componente principal que envolve o conteúdo com Suspense
export default function SignIn() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SignInContent />
    </Suspense>
  );
}