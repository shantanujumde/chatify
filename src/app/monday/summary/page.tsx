"use server";
import OpenAI from "openai";
import { FC } from "react";
import SummaryButton from "../components/summaryButton";
import { queryFireHelper } from "../page";

interface SummaryProps {}

const Summary: FC<SummaryProps> = ({}) => {
  return (
    <>
      <SummaryButton generator={getBoardData} />
    </>
  );
};

export default Summary;

export async function getBoardData(
  boardId: number | null
): Promise<string | undefined> {
  "use server";

  if (!boardId) return;
  const getBoardData = `{ boards(ids: ${boardId}) { items_page(limit: 100) { cursor items { id name column_values { id text value } } } } }`;

  const data = await queryFireHelper<object>(getBoardData);
  const summary = await gptGeneration(data);
  return summary?.content ?? undefined;
}

const gptGeneration = async (content: object) => {
  const openAi = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
  });
  const chatResponse = await openAi.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0,
    stream: false,
    messages: [
      {
        role: "system",
        content: "You are a assistant of monday.com",
      },
      {
        role: "user",
        content: JSON.stringify(content),
      },
      {
        role: "system",
        content: `
        Summarize the data provided by the user in easy to understand format.
        `,
      },
    ],
  });

  return chatResponse.choices[0]?.message;
};
