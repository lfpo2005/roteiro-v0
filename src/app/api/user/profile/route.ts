import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { updateUserProfile, getUserByEmail } from '@/services/userService';

/**
 * API para buscar o perfil do usuário
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Obter email da query ou usar o email da sessão
    const url = new URL(request.url);
    const email = url.searchParams.get('email') || session.user.email;

    // Buscar usuário pelo email
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Retornar dados do usuário (sem informações sensíveis)
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      userType: user.userType,
      telefone: user.telefone,
      endereco: user.endereco,
      cidade: user.cidade,
      estado: user.estado,
      cep: user.cep,
      documento: user.documento,
      dataNascimento: user.dataNascimento,
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return NextResponse.json({ error: 'Erro ao processar requisição' }, { status: 500 });
  }
}

/**
 * API para atualizar o perfil do usuário
 */
export async function PUT(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Obter dados do corpo da requisição
    const data = await request.json();

    // Buscar usuário pelo email
    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Atualizar perfil do usuário
    const updatedUser = await updateUserProfile(user.id, {
      name: data.name,
      telefone: data.telefone,
      endereco: data.endereco,
      cidade: data.cidade,
      estado: data.estado,
      cep: data.cep,
      documento: data.documento,
      dataNascimento: data.dataNascimento ? new Date(data.dataNascimento) : undefined,
    });

    // Retornar usuário atualizado (sem informações sensíveis)
    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
      userType: updatedUser.userType,
      telefone: updatedUser.telefone,
      endereco: updatedUser.endereco,
      cidade: updatedUser.cidade,
      estado: updatedUser.estado,
      cep: updatedUser.cep,
      documento: updatedUser.documento,
      dataNascimento: updatedUser.dataNascimento,
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return NextResponse.json({ error: 'Erro ao processar requisição' }, { status: 500 });
  }
}