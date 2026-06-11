import PrimaryButton from '@/components/button/PrimaryButton';

type Props = {
  onNext: () => void;
};

const ConfirmEmailModal = ({ onNext }: Props) => {
  return (
    <div className="w-full text-center mt-8 space-y-4">
      <p className="font-semibold">確認メールを送信しました</p>

      <p className="text-sm text-gray-600 leading-relaxed">
        メール内の「メールアドレスを確認する」を押して、
        メールアドレスの確認を完了してください。
      </p>

      <p className="text-sm text-gray-600 leading-relaxed">
        確認後、もう一度メールアドレスを入力して「次へ」を押すと、
        認証コードを受け取れます。
      </p>

      <PrimaryButton
        type="button"
        onClick={onNext}
        className="w-60 h-11"
        variant="primary"
      >
        メール入力に戻る
      </PrimaryButton>
    </div>
  );
};

export default ConfirmEmailModal;
