//エラー発生用

type Props = {
  text?: string;
};

export const ErrorMessage = ({ text = 'エラーが発生しました' }: Props) => {
  return (
    <div className="flex justify-center py-10">
      <p>{text}</p>
    </div>
  );
};
