'use client';

import { ReactNode } from 'react';
import { UserType } from '@/types/user';
import AuthGuard from './AuthGuard';

interface ProtectedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  requiredTypes?: UserType[];
  onUnauthorized?: () => void;
}

/**
 * Botão protegido que verifica a autenticação e o nível de acesso do usuário
 * antes de permitir a ação.
 */
export default function ProtectedButton({
  children,
  onClick,
  className = 'w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200',
  requiredTypes = [UserType.BASIC, UserType.PREMIUM, UserType.ADMIN],
  onUnauthorized,
}: ProtectedButtonProps) {
  return (
    <AuthGuard 
      requiredTypes={requiredTypes}
      onUnauthorized={onUnauthorized}
      className="inline-block"
    >
      <button 
        className={className}
        onClick={onClick}
      >
        {children}
      </button>
    </AuthGuard>
  );
}