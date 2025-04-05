import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { canUseResource, incrementResourceUsage } from '@/services/userUsageService';
import { UserType } from '@/types/user';

/**
 * API para gerar títulos para vídeos do YouTube
 * Verifica se o usuário pode usar o recurso baseado em seu tipo e uso atual
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
    const canUse = await canUseResource(userId, userType, 'title');
    
    if (!canUse) {
      return NextResponse.json(
        { error: 'Você atingiu o limite de títulos para seu plano atual' },
        { status: 403 }
      );
    }
    
    // Obter os dados da requisição
    const data = await req.json();
    const { topic, keywords } = data;
    
    if (!topic) {
      return NextResponse.json(
        { error: 'O tópico é obrigatório' },
        { status: 400 }
      );
    }
    
    // Aqui seria implementada a lógica de geração de título
    // Usando alguma API de IA como OpenAI, por exemplo
    
    // Simulando a geração de um título
    const generatedTitle = `Como ${topic} pode transformar ${keywords || 'sua vida'} | Guia Completo 2023`;
    
    // Incrementar o contador de uso
    await incrementResourceUsage(userId, 'title');
    
    return NextResponse.json({
      title: generatedTitle,
      message: 'Título gerado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao gerar título:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a solicitação' },
      { status: 500 }
    );
  }
}