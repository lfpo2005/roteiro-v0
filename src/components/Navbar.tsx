'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { UserType } from '@/types/user';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="w-full">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <Link href="/">
                        <Image
                            src="/roteiro-logo.svg"
                            alt="Roteiro YouTube Logo"
                            width={180}
                            height={40}
                            priority
                            className="dark:invert"
                        />
                    </Link>
                </div>

                <nav className="flex items-center gap-3">
                    {!isAuthenticated ? (
                        <Link
                            href="/auth/signin"
                            className="px-5 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
                        >
                            Entrar
                        </Link>
                    ) : (
                        <>
                            <div className="relative">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
                                >
                                    {user?.image ? (
                                        <Image
                                            src={user.image}
                                            alt="Foto de perfil"
                                            width={28}
                                            height={28}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                                            {user?.name?.charAt(0) || user?.email?.charAt(0) || '?'}
                                        </div>
                                    )}
                                    <span className="text-sm font-medium">{user?.name?.split(' ')[0] || 'Usuário'}</span>
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                                        <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                                            {user?.email}
                                        </div>

                                        <Link
                                            href="/perfil"
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Meu Perfil
                                        </Link>

                                        <Link
                                            href="/configuracoes"
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Configurações
                                        </Link>

                                        {user?.userType === UserType.ADMIN && (
                                            <Link
                                                href="/admin"
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Painel de Administração
                                            </Link>
                                        )}

                                        <button
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                logout();
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 border-t border-gray-100 dark:border-gray-700"
                                        >
                                            Sair
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
} 