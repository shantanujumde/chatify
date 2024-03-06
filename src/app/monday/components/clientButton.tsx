"use client";
import { useQuery } from "@tanstack/react-query";
import mondaySdk from "monday-sdk-js";
import { Button, Loader } from "monday-ui-react-core";
import { api } from "../../../utils/api";
import { AppData, SessionTokenData } from "./summaryButton";
export const ClientButton = ({}) => {
  const monday = mondaySdk();
  monday.setApiVersion("2023-10");
  monday.setToken(process.env.MONDAY_API_KEY ?? "");

  const { mutate: generateNewBoard } =
    api.monday.generateNewBoard.useMutation();

  const { data: documentData, isLoading: isBoardIdLoading } = useQuery(
    ["boardId"],
    async () => {
      const documentData = (await monday.get("context")) as AppData & {
        data: { locationContext: { input: string } };
      };

      const jwt = (await monday.get("sessionToken")) as SessionTokenData;

      return { document: documentData.data.locationContext.input, jwt };
    }
  );

  if (isBoardIdLoading)
    return (
      <div className="mt-10 h-10 w-10">
        <Loader />
      </div>
    );

  if (!documentData) return <p>Your document might be empty!</p>;

  return (
    <div className="mt-10 flex flex-col gap-4 text-center">
      <h2 className="text-2xl font-bold">
        Generate board for current document
      </h2>

      <Button
        size={Button.sizes.MEDIUM}
        onClick={() =>
          generateNewBoard({
            boardName: "Ai-generated-board",
            content: documentData.document,
            jwtToken: documentData.jwt.data,
          })
        }
      >
        Generate Board
      </Button>
    </div>
  );
};
