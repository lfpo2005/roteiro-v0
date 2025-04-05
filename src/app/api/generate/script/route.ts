import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { canUseResource, incrementResourceUsage } from '@/services/userUsageService';
import { getUserLimits } from '@/services/userLimitsService';
import { UserType } from '@/types/user';

/**
 * API para gerar roteiros para vídeos do YouTube
 * Verifica se o usuário pode usar o recurso baseado em seu tipo e uso atual
 * e se o tamanho do roteiro está dentro do limite permitido
 */
export async function POST(req: NextRequest) {
  try {
    // Obter o token do usuário
    const token = await getToken({ req });
    
    if (!token || !token.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }
    
    const userId = token.id as string;
    const userType = (token.userType as UserType) || UserType.BASIC;
    
    // Verificar se o usuário pode usar o recurso
    const canUse = await canUseResource(userId, userType, 'script');
    
    if (!canUse) {
      return NextResponse.json(
        { error: 'Você atingiu o limite de roteiros para seu plano atual' },
        { status: 403 }
      );
    }
    
    // Obter os dados da requisição
    const data = await req.json();
    const { topic, keywords, tone, length } = data;
    
    if (!topic) {
      return NextResponse.json(
        { error: 'O tópico é obrigatório' },
        { status: 400 }
      );
    }
    
    // Obter os limites do usuário
    const limits = getUserLimits(userType);
    
    // Verificar se o comprimento solicitado está dentro do limite
    if (length && length > limits.maxScriptLength) {
      return NextResponse.json(
        { 
          error: `O tamanho solicitado excede o limite para seu plano (${limits.maxScriptLength} caracteres)`,
          maxLength: limits.maxScriptLength
        },
        { status: 413 }
      );
    }
    
    // Aqui seria implementada a lógica de geração de roteiro
    // Usando alguma API de IA como OpenAI, por exemplo
    
    // Simulando a geração de um roteiro
    const scriptLength = length || Math.min(1000, limits.maxScriptLength);
    const generatedScript = `# Roteiro: ${topic}\n\n## Introdução\n\nOlá, pessoal! Hoje vamos falar sobre ${topic}.\n\n## Desenvolvimento\n\nVamos explorar os seguintes pontos:\n\n1. O que é ${topic}?\n2. Por que ${topic} é importante?\n3. Como aplicar ${topic} no seu dia a dia.\n\n## Conclusão\n\nEspero que tenham gostado deste vídeo sobre ${topic}. Não se esqueçam de deixar o like e se inscrever no canal!`;
    
    // Verificar se o roteiro gerado está dentro do limite
    if (generatedScript.length > limits.maxScriptLength) {
      return NextResponse.json(
        { 
          error: `O roteiro gerado excede o limite para seu plano (${limits.maxScriptLength} caracteres)`,
          maxLength: limits.maxScriptLength
        },
        { status: 413 }
      );
    }
    
    // Incrementar o contador de uso
    await incrementResourceUsage(userId, 'script');
    
    return NextResponse.json({
      script: generatedScript,
      message: 'Roteiro gerado com sucesso',
      length: generatedScript.length,
      maxLength: limits.maxScriptLength
    });
  } catch (error) {
    console.error('Erro ao gerar roteiro:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a solicitação' },
      { status: 500 }
    );
  }
}