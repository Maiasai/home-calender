//ログインユーザー型

export type UserProfile = {
  id: string;
  email: string;
  nickname: string | null;
  activeFamilyId: string | null;
  homeFamilyId: string | null;
};
