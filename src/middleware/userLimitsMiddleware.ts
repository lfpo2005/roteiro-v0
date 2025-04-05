import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { canUseResource } from '@/services/userUsageService';
import { UserType } from '@/types/user';

/**
 * Middleware para verificar se o usuário pode usar um determinado recurso
 * baseado em seu tipo e uso atual
 */
export async function checkResourceAccess(
  req: NextRequest,
  resourceType: 'script' | 'title' | 'image' | 'audio'
) {
  try {
    // Obter o token do usuário
    const token = await getToken({ req });

    if (!token || !token.id) {
      return {
        allowed: false,
        message: 'Usuário não autenticado',
        status: 401
      };
    }

    const userId = token.id as string;
    const userType = (token.userType as UserType) || UserType.BASIC;

    // Verificar se o usuário pode usar o recurso
    const canUse = await canUseResource(userId, userType, resourceType);

    if (!canUse) {
      return {
        allowed: false,
        message: `Você atingiu o limite de ${resourceType}s para seu plano atual`,
        status: 403
      };
    }

    return {
      allowed: true,
      message: 'Acesso permitido',
      status: 200
    };
  } catch (error) {
    console.error('Erro ao verificar acesso a recurso:', error);
    return {
      allowed: false,
      message: 'Erro ao verificar acesso',
      status: 500
    };
  }
}

/**
 * Middleware para verificar se o conteúdo do roteiro excede o tamanho máximo
 * permitido para o tipo de usuário
 */
export async function checkScriptLength(
  req: NextRequest,
  scriptContent: string
) {
  try {
    // Obter o token do usuário
    const token = await getToken({ req });

    if (!token || !token.id) {
      return {
        allowed: false,
        message: 'Usuário não autenticado',
        status: 401
      };
    }

    const userType = (token.userType as UserType) || UserType.BASIC;

    // Obter os limites do usuário
    const limits = getUserLimits(userType);

    // Verificar se o conteúdo excede o tamanho máximo
    if (scriptContent.length > limits.maxScriptLength) {
      return {
        allowed: false,
        message: `O roteiro excede o tamanho máximo permitido para seu plano (${limits.maxScriptLength} caracteres)`,
        status: 413 // Payload Too Large
      };
    }

    return {
      allowed: true,
      message: 'Tamanho do roteiro dentro do limite',
      status: 200
    };
  } catch (error) {
    console.error('Erro ao verificar tamanho do roteiro:', error);
    return {
      allowed: false,
      message: 'Erro ao verificar tamanho do roteiro',
      status: 500
    };
  }
}

// Importação necessária para o checkScriptLength
import { getUserLimits } from '@/services/userLimitsService';