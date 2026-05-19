// 説明テキスト用UI

type Props = {
  children: React.ReactNode;
};

const ModalDescriptionText = ({ children }: Props) => {
  return (
    <p className="whitespace-pre-line text-center text-sm leading-6 w-full max-w-[320px] mx-auto my-6 px-4">
      {children}
    </p>
  );
};

export default ModalDescriptionText;
