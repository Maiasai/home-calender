//単位取得API

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

//単位　型定義
export type UnitData = {
  id: string;
  name: string;
};

//単位　レスポンス型
export type GetUnitsResponse = {
  units: UnitData[];
};

export const GET = async () => {
  try {
    const result = await prisma.unit.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return NextResponse.json<GetUnitsResponse>(
      { units: result },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: 'エラー' }, { status: 500 });
  }
};
