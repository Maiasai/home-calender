//このファイルはNext.jsの中で PrismaClientを1つだけ使い回すための仕組み
//（ファイル保存やAPIを叩くことでサーバー側のコードが再読み込みされるたびに新しいPrismaClientが作られてしまうらしい）

// src/lib/prisma.ts
import { PrismaClient } from '../../generated/prisma/client' //ここでgenerateされた成果物を読み込んでる
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
})

export const prisma = new PrismaClient({ adapter })


