//ボタンデザインコンポーネント
type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

const PrimaryButton = ({
  children,
  onClick,
  className = '',
  disabled,
}: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-lg bg-[#e9925c] text-white text-sm font-semibold
        shadow-lg transition-all duration-150
        hover:bg-[#d26d36] active:scale-95
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
