import jwt from "jsonwebtoken";
import OpenAI from "openai";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
export const monday = createTRPCRouter({
  generateNewBoard: publicProcedure
    .input(
      z.object({
        boardName: z.string(),
        content: z.string(),
        jwtToken: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { boardName, content, jwtToken } = input;
      //0. validate
      if (!isAuthorized(jwtToken)) throw new Error("Not authorized");

      //1. create board
      type CreateBoardResponse = {
        data: {
          create_board: {
            id: string;
          };
        };
        account_id: number;
      };

      let createBoardQuery = `mutation { create_board (board_name: "${boardName}", board_kind: public) {	id }}`;

      const board = await queryFireHelper<CreateBoardResponse>(
        createBoardQuery
      );

      const boardId = board.data.create_board.id;

      //2. create columns in board
      let createColumnQuery = `mutation {
          col1: create_column(
            board_id:${boardId} 
            title: "Task"
            description: "Task description"
            column_type: long_text
          ) {
            id
            title
            description
          }
          col2: create_column(
            board_id:${boardId} 
            title: "Description"
            description: "Description"
            column_type: long_text
          ) {
            id
            title
            description
          }
          col3: create_column(
            board_id:${boardId} 
            title: "Status"
            description: "Description"
            column_type: status
          ) {
            id
            title
            description
          }
        }`;
      await queryFireHelper<any>(createColumnQuery);

      // generate data for columns
      const boardItemsContent = await gptBoardGeneration(content);

      const boardItems = JSON.parse(boardItemsContent?.content ?? "") as {
        task: string;
        description: string;
      }[];
      console.info("items-trpc", boardItems);

      // add data to columns
      const addDataQuery = `mutation {
          ${boardItems.map((item, indx) => {
            return `
            addData${indx}: create_item(
              board_id: ${boardId}
              item_name: "new item"
              column_values: "${JSON.stringify(item).replaceAll('"', '\\"')}"
            ) {
              id
            }
            `;
          })}
        }`;

      await queryFireHelper<any>(addDataQuery);
    }),

  generateBoardSummary: publicProcedure
    .input(
      z.object({
        boardId: z.number(),
        jwtToken: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { boardId, jwtToken } = input;
      if (!isAuthorized(jwtToken)) throw new Error("Not authorized");

      if (!boardId) return;
      const getBoardData = `{ boards(ids: ${boardId}) { items_page(limit: 100) { cursor items { id name column_values { id text value } } } } }`;

      const data = await queryFireHelper<object>(getBoardData);
      const summary = await gptSummaryGeneration(data);
      return summary?.content ?? undefined;
    }),
});

async function queryFireHelper<T>(query: string) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: process.env.MONDAY_API_KEY ?? "",
  };

  const result = await fetch("https://api.monday.com/v2", {
    method: "post",
    headers,
    body: JSON.stringify({
      query,
    }),
  });

  return (await result.json()) as T;
}

const gptSummaryGeneration = async (content: object) => {
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

export const gptBoardGeneration = async (content: string) => {
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
        content:
          "You are a assistant of monday.com and you are creating a board from the document that is created by user",
      },
      {
        role: "user",
        content: JSON.stringify(content),
      },
      {
        role: "system",
        content: `
          Generate data in the format:
  
          [
            {
              "task": "string",
              "description": "string"
            }
          ]
          
          Return it as a plain string JSON format in single line. Ensure that the result is easily parsable using JSON.parse.
          
          In the generated response, please provide data for the tasks and descriptions.
          `,
      },
    ],
  });

  return chatResponse.choices[0]?.message;
};

export function isAuthorized(token: string) {
  try {
    const clientSecret: string = process.env.CLIENT_SECRET ?? "";
    const payload = jwt.verify(token, clientSecret);
    if (payload) {
      return true;
    }
  } catch (err) {
    console.error(err);
  }
  return false;
}
