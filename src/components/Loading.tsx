//Loadingコンポーネント
// SWRの初回取得中・認証確認中・callback中など

type Props = {
  text?: string;
  fullScreen?: boolean; //これはただの変数名
};

export const Loading = ({
  text = '読み込み中…',
  fullScreen = false,
}: Props) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? 'min-h-screen' : 'py-10'
      }`}
    >
      <p>{text}</p>
    </div>
  );
};
