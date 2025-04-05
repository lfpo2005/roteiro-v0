'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { UserType, UserSettings } from '@/types/user';
import Link from 'next/link';

export default function ConfiguracoesPage() {
    const { user, isLoading, isAuthenticated, refreshUserData } = useAuth();
    const router = useRouter();

    const [notificacoes, setNotificacoes] = useState({
        emailNotificacoes: true,
        novosRecursos: true,
        dicas: true,
    });

    const [temaEscuro, setTemaEscuro] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingSettings, setIsLoadingSettings] = useState(true);
    const [message, setMessage] = useState('');

    // Redirecionar para a página de login se não estiver autenticado
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/signin');
        }
    }, [isLoading, isAuthenticated, router]);

    // Carregar configurações do usuário
    useEffect(() => {
        if (user?.id) {
            setIsLoadingSettings(true);
            fetch('/api/user/settings')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Falha ao carregar configurações');
                    }
                    return response.json();
                })
                .then((settings: UserSettings) => {
                    setNotificacoes({
                        emailNotificacoes: settings.emailNotificacoes,
                        novosRecursos: settings.novosRecursos,
                        dicas: settings.dicas,
                    });
                    setTemaEscuro(settings.temaEscuro);
                })
                .catch(error => {
                    console.error('Erro ao carregar configurações:', error);
                })
                .finally(() => {
                    setIsLoadingSettings(false);
                });
        }
    }, [user]);

    const handleNotificacaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setNotificacoes(prev => ({ ...prev, [name]: checked }));
    };

    const handleTemaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTemaEscuro(e.target.checked);
        // Aqui você poderia implementar a lógica para alternar entre temas claro/escuro
        // Por exemplo, adicionar/remover classes ao documento ou usar um context de tema
    };

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');

        try {
            const response = await fetch('/api/user/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...notificacoes,
                    temaEscuro,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao salvar configurações');
            }

            // Atualizar dados do usuário no contexto de autenticação
            await refreshUserData();

            setMessage('Configurações salvas com sucesso!');
        } catch (error) {
            setMessage(`Erro: ${error instanceof Error ? error.message : 'Ocorreu um erro desconhecido'}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6 md:p-10">
                <div className="max-w-7xl mx-auto mb-12">
                    <Navbar />
                </div>
                <div className="flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Carregando...</h1>
                        <p>Por favor, aguarde enquanto carregamos seus dados.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Não renderiza nada, pois o useEffect vai redirecionar
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6 md:p-10">
            <div className="max-w-7xl mx-auto mb-12">
                <Navbar />
            </div>

            <main className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Configurações
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Personalize sua experiência na plataforma
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    {message && (
                        <div className={`p-4 ${message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message}
                        </div>
                    )}

                    <div className="p-6">
                        {isLoadingSettings ? (
                            <div className="text-center py-8">
                                <p>Carregando configurações...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSaveSettings}>
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                                        Preferências de Notificações
                                    </h2>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="emailNotificacoes" className="text-gray-700 dark:text-gray-300">
                                                Receber notificações por e-mail
                                            </label>
                                            <div className="relative inline-block w-12 h-6 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-gray-200 dark:bg-gray-700">
                                                <input
                                                    type="checkbox"
                                                    id="emailNotificacoes"
                                                    name="emailNotificacoes"
                                                    checked={notificacoes.emailNotificacoes}
                                                    onChange={handleNotificacaoChange}
                                                    className="sr-only"
                                                />
                                                <span
                                                    aria-hidden="true"
                                                    className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200 ${notificacoes.emailNotificacoes ? 'translate-x-6' : 'translate-x-0'
                                                        }`}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <label htmlFor="novosRecursos" className="text-gray-700 dark:text-gray-300">
                                                Novidades e recursos
                                            </label>
                                            <div className="relative inline-block w-12 h-6 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-gray-200 dark:bg-gray-700">
                                                <input
                                                    type="checkbox"
                                                    id="novosRecursos"
                                                    name="novosRecursos"
                                                    checked={notificacoes.novosRecursos}
                                                    onChange={handleNotificacaoChange}
                                                    className="sr-only"
                                                />
                                                <span
                                                    aria-hidden="true"
                                                    className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200 ${notificacoes.novosRecursos ? 'translate-x-6' : 'translate-x-0'
                                                        }`}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <label htmlFor="dicas" className="text-gray-700 dark:text-gray-300">
                                                Dicas e sugestões
                                            </label>
                                            <div className="relative inline-block w-12 h-6 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-gray-200 dark:bg-gray-700">
                                                <input
                                                    type="checkbox"
                                                    id="dicas"
                                                    name="dicas"
                                                    checked={notificacoes.dicas}
                                                    onChange={handleNotificacaoChange}
                                                    className="sr-only"
                                                />
                                                <span
                                                    aria-hidden="true"
                                                    className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200 ${notificacoes.dicas ? 'translate-x-6' : 'translate-x-0'
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                                        Aparência
                                    </h2>

                                    <div className="flex items-center justify-between">
                                        <label htmlFor="temaEscuro" className="text-gray-700 dark:text-gray-300">
                                            Tema escuro
                                        </label>
                                        <div className="relative inline-block w-12 h-6 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-gray-200 dark:bg-gray-700">
                                            <input
                                                type="checkbox"
                                                id="temaEscuro"
                                                checked={temaEscuro}
                                                onChange={handleTemaChange}
                                                className="sr-only"
                                            />
                                            <span
                                                aria-hidden="true"
                                                className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200 ${temaEscuro ? 'translate-x-6' : 'translate-x-0'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {user?.userType === UserType.ADMIN && (
                                    <div className="mb-8">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                                            Configurações de Administrador
                                        </h2>

                                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                                            <p className="text-indigo-700 dark:text-indigo-300 mb-3">
                                                Acesso ao painel administrativo completo
                                            </p>
                                            <Link href="/admin" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                                                Ir para o Painel de Administração →
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-8 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? 'Salvando...' : 'Salvar Configurações'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
} 