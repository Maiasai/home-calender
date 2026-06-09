-- AlterTable
ALTER TABLE "recipes" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "servings" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "nickname" DROP NOT NULL;
