import { NextRequest, NextResponse } from 'next/server';
import { logger } from './lib/logger';

export function middleware(request: NextRequest) {
  // Capturar detalhes de requisições relacionadas à autenticação
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    const authType = request.nextUrl.pathname.split('/').pop();
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
    const redirectUrl = request.nextUrl.searchParams.get('redirect');
    const error = request.nextUrl.searchParams.get('error');
    
    // Log de informações sobre a requisição de auth
    logger.info(`Auth request: ${authType}`, 'middleware', {
      url: request.nextUrl.toString(),
      path: request.nextUrl.pathname,
      authType,
      callbackUrl,
      redirectUrl,
      error,
      headers: {
        host: request.headers.get('host'),
        referer: request.headers.get('referer'),
        'user-agent': request.headers.get('user-agent'),
        'x-forwarded-host': request.headers.get('x-forwarded-host'),
        'x-forwarded-proto': request.headers.get('x-forwarded-proto'),
      },
      nextauthUrl: process.env.NEXTAUTH_URL,
      environment: process.env.NODE_ENV,
    });
    
    // Se for uma callback do Google com erro, registrar com mais detalhes
    if (authType === 'callback' && request.nextUrl.pathname.includes('google') && error) {
      logger.error(`Auth callback error: ${error}`, 'middleware', {
        url: request.nextUrl.toString(),
        error,
        callbackUrl,
        redirectUrl,
        headers: {
          host: request.headers.get('host'),
          referer: request.headers.get('referer'),
          'user-agent': request.headers.get('user-agent'),
          'x-forwarded-host': request.headers.get('x-forwarded-host'),
          'x-forwarded-proto': request.headers.get('x-forwarded-proto'),
        },
        nextauthUrl: process.env.NEXTAUTH_URL,
      });
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/auth/:path*',
    '/auth/:path*'
  ],
}; 