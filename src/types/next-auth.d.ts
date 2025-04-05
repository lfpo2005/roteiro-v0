import { UserType } from './user';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
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
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userType?: UserType;
  }
}