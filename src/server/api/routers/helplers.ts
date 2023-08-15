import type { Prisma, PrismaClient } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import { createClient, type Session } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import type { TextChunks } from "./openAi";

// generate supbase types SUPABASE_ACCESS_TOKEN="sbp_946b15a172ba5b1d946f2ab457a9f6d60432d503" npx supabase gen types typescript --project-id ihvlvwekjudpqbosoewy > database.types.ts

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
