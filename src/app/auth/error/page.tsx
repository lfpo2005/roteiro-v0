'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { logger } from '@/lib/logger';

// Componente de loading
function LoadingState() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando...</p>
            </div>
        </div>
    );
}

// Componente interno que usa searchParams
function AuthErrorContent() {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    useEffect(() => {
        if (error) {
            logger.error('Erro de autenticação', 'auth', { errorType: error });
            setErrorMessage(getErrorMessage(error));
        }
    }, [error]);

    const getErrorMessage = (errorType: string): string => {
        switch (errorType) {
            case 'Configuration':
                return 'Há um problema com a configuração do servidor. Entre em contato com o administrador do site.';
            case 'AccessDenied':
                return 'Acesso negado. Você não tem permissão para acessar este recurso.';
            case 'Verification':
                return 'O link de verificação expirou ou já foi usado.';
            case 'OAuthSignin':
                return 'Erro ao iniciar a autenticação com o provedor.';
            case 'OAuthCallback':
                return 'Erro ao processar o retorno da autenticação.';
            case 'OAuthCreateAccount':
                return 'Não foi possível criar a conta com o provedor de autenticação.';
            case 'EmailCreateAccount':
                return 'Não foi possível criar a conta com o email.';
            case 'Callback':
                return 'Erro durante o processo de callback.';
            case 'OAuthAccountNotLinked':
                return 'Este email já está associado a outra conta.';
            case 'CredentialsSignin':
                return 'As credenciais fornecidas estão incorretas.';
            case 'SessionRequired':
                return 'É necessário fazer login para acessar esta página.';
            default:
                return 'Ocorreu um erro durante a autenticação. Tente novamente.';
        }
    };

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
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Erro de Autenticação</h2>

                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400">
                        <p>{errorMessage || 'Ocorreu um erro durante o processo de autenticação.'}</p>
                    </div>

                    <div className="mt-8 space-y-4">
                        <Link
                            href="/auth/signin"
                            className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Tentar novamente
                        </Link>

                        <Link
                            href="/"
                            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Voltar para a página inicial
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Componente principal que envolve o conteúdo com Suspense
export default function AuthError() {
    return (
        <Suspense fallback={<LoadingState />}>
            <AuthErrorContent />
        </Suspense>
    );
} 