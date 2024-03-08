"use client";
import { useQuery } from "@tanstack/react-query";
import mondaySdk from "monday-sdk-js";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Spinner from "../../../components/ui/spinner";
import { api } from "../../../utils/api";

const SummaryButton = ({}) => {
  const [documentName, setDocumentName] = useState("my-awesome-document");
  const [copy, SetCopy] = useState(false);

  const monday = mondaySdk();
  monday.setApiVersion("2023-10");
  monday.setToken(process.env.MONDAY_API_KEY ?? "");

  const {
    data: generatedData,
    mutate: generator,
    isLoading: isGeneratorLoading,
  } = api.monday.generateBoardSummary.useMutation();

  const {
    // data: generatedData,
    mutate: createDocument,
    isLoading: isCreateDocumentLoading,
  } = api.monday.generateDocument.useMutation();

  const { data: boardDetails, isLoading: isBoardIdLoading } = useQuery(
    ["boardId"],
    async () => {
      const res = (await monday.get("context")) as AppData;
      const jwt = (await monday.get("sessionToken")) as SessionTokenData;
      return { boardDetails: res, jwtToken: jwt };
    }
  );

  if (isBoardIdLoading)
    return (
      <div className="mt-10 h-10 w-10">
        <Spinner />
      </div>
    );

  const handleCopy = async () => {
    if (!generatedData) return;

    await navigator.clipboard.writeText(generatedData);
    SetCopy(true);
  };
  return (
    <div className="mt-10 flex flex-col gap-4 text-center">
      <h2 className="text-2xl font-bold">
        Select from the generation strategies
      </h2>
      <div className="flex gap-2">
        <Button
          className="w-full"
          onClick={() =>
            generator({
              boardId: boardDetails?.boardDetails.data.boardId ?? 0,
              jwtToken: boardDetails?.jwtToken.data ?? "",
              type: "detailed",
            })
          }
        >
          Detailed
        </Button>
        <Button
          className="w-full"
          onClick={() =>
            generator({
              boardId: boardDetails?.boardDetails.data.boardId ?? 0,
              jwtToken: boardDetails?.jwtToken.data ?? "",
              type: "summary",
            })
          }
        >
          Summary
        </Button>
      </div>

      <div className="flex flex-col gap-4 text-center">
        <h2 className="text-2xl font-bold">Document</h2>
        <Button onClick={() => void handleCopy()}>
          {copy ? "Copied" : "Copy"}
        </Button>
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Document name"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value ?? "")}
          />
          <Button
            disabled={isCreateDocumentLoading}
            onClick={() =>
              createDocument({
                name: documentName,
                content: generatedData ?? "",
                workspaceId: boardDetails?.boardDetails.data.workspaceId ?? 0,
                jwtToken: boardDetails?.jwtToken.data ?? "",
              })
            }
          >
            Generate document{" "}
            {isCreateDocumentLoading && (
              <div className="h-3 w-3">
                <Spinner />
              </div>
            )}
          </Button>
        </div>
        {isGeneratorLoading && (
          <div className="flex flex-col items-center gap-4">
            <div className="mt-5 h-5 w-10">
              <Spinner />
            </div>
            <p>Generating document...</p>
          </div>
        )}
      </div>

      {generatedData && <p>{generatedData}</p>}
    </div>
  );
};

export default SummaryButton;

export type SessionTokenData = {
  method: string;
  type: string;
  data: string;
  requestId: string;
};

export type AppData = {
  method: string;
  type: string;
  data: {
    themeConfig?: {
      name: string;
      colors: {
        light: {
          "primary-color": string;
          "primary-hover-color": string;
          "primary-selected-color": string;
          "surfce-color": string;
          "primary-selected-hover-color": string;
          "primary-selected-on-secondary-color": string;
          brandColors: {
            "primary-color": string;
            "primary-hover-color": string;
            "primary-selected-hover-color": string;
            "brand-color": string;
            "brand-hover-color": string;
            "brand-selected-color": string;
            "brand-selected-hover-color": string;
            "text-color-on-primary": string;
            "text-color-on-brand": string;
            "primary-selected-color": string;
          };
        };
        dark: {
          "primary-color": string;
          "primary-hover-color": string;
          "primary-selected-color": string;
          "primary-selected-hover-color": string;
          "primary-selected-on-secondary-color": string;
          brandColors: {
            "primary-color": string;
            "primary-hover-color": string;
            "primary-selected-hover-color": string;
            "brand-color": string;
            "brand-hover-color": string;
            "brand-selected-color": string;
            "brand-selected-hover-color": string;
            "text-color-on-primary": string;
            "text-color-on-brand": string;
            "primary-selected-color": string;
          };
        };
        black: {
          "primary-color": string;
          "primary-hover-color": string;
          "primary-selected-color": string;
          "primary-selected-hover-color": string;
          "primary-selected-on-secondary-color": string;
          brandColors: {
            "primary-color": string;
            "primary-hover-color": string;
            "primary-selected-hover-color": string;
            "brand-color": string;
            "brand-hover-color": string;
            "brand-selected-color": string;
            "brand-selected-hover-color": string;
            "text-color-on-primary": string;
            "text-color-on-brand": string;
            "primary-selected-color": string;
          };
        };
      };
    };
    location: string;
    locationContext: {
      boardId: number;
      workspaceId: number;
    };
    appFeatureId: number;
    withExternalWidth: boolean;
    withHeaderPadding: boolean;
    boardId: number;
    workspaceId: number;
    theme: "light" | "dark" | "black";
    account: {
      id: string;
    };
    user: {
      id: string;
      isAdmin: boolean;
      isGuest: boolean;
      isViewOnly: boolean;
      countryCode: string;
      currentLanguage: string;
      timeFormat: string;
      timeZoneOffset: number;
    };
    region: string;
    app: {
      id: number;
      clientId: string;
    };
    appVersion: {
      id: number;
      name: string;
      status: string;
      type: string;
      versionData: {
        major: number;
        minor: number;
        patch: number;
        type: string;
      };
    };
    appFeature: {
      type: string;
      name: string;
    };
    permissions: {
      approvedScopes: string[];
      requiredScopes: string[];
    };
  };
  requestId: string;
};
