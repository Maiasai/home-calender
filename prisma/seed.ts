import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma"
import pg from "pg"

const connectionString = process.env.DATABASE_URL!

const pool = new pg.Pool({
  connectionString,
})

const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
  adapter
})

async function main() {

  const units = [
    "個",
    "枚",
    "本",
    "尾",
    "切れ",
    "g",
    "kg",
    "ml",
    "l",
    "小さじ",
    "大さじ",
    "カップ",
    "パック",
    "袋",
    "缶",
    "片"
  ]

  await prisma.unit.createMany({
    data: units.map((name) => ({ name })),
    skipDuplicates: true
  })

}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())