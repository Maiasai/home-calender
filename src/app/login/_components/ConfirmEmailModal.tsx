import PrimaryButton from '@/components/button/PrimaryButton';

type Props = {
  onClose: () => void;
};

const ConfirmEmailModal = ({ onClose }: Props) => {
  return (
    <div className="w-full text-center mt-8 space-y-4">
      <p className="font-semibold">確認メールを送信しました</p>

      <p className="text-sm text-gray-600 leading-relaxed">
        メール内の「メールアドレスを確認する」を押して、
        メールアドレスの確認を完了してください。
      </p>

      <p className="text-sm text-gray-600 leading-relaxed">
        確認完了後は、再度ログイン画面から同じメールアドレスを入力してください。
        認証コードが送信されます。
      </p>

      <PrimaryButton
        type="button"
        onClick={onClose}
        className="w-60 h-11"
        variant="primary"
      >
        閉じる
      </PrimaryButton>
    </div>
  );
};

export default ConfirmEmailModal;
