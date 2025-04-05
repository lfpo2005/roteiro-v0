import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { logger } from './lib/logger';

// Rotas que não necessitam de autenticação
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/error',
  '/auth/signout',
  '/api/auth',
  '/doc/autenticacao',
];

// Middleware principal
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Capturar detalhes de requisições relacionadas à autenticação
  if (pathname.startsWith('/api/auth')) {
    const authType = pathname.split('/').pop();
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
    const redirectUrl = request.nextUrl.searchParams.get('redirect');
    const error = request.nextUrl.searchParams.get('error');

    // Log de informações sobre a requisição de auth
    logger.info(`Auth request: ${authType}`, 'middleware', {
      url: request.nextUrl.toString(),
      path: pathname,
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
    if (authType === 'callback' && pathname.includes('google') && error) {
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

    return NextResponse.next();
  }

  // Verificar se a rota é pública
  const isPublicRoute = publicRoutes.some(route => {
    // Verificar exatamente ou se começa com a rota pública + /
    return pathname === route ||
      pathname.startsWith(`${route}/`) ||
      pathname.startsWith('/api/');
  });

  // Se for rota pública, permite o acesso diretamente
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Busca o token JWT de autenticação
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // Se não houver token e a rota requer autenticação, redirecionar para login
  if (!token) {
    const url = new URL('/auth/signin', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));

    return NextResponse.redirect(url);
  }

  // Se estiver autenticado, permite acessar a rota protegida
  return NextResponse.next();
}

// Configurar em quais rotas o middleware será executado
export const config = {
  matcher: [
    // Aplicar em todas as rotas exceto arquivos estáticos, imagens, etc
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)',
  ],
}; 