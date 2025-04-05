import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserByEmail, updateUserSettings, getUserSettings, validateUserSettings } from '@/services/userService';
import { UserSettings } from '@/types/user';

/**
 * API para obter as configurações do usuário
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const settings = await getUserSettings(session.user.id);
        return NextResponse.json(settings);
    } catch (error) {
        console.error('Erro ao buscar configurações:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar configurações do usuário' },
            { status: 500 }
        );
    }
}

/**
 * API para atualizar as configurações do usuário
 */
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const settings = validateUserSettings(body as Partial<UserSettings>);

        await updateUserSettings(session.user.id, settings);
        return NextResponse.json(settings);
    } catch (error) {
        console.error('Erro ao atualizar configurações:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar configurações do usuário' },
            { status: 500 }
        );
    }
} 