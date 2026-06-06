//処理中（callbackなど）用

type Props = {
  text?: string;
};

const LoadingOverlay = ({ text = '処理中…' }: Props) => {
  return (
    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
      <span className="text-gray-700 font-medium text-lg">{text}</span>
    </div>
  );
};

export default LoadingOverlay;
