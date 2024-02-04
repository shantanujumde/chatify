import { type Database } from "@/server/api/types/supabase.types";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db";
import { createClient } from "@supabase/supabase-js";
import { TRPCError } from "@trpc/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import OpenAI from "openai";
import { type CreateEmbeddingResponse } from "openai/resources";
import { z } from "zod";
import { chatLimit } from "../../../server/api/helpers/freeTrial.helpers";

const openAi = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const createEmbedding = async (
  text: string[] | string
): Promise<CreateEmbeddingResponse> => {
  return await openAi.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
};

const getClosestEmbeddings = async (text: string) => {
  const embeddingResponse = await createEmbedding(text);

  if (!embeddingResponse)
    throw new Error("Failed to create embedding for question");

  const embedding = embeddingResponse.data[0]?.embedding;

  if (!embedding) throw new Error("Failed to create embedding for question");

  const supabaseClient = createClient<Database>(
    String(process.env.SUPABASE_URL),
    String(process.env.SUPABASE_SERVICE_ROLE_KEY),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
  const { error: matchError, data: pageSections } = await supabaseClient.rpc(
    "match_documents",
    {
      query_embedding: embedding as unknown as string,
      match_threshold: 0.5,
      match_count: 10,
    }
  );

  if (matchError)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Similar text not found!" + JSON.stringify(matchError),
      cause: matchError,
    });

  return pageSections;
};

export function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Message route health check success",
    body: request.body,
  });
}

const MessageSchema = z.object({
  message: z.string(),
  chats: z.object({
    chatLength: z.number(),
    chats: z.array(
      z.object({
        id: z.number(),
        question: z.string(),
        response: z.string(),
        createdAt: z.string(),
        userId: z.string(),
      })
    ),
  }),
});

export async function POST(request: NextRequest) {
  const body = MessageSchema.parse(await request.json());
  // get session
  const session = await getServerSession(authOptions);

  const user = session?.user;

  if (!user) return new Response("Unauthorized", { status: 401 });

  if (!(await chatLimit(user.id))) {
    return new Response(
      "LIMIT_EXCEEDED You have reached your chat limit. Upgrade to a paid plan to increase your limit.",
      { status: 403 }
    );
  }

  const { message, chats } = body;

  // 1: get embedding
  const closestEmbeddings = await getClosestEmbeddings(message);

  const previousQuestionsAnswers = chats.chats
    .map((message) => [
      `User: ${message.question}\n`,
      `Assistant: ${message.response}\n`,
    ])
    .flat();

  const context = closestEmbeddings.map((section) => ({
    context: section.content,
    similarityToQuestion: section.similarity,
  }));

  // 2: generate response
  const chatResponse = await openAi.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0,
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "Use the following pieces of context (or previous conversation if needed) to answer the users question in markdown format.",
      },

      {
        role: "user",
        content: `Use the following pieces of context (or previous conversation if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
  \n----------------\n
  
      PREVIOUS CONVERSATION:
      ${JSON.stringify(previousQuestionsAnswers)}
  
  \n----------------\n
  
  CONTEXT:
  ${JSON.stringify(context)}
  
  USER INPUT: ${message}`,
      },
    ],
  });

  const stream = OpenAIStream(chatResponse, {
    async onCompletion(completion) {
      await prisma.chats.create({
        data: {
          question: message,
          response: completion,
          userId: user.id,
        },
      });
    },
  });

  return new StreamingTextResponse(stream);
}
