'use client';

import { useAuth } from '@/contexts/AuthContext';
import PlanComparison from '@/components/PlanComparison';
import { getUserLimits } from '@/services/userLimitsService';
import Link from 'next/link';
import Image from 'next/image';

export default function PlanosPage() {
  const { user, isLoading } = useAuth();

  // Se o usuário estiver autenticado, obtém os limites do seu plano atual
  const userLimits = user ? getUserLimits(user.userType) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6 md:p-10">
      <header className="max-w-7xl mx-auto mb-12">
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
          <nav>
            {!isLoading && !user ? (
              <Link
                href="/auth/signin"
                className="px-5 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
              >
                Entrar
              </Link>
            ) : (
              <Link
                href="/perfil"
                className="px-5 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
              >
                Meu Perfil
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <section className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Planos e Preços
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Escolha o plano ideal para suas necessidades de criação de conteúdo para YouTube.
          </p>
        </section>

        {user && (
          <section className="mb-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Seu Plano Atual: <span className="text-indigo-600">{user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}</span>
            </h2>

            {userLimits && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 text-center">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Roteiros Restantes</h3>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{userLimits.maxScriptsPerMonth}</p>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 text-center">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Títulos Restantes</h3>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{userLimits.maxTitlesPerMonth}</p>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 text-center">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Tamanho Máximo</h3>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{userLimits.maxScriptLength.toLocaleString()} caracteres</p>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 text-center">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Recursos Premium</h3>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {userLimits.hasAccessToImages && userLimits.hasAccessToAudio ? 'Disponíveis' : 'Indisponíveis'}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Quer mais recursos? Considere fazer upgrade para um plano premium.
              </p>
            </div>
          </section>
        )}

        <PlanComparison />
      </main>

      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Roteiro YouTube. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}