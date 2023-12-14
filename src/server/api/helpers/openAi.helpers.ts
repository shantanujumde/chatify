import type { Prisma, PrismaClient } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import { createClient, type Session } from "@supabase/supabase-js";
import { encode } from "gpt-3-encoder";
import { OpenAI } from "openai";
import type { File, FileChunks } from "../types/openAi.types";
import type { Database } from "../types/supabase.types";

export const supabaseClient = createClient<Database>(
  String(process.env.SUPABASE_URL),
  String(process.env.SUPABASE_SERVICE_ROLE_KEY),
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export const openAi = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

export function getHash(text: string) {
  let hash = 0,
    chr;
  if (text.length === 0) return hash;
  for (let i = 0; i < text.length; i++) {
    chr = text.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

export const rawQueryEmbeddings = async ({
  ctx,
  chunk,
  embedding,
  embeddingResponse,
}: {
  ctx: {
    session: Session | null;
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  };
  chunk: FileChunks;
  embedding: Array<number>;
  embeddingResponse: string;
}) => {
  await ctx.prisma.$executeRaw`
    insert into "Embeddings" ( 
        id,
        name         , 
        extension      , 
        content       , 
        content_length ,
        content_tokens ,
        embedding      ,
        "openAiResponce" 
        )
         values 
        (
          ${Math.random()},
          ${chunk.name},
          ${chunk.extension},
          ${chunk.content},
          ${chunk.contentLength},
          ${chunk.contentTokens},
          ${embedding}::vector,
          ${embeddingResponse}::JSONB
        )
  `;
};

const CHUNK_SIZE = 200;

export const chunkText = (text: File) => {
  const { name: title, extension: url, date, content } = text;

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

    const chunk: FileChunks = {
      name: title,
      extension: url,
      textDate: date,
      content: trimmedText,
      contentLength: trimmedText.length,
      contentTokens: encode(trimmedText).length,
      embedding: [],
    };

    return chunk;
  });

  if (textChunks.length > 1) {
    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i];
      const prevChunk = textChunks[i - 1];

      if (chunk && chunk.contentTokens < 100 && prevChunk) {
        prevChunk.content += " " + chunk.content;
        prevChunk.contentLength += chunk.contentLength;
        prevChunk.contentTokens += chunk.contentTokens;
        textChunks.splice(i, 1);
        i--;
      }
    }
  }

  const chunkedSection: File = {
    ...text,
    chunks: textChunks,
  };

  return chunkedSection;
};
