'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log do erro no console
        console.error('Erro global da aplicação:', error);
    }, [error]);

    return (
        <html lang="pt-BR">
            <body className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
                <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
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

                    <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">Oops! Algo deu errado</h1>

                    <p className="text-gray-600 dark:text-gray-400 mt-4">
                        Estamos cientes do problema e trabalhando para resolvê-lo o mais rápido possível.
                    </p>

                    <div className="mt-8 space-y-4">
                        <button
                            onClick={() => reset()}
                            className="w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Tentar novamente
                        </button>

                        <Link
                            href="/"
                            className="w-full inline-flex items-center justify-center px-5 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Voltar para a página inicial
                        </Link>
                    </div>
                </div>
            </body>
        </html>
    );
} 