import { UserType } from '@/types/user';

// Interface para definir os limites de cada tipo de usuário
export interface UserLimits {
  // Número máximo de roteiros que o usuário pode criar por mês
  maxScriptsPerMonth: number;
  // Número máximo de títulos que o usuário pode gerar por mês
  maxTitlesPerMonth: number;
  // Número máximo de imagens que o usuário pode gerar por mês
  maxImagesPerMonth: number;
  // Número máximo de áudios que o usuário pode gerar por mês
  maxAudiosPerMonth: number;
  // Tamanho máximo de roteiro (em caracteres)
  maxScriptLength: number;
  // Acesso a recursos premium
  hasAccessToImages: boolean;
  hasAccessToAudio: boolean;
  hasAccessToCompletePackage: boolean;
}

// Definição dos limites para cada tipo de usuário
const USER_LIMITS: Record<UserType, UserLimits> = {
  [UserType.BASIC]: {
    maxScriptsPerMonth: 5,
    maxTitlesPerMonth: 10,
    maxImagesPerMonth: 0,
    maxAudiosPerMonth: 0,
    maxScriptLength: 2000,
    hasAccessToImages: false,
    hasAccessToAudio: false,
    hasAccessToCompletePackage: false,
  },
  [UserType.PREMIUM]: {
    maxScriptsPerMonth: 20,
    maxTitlesPerMonth: 40,
    maxImagesPerMonth: 20,
    maxAudiosPerMonth: 20,
    maxScriptLength: 5000,
    hasAccessToImages: true,
    hasAccessToAudio: true,
    hasAccessToCompletePackage: false,
  },
  [UserType.ADMIN]: {
    maxScriptsPerMonth: 999999, // Ilimitado para administradores
    maxTitlesPerMonth: 999999,
    maxImagesPerMonth: 999999,
    maxAudiosPerMonth: 999999,
    maxScriptLength: 10000,
    hasAccessToImages: true,
    hasAccessToAudio: true,
    hasAccessToCompletePackage: true,
  },
};

/**
 * Retorna os limites para um determinado tipo de usuário
 */
export function getUserLimits(userType: UserType): UserLimits {
  return USER_LIMITS[userType];
}

/**
 * Verifica se o usuário tem acesso a um recurso específico
 */
export function checkUserAccess(userType: UserType, resource: keyof UserLimits): boolean {
  const limits = USER_LIMITS[userType];
  
  // Para recursos booleanos, retorna diretamente o valor
  if (typeof limits[resource] === 'boolean') {
    return limits[resource] as boolean;
  }
  
  // Para recursos numéricos, retorna true se o limite for maior que zero
  if (typeof limits[resource] === 'number') {
    return (limits[resource] as number) > 0;
  }
  
  return false;
}

/**
 * Verifica se o usuário atingiu o limite de um recurso específico
 * Esta função seria usada em conjunto com um contador de uso armazenado no banco de dados
 */
export function hasReachedLimit(
  userType: UserType, 
  resource: 'maxScriptsPerMonth' | 'maxTitlesPerMonth' | 'maxImagesPerMonth' | 'maxAudiosPerMonth',
  currentUsage: number
): boolean {
  const limits = USER_LIMITS[userType];
  return currentUsage >= limits[resource];
}

/**
 * Verifica se o conteúdo do roteiro excede o tamanho máximo permitido
 */
export function isScriptLengthExceeded(userType: UserType, scriptContent: string): boolean {
  const limits = USER_LIMITS[userType];
  return scriptContent.length > limits.maxScriptLength;
}