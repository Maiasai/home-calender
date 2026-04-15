//材料の単位を引っ張ってくるAPI

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { GetUnitsResponse } from '../_types/GetUnitsResponse';

export const GET = async () => {
  try {
    const units = await prisma.unit.findMany({
      orderBy: { id: 'asc' }, //idの小さい順で並べる
    });
    return NextResponse.json<GetUnitsResponse>({ units }); //<>はレスポンスの型
  } catch {
    return NextResponse.json({ message: '取得失敗' }, { status: 500 });
  }
};
