//users取得API（ログインしてる人のDB上のユーザー情報を返す）用の型　※API用に型を作り替え
// /api/users/meにて使用

export type GetMeResponse = {
  user: {
    id: string;
    email: string;
    nickname: string;
  } | null;
};
