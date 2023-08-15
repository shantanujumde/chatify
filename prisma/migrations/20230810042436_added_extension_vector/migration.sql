/*
  Warnings:

  - You are about to drop the `Example` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- DropTable
DROP TABLE "Example";

-- CreateTable
CREATE TABLE "Embeddings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text_url" TEXT NOT NULL,
    "text_date" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "content_length" INTEGER NOT NULL,
    "content_tokens" INTEGER NOT NULL,
    "embedding" vector(1536),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Embeddings_pkey" PRIMARY KEY ("id")
);
