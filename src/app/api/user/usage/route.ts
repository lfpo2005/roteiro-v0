import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getRemainingUsage } from '@/services/userUsageService';
import { getUserLimits } from '@/services/userLimitsService';
import { UserType } from '@/types/user';

/**
 * API para obter informações sobre o uso de recursos do usuário
 */
export async function GET() {
  try {
    // Verificar se o usuário está autenticado
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id as string;
    const userType = (session.user.userType as UserType) || UserType.BASIC;
    
    // Obter os limites do usuário
    const limits = getUserLimits(userType);
    
    // Obter o uso atual do usuário
    const usage = await getRemainingUsage(userId, userType);
    
    return NextResponse.json({
      limits,
      usage,
      userType
    });
  } catch (error) {
    console.error('Erro ao obter uso do usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a solicitação' },
      { status: 500 }
    );
  }
}