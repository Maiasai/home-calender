//献立作成モーダル　分類の型(型を拡張)

'use client'

import { MealType } from "generated/prisma"

export type MealTypeExtended = 
MealType | 'UNASSIGNED'