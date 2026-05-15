import { DayData } from '../_typs/Menu';

type Props = {
  selectedDayData: DayData;
  selectedKey: string;
};

export const buildMead = ({ selectedDayData, selectedKey }: Props) => {
  if (!selectedDayData) return null;

  return {
    id: selectedDayData.id,
    date: selectedKey,
    recipes: [
      //配列の中に配列で展開されてしまうため、スプレッド構文を使用。[{...},{...},{...}]
      ...selectedDayData.breakfast.map((r) => ({
        recipe: {
          id: r.id,
          title: r.title,
          thumbnailUrl: r.thumbnailUrl ?? '/images/noImage.jpg',
          ingredients: r.ingredients ?? [],
        },
        mealType: 'BREAKFAST' as const,
      })),
      ...selectedDayData.lunch.map((r) => ({
        recipe: {
          id: r.id,
          title: r.title,
          thumbnailUrl: r.thumbnailUrl ?? '/images/noImage.jpg',
          ingredients: r.ingredients ?? [],
        },
        mealType: 'LUNCH' as const,
      })),
      ...selectedDayData.dinner.map((r) => ({
        recipe: {
          id: r.id,
          title: r.title,
          thumbnailUrl: r.thumbnailUrl ?? '/images/noImage.jpg',
          ingredients: r.ingredients ?? [],
        },
        mealType: 'DINNER' as const,
      })),
    ],
  };
};
