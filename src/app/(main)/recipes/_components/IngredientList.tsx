//人数・材料　UI周り

'use client';

import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form';
import { RecipeFormValues } from '../_types/RecipeFormValues';
import { parseFraction } from './parseFraction';
import ErrorMessage from './ErrorMessage';
import DeleteIcon from '@/app/components/image/deleteicon';
import { UnitData } from '@/app/api/units/route';
import PrimaryButton from '@/components/button/PrimaryButton';

type Props = {
  //このコンポーネントが親から受け取る「データと関数の一覧」
  registerServings: UseFormRegister<RecipeFormValues>;
  errors: FieldErrors<RecipeFormValues>; //RHFのエラーの型
  control: Control<RecipeFormValues>;
  register: UseFormRegister<RecipeFormValues>;
  setValue: UseFormSetValue<RecipeFormValues>;
  units: UnitData[];
  getValues: UseFormGetValues<RecipeFormValues>;
  trigger: UseFormTrigger<RecipeFormValues>;
};

const IngredientList = ({
  registerServings,
  errors,
  control,
  register,
  setValue,
  units,
  getValues,
  trigger,
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
              min: { value: 0, message: '0人以上で入力してください' },
              max: { value: 10, message: '10人以下で入力してください' },
              valueAsNumber: true, //ユーザーの入力した数字は文字列になってしまうため、"3"ここで数字に変換
            })}
          ></input>

          <label className="ml-2">人分</label>
        </div>
      </div>
      <ErrorMessage error={errors.servings} />

      {fields.map((field, index) => (
        <div key={field.id}>
          {/* 材料名 */}
          <div className="flex flex-col md:flex-row gap-x-3 py-2">
            <div className="flex">
              {index >= 1 && (
                <button
                  type="button"
                  className="self-start pt-1 shrink-0 mr-2"
                  onClick={() => remove(index)}
                  aria-label="材料と量を削除"
                >
                  <DeleteIcon />
                </button>
              )}

              <div className="flec flex-col">
                <input
                  className="w-[280px] px-2 py-1 border-b mb-1"
                  {...register(`ingredients.${index}.name`, {
                    maxLength: {
                      value: 15,
                      message: '材料名は15文字以内で入力してください',
                    },
                    validate: (value) => {
                      const row = getValues(`ingredients.${index}`);
                      const hasAnyValue =
                        row.name?.trim() || row.amount || row.unitId;

                      // 量と単位に入力されてるなら材料名は必須
                      if (hasAnyValue) {
                        return value?.trim()
                          ? true
                          : '材料名を入力してください';
                      }

                      return true; // 空行はOK
                    },
                  })}
                  placeholder="材料名"
                />
                <div className="pl-2">
                  <ErrorMessage error={errors.ingredients?.[index]?.name} />
                </div>
              </div>
            </div>

            {/* 量 */}
            <div className="flex flex-col items-center ml-6 mb-4">
              <div className="flex">
                <input
                  type="text" // 1/2 入力できるようにするため
                  className="w-[150px] px-2 py-1 border-b"
                  {...register(`ingredients.${index}.amount`, {
                    validate: (value) => {
                      const row = getValues(`ingredients.${index}`);

                      if (!value && row.unitId) {
                        return '単位がある場合、量を入力してください';
                      }

                      const parsed = parseFraction(String(value));

                      if (Number.isNaN(parsed)) {
                        return '数字または分数で入力してください';
                      }

                      if (parsed < 0) return '0以上で入力してください';

                      if (parsed > 500) return '500以下で入力してください';

                      return true;
                    },
                    onChange: () => {
                      trigger(`ingredients.${index}.amount`);
                    },

                    //入力欄からフォーカスが外れたとき に発火するイベント
                    onBlur: (e) => {
                      //onBlurは用意している標準イベント.(register内では自動推論の為、型指定不要)
                      const value = e.currentTarget.value; //この onBlur が登録されている input 要素,value→ユーザーが入力した文字列を取得

                      if (!value) {
                        setValue(`ingredients.${index}.amount`, undefined);

                        return;
                      }

                      const parsed = parseFraction(value); //数値に変換する関数を通す。

                      if (Number.isNaN(parsed)) {
                        setValue(`ingredients.${index}.amount`, undefined);

                        return;
                      }
                      //ingredients配列のindex番目のamountのみをsetValueで更新
                      setValue(`ingredients.${index}.amount`, parsed, {
                        shouldValidate: true,
                      }); //shouldValidate→指定したフォームフィールドの値を更新→更新後バリデーション実行
                    },
                  })}
                  placeholder="例: 0.5 または 1/2"
                />

                {/* 単位 */}
                <select
                  className="w-[90px] px-2 py-1 border-b ml-1"
                  {...register(`ingredients.${index}.unitId`)}
                >
                  <option value="">未選択</option>

                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pl-1">
                <ErrorMessage error={errors.ingredients?.[index]?.amount} />
              </div>
            </div>
          </div>
        </div>
      ))}

      {fields.length < 20 && ( //最大数超えたら追加ボタンを非表示
        <div className="flex justify-center">
          <PrimaryButton
            type="button"
            disabled={fields.length >= MAX_INGREDIENTS}
            onClick={() => append({ name: '', unitId: '' })} //amountの型定義を?にすることでonClickに記載をしない（項目自体は必須だが、初期値を""で書けないため）
            className="w-[148px] h-[30px] mb-2"
            variant="primary"
          >
            ＋材料を追加
          </PrimaryButton>
        </div>
      )}

      <p className="text-sm text-gray-500">
        ※分数で入力すると自動で小数に変換されます
      </p>
    </div>
  );
};

export default IngredientList;
