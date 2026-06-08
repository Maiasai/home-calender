//ボタンデザインコンポーネント
type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'danger' | 'secondary' | 'third';
};

const PrimaryButton = ({
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  variant = 'primary',
}: Props) => {
  const base =
    'rounded-lg text-sm font-semibold shadow-md transition-all duration-150 active:scale-95';

  const variants = {
    //オレンジ系ボタン
    primary: `
    rounded-lg
    bg-[#e9925c]
    text-white
    text-sm
    font-semibold
    shadow-lg
    transition-all duration-150
    hover:bg-[#d26d36]
    active:scale-95
  `,
    //赤系ボタン
    danger: `
    rounded-lg
    bg-[#f56666]
    text-white
    text-sm
    font-semibold
    shadow-lg
    transition-all duration-150
    hover:bg-[#ff4b4b]
    active:scale-95
  `,
    //オレンジ枠　白背景ボタン（例）検索ボタンなど
    secondary: `
    rounded-lg
    bg-[#fffefe]
    border border-orange-200
    text-orange-600
    text-sm
    font-semibold
    shadow-lg
    transition-all duration-150
    hover:bg-[#f9e5d9]
    active:scale-95
  `,

    //グレー枠　白背景ボタン
    third: `
    rounded-lg
    bg-[#ffffff]
    border border-gray-200
    text-gray-600
    text-sm
    font-semibold
    shadow-lg
    transition-all duration-150
    hover:bg-gray-200
    active:scale-95
  `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${base}
        ${variants[variant]}
        ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
