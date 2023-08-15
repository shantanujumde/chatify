/*
  Warnings:

  - Added the required column `openAiResponce` to the `Embeddings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Embeddings" ADD COLUMN     "openAiResponce" JSONB NOT NULL;
