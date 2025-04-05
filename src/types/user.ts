export enum UserType {
  BASIC = 'basic',
  PREMIUM = 'premium',
  ADMIN = 'admin'
}

export interface UserSettings {
  emailNotificacoes: boolean;
  novosRecursos: boolean;
  dicas: boolean;
  temaEscuro: boolean;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  userType: UserType;

  // Campos adicionais para cadastro de cliente
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  documento?: string;
  dataNascimento?: Date;

  // Configurações do usuário
  settings?: UserSettings;
}