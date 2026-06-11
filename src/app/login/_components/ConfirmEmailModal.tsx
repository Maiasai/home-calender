type Props = {
  onBack: () => void;
};

const ConfirmEmailModal = ({ onBack }: Props) => {
  return (
    <div className="w-full text-center mt-8 space-y-4">
      <p className="font-semibold">確認メールを送信しました</p>

      <p className="text-sm text-gray-600 leading-relaxed">
        メール内の「メールアドレスを確認する」を押して、
        メールアドレスの確認を完了してください。
      </p>

      <p className="text-sm text-gray-600 leading-relaxed">
        確認が完了したら、もう一度ログインしてください。
      </p>

      <button
        type="button"
        onClick={onBack}
        className="mt-4 bg-orange-400 text-white px-4 py-2 rounded"
      >
        ログイン画面へ戻る
      </button>
    </div>
  );
};

export default ConfirmEmailModal;
