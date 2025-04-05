import prisma from '@/lib/prisma';
import { UserType } from '@/types/user';
import { getUserLimits, hasReachedLimit } from './userLimitsService';

// Interface para representar o uso de recursos pelo usuário
export interface UserUsage {
  userId: string;
  scriptsUsed: number;
  titlesUsed: number;
  imagesUsed: number;
  audiosUsed: number;
  month: number; // Mês do ano (1-12)
  year: number; // Ano
}

/**
 * Obtém ou cria o registro de uso do usuário para o mês atual
 */
export async function getUserUsage(userId: string): Promise<UserUsage> {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
  const currentYear = now.getFullYear();
  
  // Verifica se já existe um registro para o mês atual
  let usage = await prisma.userUsage.findFirst({
    where: {
      userId,
      month: currentMonth,
      year: currentYear
    }
  });
  
  // Se não existir, cria um novo registro
  if (!usage) {
    usage = await prisma.userUsage.create({
      data: {
        userId,
        month: currentMonth,
        year: currentYear,
        scriptsUsed: 0,
        titlesUsed: 0,
        imagesUsed: 0,
        audiosUsed: 0
      }
    });
  }
  
  return usage;
}

/**
 * Verifica se o usuário pode usar um determinado recurso
 */
export async function canUseResource(
  userId: string,
  userType: UserType,
  resourceType: 'script' | 'title' | 'image' | 'audio'
): Promise<boolean> {
  // Mapeia o tipo de recurso para o campo correspondente no UserUsage
  const resourceMap = {
    script: 'maxScriptsPerMonth',
    title: 'maxTitlesPerMonth',
    image: 'maxImagesPerMonth',
    audio: 'maxAudiosPerMonth'
  } as const;
  
  // Mapeia o tipo de recurso para o campo de uso correspondente
  const usageFieldMap = {
    script: 'scriptsUsed',
    title: 'titlesUsed',
    image: 'imagesUsed',
    audio: 'audiosUsed'
  } as const;
  
  // Verifica se o usuário tem acesso a recursos especiais
  if (resourceType === 'image' && !getUserLimits(userType).hasAccessToImages) {
    return false;
  }
  
  if (resourceType === 'audio' && !getUserLimits(userType).hasAccessToAudio) {
    return false;
  }
  
  // Obtém o uso atual do usuário
  const usage = await getUserUsage(userId);
  
  // Verifica se o usuário atingiu o limite
  return !hasReachedLimit(
    userType,
    resourceMap[resourceType],
    usage[usageFieldMap[resourceType]]
  );
}

/**
 * Incrementa o contador de uso de um recurso
 */
export async function incrementResourceUsage(
  userId: string,
  resourceType: 'script' | 'title' | 'image' | 'audio'
): Promise<void> {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  // Mapeia o tipo de recurso para o campo de uso correspondente
  const usageFieldMap = {
    script: { scriptsUsed: { increment: 1 } },
    title: { titlesUsed: { increment: 1 } },
    image: { imagesUsed: { increment: 1 } },
    audio: { audiosUsed: { increment: 1 } }
  };
  
  // Atualiza o contador de uso
  await prisma.userUsage.upsert({
    where: {
      userId_month_year: {
        userId,
        month: currentMonth,
        year: currentYear
      }
    },
    update: usageFieldMap[resourceType],
    create: {
      userId,
      month: currentMonth,
      year: currentYear,
      scriptsUsed: resourceType === 'script' ? 1 : 0,
      titlesUsed: resourceType === 'title' ? 1 : 0,
      imagesUsed: resourceType === 'image' ? 1 : 0,
      audiosUsed: resourceType === 'audio' ? 1 : 0
    }
  });
}

/**
 * Obtém o uso restante de recursos para o usuário
 */
export async function getRemainingUsage(userId: string, userType: UserType): Promise<{
  remainingScripts: number;
  remainingTitles: number;
  remainingImages: number;
  remainingAudios: number;
}> {
  const usage = await getUserUsage(userId);
  const limits = getUserLimits(userType);
  
  return {
    remainingScripts: Math.max(0, limits.maxScriptsPerMonth - usage.scriptsUsed),
    remainingTitles: Math.max(0, limits.maxTitlesPerMonth - usage.titlesUsed),
    remainingImages: Math.max(0, limits.maxImagesPerMonth - usage.imagesUsed),
    remainingAudios: Math.max(0, limits.maxAudiosPerMonth - usage.audiosUsed)
  };
}