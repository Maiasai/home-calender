//Fetchした時にきた材料データの型

import { Prisma } from "generated/prisma"//schema.prismaでoutputしているパスを指定


//Prismaクエリ（= APIレスポンスの型）の型を作っており、全部の型が自動生成されている
export type RecipeDetail = Prisma.RecipeGetPayload<{
  include: {
    recipeIngredients: {
      include: {
        ingredient: true
        unit: true
      }
    }
      recipeSteps: true
  }
}>