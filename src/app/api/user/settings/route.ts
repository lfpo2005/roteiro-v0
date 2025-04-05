import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getUserByEmail, updateUserSettings, getUserSettings } from '@/services/userService';
import { UserSettings } from '@/types/user';

/**
 * API para obter as configurações do usuário
 */
export async function GET(request: NextRequest) {
    try {
        // Verificar autenticação
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        // Buscar usuário pelo email
        const user = await getUserByEmail(session.user.email);
        if (!user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        // Obter configurações do usuário
        const settings = await getUserSettings(user.id);

        // Retornar as configurações
        return NextResponse.json(settings);
    } catch (error) {
        console.error('Erro ao buscar configurações:', error);
        return NextResponse.json({ error: 'Erro ao processar requisição' }, { status: 500 });
    }
}

/**
 * API para atualizar as configurações do usuário
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

        // Validar as configurações recebidas
        const settings: UserSettings = {
            emailNotificacoes: Boolean(data.emailNotificacoes),
            novosRecursos: Boolean(data.novosRecursos),
            dicas: Boolean(data.dicas),
            temaEscuro: Boolean(data.temaEscuro),
        };

        // Buscar usuário pelo email
        const user = await getUserByEmail(session.user.email);
        if (!user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        // Atualizar configurações do usuário
        await updateUserSettings(user.id, settings);

        // Retornar as configurações atualizadas
        return NextResponse.json({
            message: 'Configurações atualizadas com sucesso',
            settings,
        });
    } catch (error) {
        console.error('Erro ao atualizar configurações:', error);
        return NextResponse.json({ error: 'Erro ao processar requisição' }, { status: 500 });
    }
} 