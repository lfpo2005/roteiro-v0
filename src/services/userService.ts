import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
type PrismaUser = Prisma.UserModel;
import { User, UserType, UserSettings } from '@/types/user';

/**
 * Busca um usuário pelo email
 */
export async function getUserByEmail(email: string): Promise<PrismaUser | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}

/**
 * Cria um novo usuário ou atualiza um existente após autenticação
 */
export async function upsertUser(userData: {
  email: string;
  name?: string;
  image?: string;
}): Promise<PrismaUser> {
  return prisma.user.upsert({
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
  return prisma.user.update({
    where: { id: userId },
    data,
  });
}

/**
 * Atualiza as configurações de um usuário
 */
export async function updateUserSettings(userId: string, settings: UserSettings): Promise<PrismaUser> {
  return prisma.user.update({
    where: { id: userId },
    data: {
      settings: settings as any,
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
 * Converte um usuário do Prisma para o tipo User da aplicação
 */
export function mapPrismaUserToAppUser(prismaUser: PrismaUser): User {
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
    settings: prismaUser.settings as unknown as UserSettings || undefined,
  };
}