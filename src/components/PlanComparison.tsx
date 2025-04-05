'use client';

import { UserType } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';

interface PlanFeature {
  name: string;
  basic: boolean | string;
  premium: boolean | string;
  admin: boolean | string;
}

export default function PlanComparison() {
  const { user } = useAuth();
  
  const features: PlanFeature[] = [
    {
      name: 'Roteiros por mês',
      basic: '5',
      premium: '20',
      admin: 'Ilimitado'
    },
    {
      name: 'Títulos por mês',
      basic: '10',
      premium: '40',
      admin: 'Ilimitado'
    },
    {
      name: 'Tamanho máximo do roteiro',
      basic: '2.000 caracteres',
      premium: '5.000 caracteres',
      admin: '10.000 caracteres'
    },
    {
      name: 'Geração de imagens',
      basic: false,
      premium: true,
      admin: true
    },
    {
      name: 'Geração de áudio',
      basic: false,
      premium: true,
      admin: true
    },
    {
      name: 'Pacote completo',
      basic: false,
      premium: false,
      admin: true
    },
    {
      name: 'Suporte prioritário',
      basic: false,
      premium: true,
      admin: true
    }
  ];

  // Função para renderizar o valor da feature
  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <span className="text-green-500">✓</span>
      ) : (
        <span className="text-red-500">✗</span>
      );
    }
    return value;
  };

  // Determina qual plano está ativo
  const getActivePlanClass = (planType: string) => {
    if (!user) return '';
    
    const userPlanType = user.userType.toLowerCase();
    return userPlanType === planType.toLowerCase() ? 'border-indigo-500 border-2' : '';
  };

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        Comparação de Planos
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Cabeçalho de features */}
        <div className="hidden md:block">
          <div className="h-20"></div> {/* Espaço para alinhar com os títulos dos planos */}
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 font-medium text-gray-700 dark:text-gray-300"
            >
              {feature.name}
            </div>
          ))}
        </div>
        
        {/* Plano Básico */}
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${getActivePlanClass('basic')}`}>
          <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Básico</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Para começar a criar conteúdo</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">Grátis</p>
          </div>
          
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <span className="md:hidden font-medium text-gray-700 dark:text-gray-300 mr-2">{feature.name}:</span>
              {renderFeatureValue(feature.basic)}
            </div>
          ))}
          
          <div className="p-6 text-center">
            {user?.userType === UserType.BASIC ? (
              <span className="inline-block px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium">
                Plano Atual
              </span>
            ) : (
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium">
                Selecionar Plano
              </button>
            )}
          </div>
        </div>
        
        {/* Plano Premium */}
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${getActivePlanClass('premium')}`}>
          <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700 bg-indigo-50 dark:bg-indigo-900/20">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Premium</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Para criadores de conteúdo</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">R$ 29,90<span className="text-sm font-normal">/mês</span></p>
          </div>
          
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <span className="md:hidden font-medium text-gray-700 dark:text-gray-300 mr-2">{feature.name}:</span>
              {renderFeatureValue(feature.premium)}
            </div>
          ))}
          
          <div className="p-6 text-center">
            {user?.userType === UserType.PREMIUM ? (
              <span className="inline-block px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium">
                Plano Atual
              </span>
            ) : (
              <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                onClick={() => alert('Funcionalidade de pagamento será implementada em breve!')}
              >
                Assinar Plano
              </button>
            )}
          </div>
        </div>
        
        {/* Plano Admin */}
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${getActivePlanClass('admin')}`}>
          <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/20">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Admin</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Para administradores</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">Restrito</p>
          </div>
          
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <span className="md:hidden font-medium text-gray-700 dark:text-gray-300 mr-2">{feature.name}:</span>
              {renderFeatureValue(feature.admin)}
            </div>
          ))}
          
          <div className="p-6 text-center">
            {user?.userType === UserType.ADMIN ? (
              <span className="inline-block px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium">
                Plano Atual
              </span>
            ) : (
              <button 
                className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
                disabled
              >
                Acesso Restrito
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
        <p>Os planos pagos serão implementados em breve. Fique atento às novidades!</p>
      </div>
    </div>
  );
}