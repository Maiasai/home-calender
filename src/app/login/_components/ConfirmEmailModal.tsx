const ConfirmEmailModal = () => {
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
    </div>
  );
};

export default ConfirmEmailModal;
