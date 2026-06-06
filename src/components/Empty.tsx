//データがない時用

type Props = {
  text?: string;
};
export const Empty = ({ text = 'データがありません' }: Props) => {
  return (
    <div className="flex justify-center py-10">
      <p>{text}</p>
    </div>
  );
};
