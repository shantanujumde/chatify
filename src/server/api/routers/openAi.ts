import {
  Context,
  createTRPCRouter,
  protectedProcedure,
  subscribedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { randomInt } from "crypto";
import { encode } from "gpt-3-encoder";
import { z } from "zod";
import {
  chunkText,
  getClosestEmbeddings,
  openAi,
  supabaseClient,
} from "../helpers/openAi.helpers";
import { getOrganizationId } from "../helpers/profile.helpers";
import type { Embeddings } from "../types/openAi.types";

export const openAiRouter = createTRPCRouter({
  createEmbeddings: subscribedProcedure
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

      const uniqueIdForText = randomInt(5000000);

      const organizationId = await getOrganizationId(ctx as unknown as Context);

      const { error: insertTextError } = await supabaseClient
        .from("File")
        .insert({
          id: uniqueIdForText,
          content: input.content,
          extension: input.extension,
          name: input.name,
          organizationId,
        })
        .select()
        .limit(1)
        .single();

      if (insertTextError)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Indexing Error " + insertTextError.details,
          cause: insertTextError,
        });

      const embeddingArray: Embeddings[] = [];
      for (const chunk of chunkArray.chunks) {
        const embeddingResponse = await openAi.embeddings.create({
          model: "text-embedding-ada-002",
          input: chunk.content,
        });

        const embedding = embeddingResponse.data[0]?.embedding;

        const embeddingObject: Embeddings = {
          content: chunk.content,
          contentLength: chunk.contentLength,
          contentTokens: chunk.contentTokens,
          embedding: embedding as unknown as string,
          openAiResponce: JSON.stringify(embeddingResponse),
          fileId: uniqueIdForText,
          organizationId,
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
          message:
            "Embeddings already exists" + JSON.stringify(insertEmbeddingError),
          cause: insertEmbeddingError,
        });
      else
        return {
          code: 200,
          message: "Embeddings created successfully",
        };
    }),

  chat: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      const closestEmbeddings = await getClosestEmbeddings(input.text);

      if (!(closestEmbeddings.length && closestEmbeddings[0]?.content))
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Embeddings length is 0" + JSON.stringify(closestEmbeddings),
        });

      const stream = await openAi.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `answer this question ${input.text} using ${closestEmbeddings[0]?.content}`,
          },
        ],
        model: "gpt-3.5-turbo",
        stream: true,
      });

      for await (const chunk of stream) {
        console.info(chunk.choices[0]?.delta?.content ?? "");
      }
    }),
});
