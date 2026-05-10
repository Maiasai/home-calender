//栄養分析UI

import CloseButton from '@/app/components/image/CloseButton';
import { NutritionResult } from '@/lib/nutrition/typs';

type Props = {
  result: NutritionResult;
  onClose: () => void;
};

const NutritionResultView = ({ result, onClose }: Props) => {
  return (
    <div className="bg-gray-100 w-[600px] max-h-[60vh] overflow-y-auto">
      <div className="flex flex-col gap-3 m-3">
        <CloseButton onClose={onClose} />
        <div className="flex flex-col bg-white  mx-4 mt-4 mb-2 p-4 rounded-lg">
          <h1>栄養バランス</h1>
        </div>

        <div className="flex flex-col bg-white  mx-4 mt-4 mb-2 p-4 rounded-lg">
          <h2>全体バランス</h2>
          <p>{result.overall}</p>
        </div>
        <div className="flex flex-col bg-white  mx-4 mt-4 mb-2 p-4 rounded-lg">
          <h2>タンパク質</h2>
          <p>{result.protein}</p>
        </div>
        <div className="flex flex-col bg-white  mx-4 mt-4 mb-2 p-4 rounded-lg">
          <h2>野菜・ビタミン</h2>
          <p>{result.vegetable}</p>
        </div>
      </div>
    </div>
  );
};

export default NutritionResultView;
