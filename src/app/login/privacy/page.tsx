//プライバシーポリシーのページ

const Privacy = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-center mb-10">
        プライバシーポリシー
      </h1>

      <div className="space-y-8 leading-8 text-sm md:text-base">
        <p>
          当アプリ（以下「本サービス」といいます。）は、ユーザーの個人情報の保護を重要な責務と考え、以下のとおりプライバシーポリシーを定めます。
        </p>

        <section>
          <h2 className="font-bold text-lg mb-2">1. 取得する個人情報</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>メールアドレス</li>
            <li>その他、サービス提供に必要な情報</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-lg mb-2">2. 個人情報の利用目的</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>本サービスの提供、運営および維持</li>
            <li>機能改善および品質向上</li>
            <li>不正利用の防止および対応</li>
            <li>重要なお知らせの通知</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-lg mb-2">3. 個人情報の第三者提供</h2>
          <p>
            本サービスは、次の場合を除き、ユーザーの個人情報を第三者へ提供しません。
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>本人の同意がある場合</li>
            <li>法令に基づき開示が求められた場合</li>
            <li>
              人の生命、身体または財産の保護のために必要があり、本人の同意を得ることが困難な場合
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-lg mb-2">4. 個人情報の管理</h2>
          <p>
            本サービスは、個人情報への不正アクセス、紛失、漏えい等を防止するため、適切な安全管理措置を講じます。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-lg mb-2">
            5. 個人情報の開示・訂正・削除
          </h2>
          <p>
            ユーザーは自己の個人情報について、開示、訂正、追加、削除、利用停止を求めることができます。合理的な範囲で対応いたします。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-lg mb-2">
            6. Cookieおよびアクセス解析について
          </h2>
          <p>
            本サービスでは利便性向上や利用状況の把握のため、Cookieを利用する場合があります。Cookieによって個人を特定する情報は取得しません。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-lg mb-2">7. 外部サービスの利用</h2>
          <p>
            本サービスでは機能提供のため、外部サービスを利用しています。各サービスにおける個人情報の取扱いについては、それぞれのプライバシーポリシーをご確認ください。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-lg mb-2">
            8. プライバシーポリシーの変更
          </h2>
          <p>
            本ポリシーは必要に応じて変更することがあります。変更後の内容は本サービス上に掲載した時点で効力を生じるものとします。
          </p>
        </section>

        <p className="text-right text-gray-500 pt-6">制定日：2026年6月</p>
      </div>
    </div>
  );
};

export default Privacy;
