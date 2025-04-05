import prisma from '@/lib/prisma';
import { User as PrismaUser } from '@prisma/client';
import { User, UserType, UserSettings } from '@/types/user';
import { logger } from '@/lib/logger';

/**
 * Busca um usuário pelo email
 */
export async function getUserByEmail(email: string): Promise<PrismaUser | null> {
  try {
    logger.info('Buscando usuário por email', 'userService', { email });
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      logger.warning('Usuário não encontrado', 'userService', { email });
      return null;
    }

    logger.info('Usuário encontrado', 'userService', { userId: user.id });
    return user;
  } catch (error) {
    logger.error('Erro ao buscar usuário por email', 'userService', { error, email });
    throw error;
  }
}

/**
 * Cria um novo usuário ou atualiza um existente após autenticação
 */
export async function upsertUser(userData: {
  email: string;
  name?: string;
  image?: string;
}): Promise<PrismaUser> {
  try {
    logger.info('Criando/atualizando usuário', 'userService', { email: userData.email });
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
        image: userData.image,
        updatedAt: new Date(),
      },
      create: {
        email: userData.email,
        name: userData.name,
        image: userData.image,
        userType: UserType.BASIC,
      },
    });

    logger.info('Usuário criado/atualizado com sucesso', 'userService', { userId: user.id });
    return user;
  } catch (error) {
    logger.error('Erro ao criar/atualizar usuário', 'userService', { error, email: userData.email });
    throw error;
  }
}

/**
 * Atualiza os dados de um usuário
 */
export async function updateUserProfile(userId: string, data: {
  name?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  documento?: string;
  dataNascimento?: Date;
}): Promise<PrismaUser> {
  try {
    logger.info('Atualizando perfil do usuário', 'userService', { userId });
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    logger.info('Perfil atualizado com sucesso', 'userService', { userId });
    return user;
  } catch (error) {
    logger.error('Erro ao atualizar perfil', 'userService', { error, userId });
    throw error;
  }
}

/**
 * Atualiza as configurações de um usuário
 */
export async function updateUserSettings(userId: string, settings: UserSettings): Promise<PrismaUser> {
  // Convertendo para JSON string e de volta para objeto para garantir compatibilidade com Prisma
  const jsonSettings = JSON.parse(JSON.stringify(settings));

  return prisma.user.update({
    where: { id: userId },
    data: {
      // @ts-ignore - necessário para compatibilidade com o Prisma
      settings: jsonSettings,
      updatedAt: new Date(),
    },
  });
}

/**
 * Obtém as configurações de um usuário
 */
export async function getUserSettings(userId: string): Promise<UserSettings> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true },
  });

  // Configurações padrão
  const defaultSettings: UserSettings = {
    emailNotificacoes: true,
    novosRecursos: true,
    dicas: true,
    temaEscuro: false,
  };

  if (!user || !user.settings) {
    return defaultSettings;
  }

  return user.settings as unknown as UserSettings;
}

/**
 * Atualiza o tipo de usuário
 */
export async function updateUserType(userId: string, userType: UserType): Promise<PrismaUser> {
  return prisma.user.update({
    where: { id: userId },
    data: {
      userType,
      updatedAt: new Date(),
    },
  });
}

/**
 * Obtém todos os dados de um usuário
 */
export async function getUserById(userId: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name || undefined,
    email: user.email || undefined,
    image: user.image || undefined,
    userType: user.userType as UserType,
    telefone: user.telefone || undefined,
    endereco: user.endereco || undefined,
    cidade: user.cidade || undefined,
    estado: user.estado || undefined,
    cep: user.cep || undefined,
    documento: user.documento || undefined,
    dataNascimento: user.dataNascimento || undefined,
    settings: user.settings as UserSettings || undefined,
  };
}

/**
 * Valida as configurações do usuário
 */
export function validateUserSettings(settings: Partial<UserSettings>): UserSettings {
  const defaultSettings: UserSettings = {
    emailNotificacoes: true,
    novosRecursos: true,
    dicas: true,
    temaEscuro: false,
  };

  return {
    emailNotificacoes: settings.emailNotificacoes ?? defaultSettings.emailNotificacoes,
    novosRecursos: settings.novosRecursos ?? defaultSettings.novosRecursos,
    dicas: settings.dicas ?? defaultSettings.dicas,
    temaEscuro: settings.temaEscuro ?? defaultSettings.temaEscuro,
  };
}

/**
 * Converte um usuário do Prisma para o tipo User da aplicação
 */
export function convertToUser(prismaUser: PrismaUser): User {
  return {
    id: prismaUser.id,
    name: prismaUser.name || undefined,
    email: prismaUser.email || undefined,
    image: prismaUser.image || undefined,
    userType: prismaUser.userType as UserType,
    telefone: prismaUser.telefone || undefined,
    endereco: prismaUser.endereco || undefined,
    cidade: prismaUser.cidade || undefined,
    estado: prismaUser.estado || undefined,
    cep: prismaUser.cep || undefined,
    documento: prismaUser.documento || undefined,
    dataNascimento: prismaUser.dataNascimento || undefined,
    settings: prismaUser.settings as UserSettings || undefined,
  };
}