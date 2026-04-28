//カレンダーの献立の型

export type Meal = {
  id: string;
  date: string;
  recipes: {
    recipe: {
      id: string;
      title: string;
      thumbnailUrl: string;
    };
    mealType: string;
  }[];
};
