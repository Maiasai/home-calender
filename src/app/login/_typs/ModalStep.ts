//ログインのモーダル切り替え用

export type ModalStep = //意）ModalStepという型は'select' か 'email'　どちらかしか使えない
  | 'select' //メールor他の選択
  | 'email' //メール入力
  | 'verifyCode' //新規；認証コード入力
  | 'newregistration' //新規；登録
  | 'login' //ログイン（パスワード入力、既存ユーザー）
  | 'resetEmail' //パスワードリセット（メールアドレス入力）
  | 'resetPassword'; //パスワードリセット（新しいパスワードを入力）
