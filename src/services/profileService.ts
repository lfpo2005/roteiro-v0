import { User } from '@/types/user';

/**
 * Verifica se o perfil do usuário está completo
 * Um perfil é considerado completo quando possui pelo menos
 * nome, telefone e documento (campos obrigatórios)
 */
export function isProfileComplete(user: User | null): boolean {
  if (!user) return false;
  
  return !!(
    user.name && 
    user.telefone && 
    user.documento
  );
}

/**
 * Verifica se é o primeiro login do usuário
 * Consideramos primeiro login quando o usuário tem apenas
 * os dados básicos do Google (nome, email, imagem)
 */
export function isFirstLogin(user: User | null): boolean {
  if (!user) return false;
  
  // Se o usuário tem apenas os dados básicos do Google
  return !!(
    user.name && 
    user.email && 
    !user.telefone && 
    !user.documento
  );
}