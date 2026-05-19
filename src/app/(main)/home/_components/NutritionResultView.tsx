//栄養分析UI

import CloseButton from '@/app/components/image/CloseButton';
import { NutritionMessages } from '@/lib/nutrition/nutritionMessages';
import { NutritionResult } from '@/lib/nutrition/typs';
import { NutritionResultUi } from './NutritionResultUi';

type Props = {
  result: NutritionResult;
  onClose: () => void;
  displayDate: string;
};

const NutritionResultView = ({ result, onClose, displayDate }: Props) => {
  const overallMessage = NutritionMessages.overall[result.overall];
  const overallProtein = NutritionMessages.protein[result.protein];
  const overallVegetable = NutritionMessages.vegetable[result.vegetable];

  const levelColorMap = {
    good: 'text-green-400 font-bold text-sm',
    warning: 'text-yellow-400 font-bold text-sm',
    bad: 'text-red-400 font-bold text-sm',
  };

  const overallColor = levelColorMap[result.overall];
  const proteinColor = levelColorMap[result.protein];
  const vegetableColor = levelColorMap[result.vegetable];

  return (
    <div className="absolute bg-gray-100 w-[600px] max-h-[80vh] overflow-y-auto rounded-xl">
      <div className="flex flex-col m-2">
        <div className="relative">
          <CloseButton onClose={onClose} />
        </div>
        <div className="flex flex-col items-center bg-white  mx-4 mt-2 mb-2 p-2 rounded-lg">
          <h1>栄養バランス</h1>
          <div className="flex justify-end w-full mr-10">
            <p>{displayDate}</p>
          </div>
        </div>

        <NutritionResultUi
          title="全体バランス"
          cname={overallColor}
          message={overallMessage.title}
          comment={overallMessage.comment}
        />

        <NutritionResultUi
          title="タンパク質"
          cname={proteinColor}
          message={overallProtein.title}
          comment={overallProtein.comment}
        />

        <NutritionResultUi
          title="野菜"
          cname={vegetableColor}
          message={overallVegetable.title}
          comment={overallVegetable.comment}
        />

        <div className="flex flex-col bg-white  mx-4 mt-2 mb-2 p-2 rounded-lg">
          <h2 className="text-xs text-gray-500">
            ※ 内容は食材データに基づいた推定です。医療行為ではありません。
          </h2>
          <p className="text-xs text-gray-500 mt-2">
            ※
            本データは「日本食品標準成分表（八訂）増補2023年」を参考にしています。
            出典：文部科学省 食品成分データベース
          </p>
          <p className="text-xs text-gray-500 mt-2">
            ※ 一部の食材は表記ゆれのため、正確に判定できない場合があります。
          </p>
        </div>
      </div>
    </div>
  );
};

export default NutritionResultView;
