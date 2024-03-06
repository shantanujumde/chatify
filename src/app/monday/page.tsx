"use server";
import OpenAI from "openai";
import { FC } from "react";
import { ClientButton } from "./components/clientButton";
interface MondayProps {}

const Monday: FC<MondayProps> = async ({}) => {
  try {
    const docs = await getDocuments();
    if (docs.data) {
      return (
        <>
          Select from the following board
          <ul className="cursor-pointer list-inside list-disc">
            {docs.data.docs.map((document, indx) => (
              <li key={indx}>
                <ClientButton
                  fn={generateNewBoard}
                  param={"ApiDoc"}
                  content={document.blocks}
                >
                  {document.name}
                </ClientButton>
              </li>
            ))}
          </ul>
        </>
      );
    }
  } catch (err) {
    console.error(err);
    return <h2>Something went wrong</h2>;
  }

  return <h2>Loading...</h2>;
};

export default Monday;

const headers = {
  "Content-Type": "application/json",
  Authorization: process.env.MONDAY_API_KEY ?? "",
};

export async function queryFireHelper<T>(query: string) {
  const result = await fetch("https://api.monday.com/v2", {
    method: "post",
    headers,
    body: JSON.stringify({
      query,
    }),
  });

  return (await result.json()) as T;
}
export const generateNewBoard = async (
  boardName: string,
  content: { content: string }[]
) => {
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

  const board = await queryFireHelper<CreateBoardResponse>(createBoardQuery);

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
  const boardItemsContent = await gptGeneration(content);

  const boardItems = JSON.parse(boardItemsContent?.content ?? "") as {
    task: string;
    description: string;
  }[];

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
};

export const getDocuments = async () => {
  type DocsData = {
    data: {
      me: {
        name: string;
      };
      docs: {
        name: string;
        blocks: {
          content: string;
        }[];
      }[];
    };
    account_id: number;
  };

  const query = `{ me { name } docs { name blocks { content } } }`;

  const docsResponse = await queryFireHelper<DocsData>(query);

  return docsResponse;
};

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
        
        Return it as a plain string JSON format. Ensure that the result is easily parsable using JSON.parse.
        
        In the generated response, please provide data for the tasks and descriptions.
        `,
      },
    ],
  });

  return chatResponse.choices[0]?.message;
};
