//新規登録・ログイン　モーダルで使用

export interface LoginModalProps {
  setLoginModalOpen: (v: boolean) => void;
  open: boolean;
  onClose: () => void; //引数なし・戻り値なしの関数を受け取ります(「引数なしで何か処理をする関数」を props で渡す場合はこの書き方)
}
