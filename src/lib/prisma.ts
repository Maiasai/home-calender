//このファイルはNext.jsの中で PrismaClientを1つだけ使い回すための仕組み
//（ファイル保存やAPIを叩くことでサーバー側のコードが再読み込みされるたびに新しいPrismaClientが作られてしまうらしい）

// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";

const { Pool } = pkg;

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // まずはこれでOK（poolerでも動く）
});

export const prisma =
  global.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(pool),
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;