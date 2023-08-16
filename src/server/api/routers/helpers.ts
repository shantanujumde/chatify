import type { Prisma, PrismaClient } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import { createClient, type Session } from "@supabase/supabase-js";
import { Configuration, OpenAIApi } from "openai";
import type { Database } from "./database.types";
import type { TextChunks } from "./openAi";

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
