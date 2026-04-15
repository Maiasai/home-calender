//人数・材料　UI周り

'use client';

import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import { RecipeFormValues } from '../_types/RecipeFormValues';
import { parseFraction } from './parseFraction';
import { Unit } from '../_types/unit/Unit';
import ErrorMessage from './ErrorMessage';
import Image from 'next/image';
import DeleteIcon from '@/app/components/image/deleteicon';

type Props = {
  //このコンポーネントが親から受け取る「データと関数の一覧」
  registerServings: UseFormRegister<RecipeFormValues>;
  errors: FieldErrors<RecipeFormValues>; //RHFのエラーの型
  control: Control<RecipeFormValues>;
  register: UseFormRegister<RecipeFormValues>;
  setValue: UseFormSetValue<RecipeFormValues>;
  units: Unit[];
};

const IngredientList = ({
  registerServings,
  errors,
  control,
  register,
  setValue,
  units,
}: Props) => {
  const MAX_INGREDIENTS = 20; //最大追加可能数

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  return (
    <div className="flex flex-col gap-1 w-full">
      <label>材料</label>

      <div className="flex flex-col">
        <div>
          <input
            type="number"
            className="w-20 px-2  py-1 border-b"
            //数字に変換してから、ここで親のRHFのservingsを更新している
            {...registerServings('servings', {
              required: '人数は必須です',
              min: { value: 1, message: '1人以上で入力してください' },
              max: { value: 10, message: '10人以下で入力してください' },
              valueAsNumber: true, //ユーザーの入力した数字は文字列になってしまうため、"3"ここで数字に変換
            })}
          ></input>

          <label>人分</label>
        </div>
      </div>
      <ErrorMessage error={errors.servings} />

      {fields.map((field, index) => (
        <div key={field.id}>
          <div className="flex items-start gap-4">
            {index >= 1 && (
              <button
                type="button"
                className="self-start pt-1"
                onClick={() => remove(index)}
                aria-label="材料と量を削除"
              >
                <DeleteIcon />
              </button>
            )}

            {/* 材料名 */}
            <div className="flex items-center gap-4">
              <div>
                <input
                  className="w-[180px] px-2 py-1 border-b"
                  {...register(`ingredients.${index}.name`, {
                    required: '材料名は必須です',
                    maxLength: {
                      value: 20,
                      message: ' 材料名は20文字以内で入力してください ',
                    },
                  })}
                  placeholder="材料名"
                />
                <div className="pl-2">
                  <ErrorMessage error={errors.ingredients?.[index]?.name} />
                </div>
              </div>

              {/* 量 */}
              <div>
                <input
                  type="text" // 1/2 入力できるようにするため
                  className="w-[150px] px-2 py-1 border-b"
                  {...register(`ingredients.${index}.amount`, {
                    required: '量は必須です',
                    min: { value: 1, message: '1以上で入力してください' },
                    max: { value: 500, message: '500以下で入力してください' },
                    pattern: /^(\d+(\.\d+)?|\d+\/\d+)$/,

                    //入力欄からフォーカスが外れたとき に発火するイベント
                    onBlur: (e) => {
                      //onBlurは用意している標準イベント.(register内では自動推論の為、型指定不要)
                      const value = e.currentTarget.value; //この onBlur が登録されている input 要素,value→ユーザーが入力した文字列を取得
                      const parsed = parseFraction(value); //数値に変換する関数を通す。
                      //ingredients配列のindex番目のamountのみをsetValueで更新
                      setValue(`ingredients.${index}.amount`, parsed, {
                        shouldValidate: true,
                      }); //shouldValidate→指定したフォームフィールドの値を更新→更新後バリデーション実行
                    },
                  })}
                  placeholder="例: 0.5 または 1/2"
                />
                <div className="pl-2">
                  <ErrorMessage error={errors.ingredients?.[index]?.amount} />
                </div>
              </div>

              {/* 単位 */}
              <div className="flex flex-col w-[120px]">
                <select
                  className="px-2 py-1 border-b"
                  {...register(`ingredients.${index}.unitId`, {
                    //unitIdはカラム名
                    required: '単位は必須です',
                  })}
                >
                  <option value="" disabled>
                    {/* defaultValue="" で初期値を空に見せる　&　disabledで選べないようにする */}
                    単位を選択
                  </option>

                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
                <div className="pl-2">
                  <ErrorMessage error={errors.ingredients?.[index]?.unitId} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {fields.length < 20 && ( //最大数超えたら追加ボタンを非表示
        <div className="flex justify-center">
          <button
            type="button"
            disabled={fields.length >= MAX_INGREDIENTS}
            onClick={() => append({ name: '', unitId: '' })} //amountの型定義を?にすることでonClickに記載をしない（項目自体は必須だが、初期値を""で書けないため）
            className="cursor-pointer"
          >
            <Image
              src="/images/buttoningredientadd.png"
              alt="材料を追加"
              width={100}
              height={40}
            />
          </button>
        </div>
      )}

      <p className="text-sm text-gray-500">
        ※分数で入力すると自動で小数に変換されます
      </p>
    </div>
  );
};

export default IngredientList;
