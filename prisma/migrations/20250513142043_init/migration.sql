/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Phrase" (
    "id" SERIAL NOT NULL,
    "japanese" TEXT NOT NULL,
    "romaji" TEXT NOT NULL,
    "pronunciation" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "writer" TEXT NOT NULL DEFAULT 'test',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Phrase_pkey" PRIMARY KEY ("id")
);
