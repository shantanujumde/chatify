import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { encode } from "gpt-3-encoder";
import { z } from "zod";
import {
  chunkText,
  getHash,
  openai,
  supabaseClient,
} from "../helpers/openAi.helpers";
import type { Embeddings } from "../types/openAi.types";

export const openAiRouter = createTRPCRouter({
  createEmbeddings: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        text_date: z.string(),
        text_url: z.string(),
        text_title: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const chunkArray = chunkText({
        title: input.text_title,
        url: input.text_date,
        date: input.text_date,
        content: input.text,
        length: input.text.length,
        tokens: encode(input.text).length,
        chunks: [],
      });

      const uniqueIdForText = getHash(input.text);

      const { error: insertTextError } = await supabaseClient
        .from("Text")
        .insert({
          id: uniqueIdForText,
          text: input.text,
          textDate: input.text_date,
          textUrl: input.text_url,
          textTitle: input.text_title,
          userId: ctx.session?.user.id,
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
        const embeddingResponse = await openai.createEmbedding({
          model: "text-embedding-ada-002",
          input: chunk.content,
        });

        const embedding = embeddingResponse.data.data[0]?.embedding;

        const embeddingObject: Embeddings = {
          content: chunk.content,
          contentLength: chunk.content_length,
          contentTokens: chunk.content_tokens,
          embedding: embedding as unknown as string,
          openAiResponce: JSON.stringify(embeddingResponse.data.data),
          textId: uniqueIdForText,
          userId: ctx.session?.user.id,
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
      const embeddingResponse = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: input.text.replaceAll("\n", " "),
      });

      if (embeddingResponse.status !== 200) {
        throw new Error("Failed to create embedding for question");
      }

      const embedding = embeddingResponse.data.data[0]?.embedding;

      if (!embedding) {
        throw new Error("Failed to create embedding for question");
      }

      const { error: matchError, data: pageSections } =
        await supabaseClient.rpc("match_page_sections", {
          embedding: embedding as unknown as string,
          match_threshold: 0.5,
          match_count: 10,
          min_content_length: 50,
        });

      if (matchError)
        return {
          status: 404,
          error: matchError,
          data: null,
        };
      return {
        status: 200,
        error: null,
        data: pageSections,
      };
    }),
});
