/*
  Warnings:

  - You are about to drop the column `text_date` on the `Embeddings` table. All the data in the column will be lost.
  - You are about to drop the column `text_url` on the `Embeddings` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Embeddings` table. All the data in the column will be lost.
  - Added the required column `textId` to the `Embeddings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Embeddings" DROP COLUMN "text_date",
DROP COLUMN "text_url",
DROP COLUMN "title",
ADD COLUMN     "textId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Text" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "text_title" TEXT NOT NULL,
    "text_url" TEXT NOT NULL,
    "text_date" TEXT NOT NULL,

    CONSTRAINT "Text_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Embeddings" ADD CONSTRAINT "Embeddings_textId_fkey" FOREIGN KEY ("textId") REFERENCES "Text"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
