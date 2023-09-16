/*
  Warnings:

  - You are about to drop the column `content_length` on the `Embeddings` table. All the data in the column will be lost.
  - You are about to drop the column `content_tokens` on the `Embeddings` table. All the data in the column will be lost.
  - You are about to drop the column `text_date` on the `Text` table. All the data in the column will be lost.
  - You are about to drop the column `text_title` on the `Text` table. All the data in the column will be lost.
  - You are about to drop the column `text_url` on the `Text` table. All the data in the column will be lost.
  - Added the required column `contentLength` to the `Embeddings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentTokens` to the `Embeddings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Embeddings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `textDate` to the `Text` table without a default value. This is not possible if the table is not empty.
  - Added the required column `textTitle` to the `Text` table without a default value. This is not possible if the table is not empty.
  - Added the required column `textUrl` to the `Text` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Text` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Embeddings" DROP COLUMN "content_length",
DROP COLUMN "content_tokens",
ADD COLUMN     "contentLength" INTEGER NOT NULL,
ADD COLUMN     "contentTokens" INTEGER NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Text" DROP COLUMN "text_date",
DROP COLUMN "text_title",
DROP COLUMN "text_url",
ADD COLUMN     "textDate" TEXT NOT NULL,
ADD COLUMN     "textTitle" TEXT NOT NULL,
ADD COLUMN     "textUrl" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;

-- CreateTable
CREATE TABLE "RolesAndPaymentInfo" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "premiumUser" BOOLEAN NOT NULL,
    "paymentDetails" JSONB NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "RolesAndPaymentInfo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Text" ADD CONSTRAINT "Text_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Embeddings" ADD CONSTRAINT "Embeddings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolesAndPaymentInfo" ADD CONSTRAINT "RolesAndPaymentInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
