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
        確認後、続けて届いている認証コードを入力してください。
      </p>

      <PrimaryButton
        type="button"
        onClick={onNext}
        className="w-60 h-11"
        variant="primary"
      >
        認証コードを入力する
      </PrimaryButton>
    </div>
  );
};

export default ConfirmEmailModal;
