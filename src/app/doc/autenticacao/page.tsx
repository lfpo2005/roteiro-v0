'use client';

import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function DocumentacaoAutenticacao() {
    const { user, isAuthenticated } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (user?.userType === 'admin') {
            setIsAdmin(true);
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6 md:p-10">
            <header className="max-w-7xl mx-auto mb-12">
                <Navbar />
            </header>

            <main className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Autenticação e Cadastro de Usuários
                    </h1>

                    <div className="prose dark:prose-invert max-w-none">
                        <h2>Visão Geral</h2>
                        <p>
                            Nossa aplicação usa exclusivamente autenticação com o Google para garantir
                            uma experiência segura e simplificada. Os usuários não precisam criar ou
                            lembrar de senhas adicionais.
                        </p>

                        <h2>Fluxo de Autenticação</h2>
                        <ol>
                            <li>
                                <strong>Início de sessão</strong>: O usuário clica no botão "Entrar" ou
                                tenta acessar uma funcionalidade protegida
                            </li>
                            <li>
                                <strong>Autenticação com Google</strong>: O usuário é redirecionado para a
                                tela de login do Google, onde fornece suas credenciais
                            </li>
                            <li>
                                <strong>Redirecionamento</strong>: Após autenticação bem-sucedida, o usuário
                                é redirecionado de volta para nossa aplicação
                            </li>
                            <li>
                                <strong>Criação/Atualização de conta</strong>: Se for o primeiro login, uma
                                conta é criada automaticamente para o usuário; caso contrário, os dados
                                da conta são atualizados
                            </li>
                            <li>
                                <strong>Configuração de perfil</strong>: Novos usuários são incentivados a
                                completar seus perfis na primeira visita
                            </li>
                        </ol>

                        <h2>Tipos de Usuário</h2>
                        <ul>
                            <li>
                                <strong>Básico</strong>: Acesso a funcionalidades essenciais (criação de
                                títulos e roteiros)
                            </li>
                            <li>
                                <strong>Premium</strong>: Acesso a recursos avançados (geração de imagens
                                e áudio)
                            </li>
                            <li>
                                <strong>Admin</strong>: Acesso completo, incluindo gerenciamento do sistema
                            </li>
                        </ul>

                        <h2>Dados Armazenados</h2>
                        <p>
                            Armazenamos apenas as informações necessárias para o funcionamento do serviço:
                        </p>
                        <ul>
                            <li>Nome (obtido do Google)</li>
                            <li>Email (obtido do Google)</li>
                            <li>Foto de perfil (obtida do Google)</li>
                            <li>Tipo de usuário</li>
                            <li>Configurações de preferências</li>
                            <li>Dados de perfil complementares (opcional)</li>
                        </ul>

                        <h2>Segurança</h2>
                        <p>
                            Todos os dados são armazenados de forma segura em nosso banco de dados.
                            Não armazenamos senhas, já que a autenticação é feita exclusivamente pelo Google.
                        </p>

                        {isAdmin && (
                            <>
                                <h2 className="text-indigo-600 dark:text-indigo-400">Informações para Administradores</h2>
                                <p>
                                    Como administrador, você pode ver informações sobre o status atual da sua sessão:
                                </p>

                                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md overflow-auto my-4">
                                    <pre className="text-xs">
                                        {JSON.stringify({ isAuthenticated, user }, null, 2)}
                                    </pre>
                                </div>
                            </>
                        )}

                        <Link
                            href="/"
                            className="inline-block mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Voltar para a página inicial
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
} 