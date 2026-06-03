//利用規約のページ
const Terms = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-center mb-10">利用規約</h1>

      <div className="space-y-8 text-sm leading-7">
        <p>
          この利用規約（以下「本規約」といいます。）は、本サービスの利用条件を定めるものです。
          ユーザーは、本規約に同意した上で、本サービスを利用するものとします。
        </p>

        <section>
          <h2 className="font-semibold text-base mb-2">第1条（適用）</h2>
          <p>
            本規約は、ユーザーと本サービス運営者との間の、本サービスの利用に関する一切の関係に適用されます。
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">第2条（利用登録）</h2>
          <p>
            本サービスの利用を希望する方は、本規約に同意の上、所定の方法により利用登録を行うものとします。
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">第3条（禁止事項）</h2>
          <p className="mb-2">ユーザーは、以下の行為を行ってはなりません。</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>法令または公序良俗に違反する行為</li>
            <li>本サービスの運営を妨害する行為</li>
            <li>不正アクセス、またはこれを試みる行為</li>
            <li>他のユーザーに迷惑をかける行為</li>
            <li>その他、運営者が不適切と判断する行為</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">
            第4条（サービスの提供の停止等）
          </h2>
          <p className="mb-2">
            運営者は、以下の場合には、ユーザーに事前に通知することなく、本サービスの全部または一部の提供を停止または中断することができるものとします。
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>システムの保守または点検を行う場合</li>
            <li>天災等の不可抗力によりサービス提供が困難な場合</li>
            <li>その他、運営者が必要と判断した場合</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">第5条（免責事項）</h2>
          <p>
            運営者は、本サービスの内容および提供について、正確性・完全性・有用性を保証するものではありません。
            また、本サービスの利用によって生じた損害について、運営者は一切の責任を負わないものとします。
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">第6条（規約の変更）</h2>
          <p>
            運営者は、必要に応じて本規約を変更することができます。
            変更後の規約は、本サービス上に掲載した時点で効力を生じるものとします。
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">第7条（準拠法）</h2>
          <p>本規約の解釈にあたっては、日本法を準拠法とします。</p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
