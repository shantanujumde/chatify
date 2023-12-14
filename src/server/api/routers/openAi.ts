import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { encode } from "gpt-3-encoder";
import { z } from "zod";
import {
  chunkText,
  getHash,
  openAi,
  supabaseClient,
} from "../helpers/openAi.helpers";
import type { Embeddings } from "../types/openAi.types";

export const openAiRouter = createTRPCRouter({
  createEmbeddings: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        extension: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const chunkArray = chunkText({
        name: input.name,
        extension: input.extension,
        date: new Date().toISOString(),
        content: input.content,
        length: input.content.length,
        tokens: encode(input.content).length,
        chunks: [],
      });

      const uniqueIdForText = getHash(
        input.content + ctx.session.user.organizationId
      );

      const { error: insertTextError } = await supabaseClient
        .from("File")
        .insert({
          id: uniqueIdForText,
          content: input.content,
          extension: input.extension,
          name: input.name,
          organizationId: ctx.session.user.organizationId,
        })
        .select()
        .limit(1)
        .single();

      if (insertTextError)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Text already exists",
          cause: insertTextError,
        });

      const embeddingArray: Embeddings[] = [];
      for (const chunk of chunkArray.chunks) {
        const embeddingResponse = await openAi.embeddings.create({
          model: "text-embedding-ada-002",
          input: chunk.content,
        });

        // const embedding = embeddingResponse.data.data[0]?.embedding;

        console.log("openAi=>embeddingResponse", embeddingResponse);

        const embedding = embeddingResponse.data[0]?.embedding;

        const embeddingObject: Embeddings = {
          content: chunk.content,
          contentLength: chunk.contentLength,
          contentTokens: chunk.contentTokens,
          embedding: embedding as unknown as string,
          openAiResponce: JSON.stringify(embeddingResponse),
          fileId: uniqueIdForText,
          organizationId: ctx.session.user.organizationId,
        };

        embeddingArray.push(embeddingObject);
      }

      if (!embeddingArray.length)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Embedding array is empty",
        });

      const { error: insertEmbeddingError } = await supabaseClient
        .from("Embeddings")
        .insert(embeddingArray);

      if (insertEmbeddingError)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Embeddings already exists",
          cause: insertEmbeddingError,
        });
      else
        return {
          code: 200,
          message: "Embeddings created successfully",
        };
    }),

  getClosestEmbeddings: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      const embeddingResponse = await openAi.embeddings.create({
        model: "text-embedding-ada-002",
        input: input.text.replaceAll("\n", " "),
      });

      if (!embeddingResponse)
        throw new Error("Failed to create embedding for question");

      const embedding = embeddingResponse.data[0]?.embedding;

      if (!embedding)
        throw new Error("Failed to create embedding for question");

      const { error: matchError, data: pageSections } =
        await supabaseClient.rpc("match_documents", {
          query_embedding: embedding as unknown as string,
          match_threshold: 0.5,
          match_count: 10,
        });

      if (matchError)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Similar text not found!",
          cause: matchError,
        });

      return {
        status: 200,
        error: null,
        data: pageSections,
      };
    }),
});
