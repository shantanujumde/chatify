import console from "console";
import { encode } from "gpt-3-encoder";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { openai, supabaseClient } from "./helplers";

export const opeanAiRouter = createTRPCRouter({
  createEmbeddings: publicProcedure
    .input(z.object({ id: z.string(), text: z.string() }))
    .mutation(({ input }) => {
      const chunkArray = chunkText({
        title: input.id,
        url: input.id,
        date: input.id,
        content: input.text,
        length: input.text.length,
        tokens: encode(input.text).length,
        chunks: [],
      });

      chunkArray.chunks.map(async (chunk) => {
        const embeddingResponse = await openai.createEmbedding({
          model: "text-embedding-ada-002",
          input: chunk.content,
        });

        const embedding = embeddingResponse.data.data[0]?.embedding;
        if (embedding) {
          const { error: insertPageSectionError, data: pageSection } =
            await supabaseClient.from("Embeddings").insert({
              content: chunk.content,
              content_length: chunk.content_length,
              content_tokens: chunk.content_tokens,
              embedding: embedding as unknown as string,
              openAiResponce: JSON.stringify(embeddingResponse.data.data),
              text_date: chunk.text_date,
              text_url: chunk.text_url,
              title: chunk.title,
            });

          console.log(
            "openAi=>error, data",
            insertPageSectionError,
            pageSection
          );
        }
      });
    }),

  getClosestEmbeddings: publicProcedure
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
      console.log("openAi=>embedding", embedding);

      const { error: matchError, data: pageSections } =
        await supabaseClient.rpc("match_page_sections", {
          embedding: embedding as unknown as string,
          match_threshold: 0.5,
          match_count: 10,
          min_content_length: 50,
        });

      console.log("openAi=>matchError, pageSections", matchError, pageSections);
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

const CHUNK_SIZE = 200;

const chunkText = (text: Text) => {
  const { title, url, date, content } = text;

  const textTextChunks = [];

  if (encode(content).length > CHUNK_SIZE) {
    const split = content.split(". ");
    let chunkText = "";

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < split.length; i++) {
      const sentence = split[i];

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
