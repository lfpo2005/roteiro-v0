import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Registra o erro do NextAuth
        if (data.error) {
            logger.error(`[NextAuth] ${data.error.type || 'Error'}: ${data.error.message || 'Unknown error'}`, 'auth', {
                ...data.error,
                url: data.url,
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV,
                nextauthUrl: process.env.NEXTAUTH_URL,
                host: request.headers.get('host'),
                referer: request.headers.get('referer'),
                userAgent: request.headers.get('user-agent'),
            });
        } else {
            // Registra informações do NextAuth
            logger.info(`[NextAuth] ${data.type || 'Info'}`, 'auth', {
                ...data,
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV,
                nextauthUrl: process.env.NEXTAUTH_URL,
                host: request.headers.get('host'),
                referer: request.headers.get('referer'),
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        logger.error(`Erro no endpoint de log de auth`, 'auth', { error });
        return NextResponse.json({ success: false, error: 'Failed to log' }, { status: 500 });
    }
} 