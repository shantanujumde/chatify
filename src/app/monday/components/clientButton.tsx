"use client";
import { useQuery } from "@tanstack/react-query";
import mondaySdk from "monday-sdk-js";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Spinner from "../../../components/ui/spinner";
import { api } from "../../../utils/api";
import { type AppData, type SessionTokenData } from "./summaryButton";
export const ClientButton = ({}) => {
  const monday = mondaySdk();
  monday.setApiVersion("2023-10");
  monday.setToken(process.env.MONDAY_API_KEY ?? "");
  const [documentName, setDocumentName] = useState("my-awesome-document");

  const { mutate: generateNewBoard, isLoading: isGenerateNewBoardLoading } =
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
        <Spinner />
      </div>
    );

  if (!documentData) return <p>Your document might be empty!</p>;

  return (
    <div className="mt-10 flex flex-col gap-4 text-center">
      <h2 className="text-2xl font-bold">
        Generate board for current document
      </h2>

      <Input
        placeholder="Document name"
        value={documentName}
        onChange={(e) => setDocumentName(e.target.value ?? "")}
      />
      <Button
        disabled={isGenerateNewBoardLoading}
        onClick={() =>
          generateNewBoard({
            boardName: documentName,
            content: documentData.document,
            jwtToken: documentData.jwt.data,
          })
        }
      >
        Generate Board{" "}
        {isGenerateNewBoardLoading && (
          <div className="h-3 w-3">
            <Spinner />
          </div>
        )}
      </Button>
    </div>
  );
};
