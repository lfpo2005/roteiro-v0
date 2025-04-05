'use client';

import { ReactNode, MouseEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserType } from '@/types/user';

interface AuthGuardProps {
  children: ReactNode;
  requiredTypes?: UserType[];
  onUnauthorized?: () => void;
  className?: string;
}

/**
 * Componente que intercepta cliques e verifica se o usuário está autenticado
 * e tem o nível de acesso necessário para a funcionalidade.
 */
export default function AuthGuard({
  children,
  requiredTypes = [UserType.BASIC, UserType.PREMIUM, UserType.ADMIN],
  onUnauthorized,
  className,
}: AuthGuardProps) {
  const { isAuthenticated, checkUserAccess, login } = useAuth();

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    // Impede a propagação do evento para não acionar o evento original
    e.preventDefault();
    e.stopPropagation();

    // Verifica se o usuário está autenticado
    if (!isAuthenticated) {
      // Redireciona para a página de login
      login();
      return;
    }

    // Verifica se o usuário tem o nível de acesso necessário
    if (!checkUserAccess(requiredTypes)) {
      // Executa a função de não autorizado, se fornecida
      if (onUnauthorized) {
        onUnauthorized();
      } else {
        // Exibe um alerta padrão
        alert('Você não tem permissão para acessar esta funcionalidade.');
      }
      return;
    }

    // Se o usuário está autenticado e tem permissão, permite o clique original
    // Encontra o primeiro elemento clicável dentro do children
    const clickableElement = e.currentTarget.querySelector('button, a, [role="button"]');
    if (clickableElement) {
      (clickableElement as HTMLElement).click();
    }
  };

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  );
}