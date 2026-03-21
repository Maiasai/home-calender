//レシピ材料型（サーバーから返ってくる構造）

'use client'

export interface RecipeIngredient {
  id: string
  ingredient: {
    id:string
    name: string
    normalizedName:string
  }
  quantityText?: number | string | null

  unit: {
    id: string
    name: string
  }
}

//例）
//recipe.recipeIngredients = ({ingredient: { name: "レタス" },quantityText: 1,unit: { id: "9", name: "枚" }})