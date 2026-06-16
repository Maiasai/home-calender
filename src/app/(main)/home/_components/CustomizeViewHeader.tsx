//献立作成モーダルにてカスタマイズ押下後の画面
'use client';

import PrimaryButton from '@/components/button/PrimaryButton';

type Props = {
  onBack: () => void;
  isDisabled: boolean;
  hasUnselected: boolean;
  isEmpty: boolean;
};

const CustomizeViewHeader = ({
  onBack,
  isDisabled,
  hasUnselected,
  isEmpty,
}: Props) => {
  const handleSave = () => {
    if (hasUnselected) {
      alert('未分類のレシピがあります');
      return;
    }
    try {
      onBack();
    } catch {
      alert('保存に失敗しました');
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4  px-2">
        <div className="flex flex-row w-full justify-end">
          <PrimaryButton
            type="button"
            onClick={handleSave}
            disabled={isDisabled}
            className="w-[80px] h-[30px]"
            variant="primary"
          >
            保存
          </PrimaryButton>
        </div>

        <div className="flex items-center justify-center w-full mt-10">
          {/* 献立がない場合の表示 */}
          {isEmpty && <p>まだ献立がありません</p>}

          {!isEmpty && (
            <p className="text-xs text-red-500 mb-2">
              ※朝・昼・夜それぞれ最大3品まで選択できます
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomizeViewHeader;
