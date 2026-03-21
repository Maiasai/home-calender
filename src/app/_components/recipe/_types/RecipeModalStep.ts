'use client'

import type { RecipeSourceType } from "generated/prisma"//

export type  RecipeModalStep = 
  | 'select' //初期表示
  | RecipeSourceType;
