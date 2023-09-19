import type { Prisma, PrismaClient } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import { createClient, type Session } from "@supabase/supabase-js";
import { encode } from "gpt-3-encoder";
import { Configuration, OpenAIApi } from "openai";
import type { Text, TextChunks } from "../types/openAi.types";
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

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY,
});

export const openai = new OpenAIApi(configuration);

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
  chunk: TextChunks;
  embedding: Array<number>;
  embeddingResponse: string;
}) => {
  await ctx.prisma.$executeRaw`
    insert into "Embeddings" ( 
        id,
        title         , 
        text_url      , 
        text_date     , 
        content       , 
        content_length ,
        content_tokens ,
        embedding      ,
        "openAiResponce" 
        )
         values 
        (
          ${Math.random()},
          ${chunk.title},
          ${chunk.text_url},
          ${chunk.text_date},
          ${chunk.content},
          ${chunk.content_length},
          ${chunk.content_tokens},
          ${embedding}::vector,
          ${embeddingResponse}::JSONB
        )
  `;
};

const CHUNK_SIZE = 200;

export const chunkText = (text: Text) => {
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
