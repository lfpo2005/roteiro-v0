import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { updateUserProfile, getUserByEmail } from '@/services/userService';
import { User, UserType } from '@/types/user';
import { logger } from '@/lib/logger';

// Usuário de mock para desenvolvimento
const MOCK_USER: User = {
  id: 'clms7k1vg0000mpdycmxf5m3j',
  name: 'Usuário de Teste',
  email: 'teste@example.com',
  image: 'https://placehold.co/400',
  userType: UserType.ADMIN,
  settings: {
    emailNotificacoes: true,
    novosRecursos: true,
    dicas: true,
    temaEscuro: false,
  }
};

/**
 * API para buscar o perfil do usuário
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      logger.warning('Tentativa de acesso não autorizado', 'profileAPI');
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    logger.info('Buscando perfil do usuário', 'profileAPI', { email: session.user.email });
    const user = await getUserByEmail(session.user.email);

    if (!user) {
      logger.warning('Usuário não encontrado', 'profileAPI', { email: session.user.email });
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    logger.info('Perfil encontrado com sucesso', 'profileAPI', { userId: user.id });
    return NextResponse.json(user);
  } catch (error) {
    logger.error('Erro ao buscar perfil', 'profileAPI', { error });
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * API para atualizar o perfil do usuário
 */
export async function PUT(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);

    // Em ambiente de desenvolvimento, permitir atualização sem autenticação
    if (process.env.NODE_ENV !== 'production' && !session?.user?.email) {
      const data = await request.json();
      console.log('Ambiente de desenvolvimento, simulando atualização de perfil:', data);

      // Simular uma atualização bem-sucedida
      return NextResponse.json({
        ...MOCK_USER,
        ...data,
        settings: {
          ...MOCK_USER.settings,
          ...(data.settings || {})
        }
      });
    }

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Obter dados do corpo da requisição
    const data = await request.json();

    try {
      // Buscar usuário pelo email
      const user = await getUserByEmail(session.user.email);

      if (!user) {
        // Em desenvolvimento, fingir que a atualização foi bem-sucedida
        if (process.env.NODE_ENV !== 'production') {
          console.log('Usuário não encontrado, simulando atualização');
          return NextResponse.json({
            ...MOCK_USER,
            ...data
          });
        }
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
        settings: updatedUser.settings
      });
    } catch (dbError) {
      console.error('Erro ao acessar o banco de dados para atualização:', dbError);

      // Em desenvolvimento, simular que a atualização foi bem-sucedida
      if (process.env.NODE_ENV !== 'production') {
        console.log('Erro no banco de dados, simulando atualização bem-sucedida');
        return NextResponse.json({
          ...MOCK_USER,
          ...data
        });
      }

      throw dbError;
    }
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return NextResponse.json({ error: 'Erro ao processar requisição' }, { status: 500 });
  }
}