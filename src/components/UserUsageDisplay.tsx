'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getRemainingUsage } from '@/services/userUsageService';
import { getUserLimits } from '@/services/userLimitsService';

interface UsageData {
  remainingScripts: number;
  remainingTitles: number;
  remainingImages: number;
  remainingAudios: number;
}

export default function UserUsageDisplay() {
  const { user } = useAuth();
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsageData() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Obter os limites restantes do usuário
        const remaining = await getRemainingUsage(user.id, user.userType);
        setUsageData(remaining);
      } catch (error) {
        console.error('Erro ao buscar dados de uso:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsageData();
  }, [user]);

  if (!user || isLoading) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  const userLimits = getUserLimits(user.userType);

  // Função para calcular a porcentagem de uso
  const calculatePercentage = (remaining: number, total: number) => {
    if (total === 0) return 0;
    const used = total - remaining;
    return Math.min(100, Math.max(0, (used / total) * 100));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Seu Uso Mensal
      </h2>

      {usageData && (
        <div className="space-y-4">
          {/* Roteiros */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Roteiros
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {usageData.remainingScripts} de {userLimits.maxScriptsPerMonth} restantes
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{
                  width: `${calculatePercentage(
                    usageData.remainingScripts,
                    userLimits.maxScriptsPerMonth
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Títulos */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Títulos
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {usageData.remainingTitles} de {userLimits.maxTitlesPerMonth} restantes
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{
                  width: `${calculatePercentage(
                    usageData.remainingTitles,
                    userLimits.maxTitlesPerMonth
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Imagens - apenas se o usuário tiver acesso */}
          {userLimits.hasAccessToImages && (
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Imagens
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {usageData.remainingImages} de {userLimits.maxImagesPerMonth} restantes
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full"
                  style={{
                    width: `${calculatePercentage(
                      usageData.remainingImages,
                      userLimits.maxImagesPerMonth
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Áudios - apenas se o usuário tiver acesso */}
          {userLimits.hasAccessToAudio && (
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Áudios
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {usageData.remainingAudios} de {userLimits.maxAudiosPerMonth} restantes
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full"
                  style={{
                    width: `${calculatePercentage(
                      usageData.remainingAudios,
                      userLimits.maxAudiosPerMonth
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>Os limites são renovados no início de cada mês.</p>
        {user.userType === 'basic' && (
          <p className="mt-2">
            <a href="/planos" className="text-indigo-600 hover:underline">
              Faça upgrade para o plano Premium para obter mais recursos.  
            </a>
          </p>
        )}
      </div>
    </div>
  );
}