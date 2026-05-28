import { AuthProvider } from '@/generated/prisma';

export type UserResponseType = {
  nickname: string | null;
  email: string;
  authProvider: AuthProvider;
  activeFamilyId: string | null;
};
