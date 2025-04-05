'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProfileForm from '@/components/ProfileForm';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PerfilPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Redirecionar para a página de login se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isLoading, isAuthenticated, router]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Carregando...</h1>
          <p>Por favor, aguarde enquanto carregamos seus dados.</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Não renderiza nada, pois o useEffect vai redirecionar
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Perfil do Cliente
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Complete seu cadastro para aproveitar todos os recursos da plataforma
          </p>
        </div>
        
        <ProfileForm />
      </div>
    </div>
  );
}