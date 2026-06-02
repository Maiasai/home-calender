//ボタンデザインコンポーネント
type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

const PrimaryButton = ({
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}: Props) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-lg bg-[#e9925c] text-white text-sm font-semibold
        shadow-lg transition-all duration-150
        hover:bg-[#d26d36] active:scale-95
        ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-[#d26d36]'}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
