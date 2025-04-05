'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
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

                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Página não encontrada</h2>

                <p className="text-gray-600 dark:text-gray-400">
                    Desculpe, a página que você está procurando não existe ou foi movida.
                </p>

                <div className="mt-8">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Voltar para a página inicial
                    </Link>
                </div>
            </div>
        </div>
    );
} 