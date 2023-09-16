import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { encode } from "gpt-3-encoder";
import { z } from "zod";
import type { Database } from "./database.types";
import { getHash, openai, supabaseClient } from "./helpers";

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

export type Text = {
  title: string;
  url: string;
  date: string;
  content: string;
  length: number;
  tokens: number;
  chunks: TextChunks[];
};

export type TextChunks = {
  title: string;
  text_url: string;
  text_date: string;
  content: string;
  content_length: number;
  content_tokens: number;
  embedding: number[];
};

export type Embeddings = Database["public"]["Tables"]["Embeddings"]["Insert"];

const CHUNK_SIZE = 200;

const chunkText = (text: Text) => {
  const { title, url, date, content } = text;

  const textTextChunks = [];

  if (encode(content).length > CHUNK_SIZE) {
    const split = content.split(". ");
    let chunkText = "";

    for (const sentence of split) {
      if (typeof sentence === "string") {
        const sentenceTokenLength = encode(sentence);
        const chunkTextTokenLength = encode(chunkText).length;

        if (chunkTextTokenLength + sentenceTokenLength.length > CHUNK_SIZE) {
          textTextChunks.push(chunkText);
          chunkText = "";
        }

        if (sentence[sentence.length - 1]!.match(/[a-z0-9]/i)) {
          chunkText += sentence + ". ";
        } else {
          chunkText += sentence + " ";
        }
      }
    }
    textTextChunks.push(chunkText.trim());
  } else {
    textTextChunks.push(content.trim());
  }

  const textChunks = textTextChunks.map((text) => {
    const trimmedText = text.trim();

    const chunk: TextChunks = {
      title: title,
      text_url: url,
      text_date: date,
      content: trimmedText,
      content_length: trimmedText.length,
      content_tokens: encode(trimmedText).length,
      embedding: [],
    };

    return chunk;
  });

  if (textChunks.length > 1) {
    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i];
      const prevChunk = textChunks[i - 1];

      if (chunk && chunk.content_tokens < 100 && prevChunk) {
        prevChunk.content += " " + chunk.content;
        prevChunk.content_length += chunk.content_length;
        prevChunk.content_tokens += chunk.content_tokens;
        textChunks.splice(i, 1);
        i--;
      }
    }
  }

  const chunkedSection: Text = {
    ...text,
    chunks: textChunks,
  };

  return chunkedSection;
};
