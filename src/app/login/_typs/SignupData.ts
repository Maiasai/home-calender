//新規登録・ログイン　モーダルで使用

export interface SignupData {
  // handleSubmit から渡される data の型
  nickname: string;
  password?: string | null;
  confirmPassword?: string | null;
}
