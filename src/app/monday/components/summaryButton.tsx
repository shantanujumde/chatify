"use client";
import { useQuery } from "@tanstack/react-query";
import mondaySdk from "monday-sdk-js";
import { Button, Loader } from "monday-ui-react-core";
import { FC } from "react";
import { api } from "../../../utils/api";

interface SummaryButtonProps {}

const SummaryButton: FC<SummaryButtonProps> = ({}) => {
  const monday = mondaySdk();
  monday.setApiVersion("2023-10");
  monday.setToken(process.env.MONDAY_API_KEY ?? "");

  const {
    data: generatedData,
    mutateAsync: generator,
    isLoading: isGeneratorLoading,
  } = api.monday.generateBoardSummary.useMutation();

  const { data: boardId, isLoading: isBoardIdLoading } = useQuery(
    ["boardId"],
    async () => {
      const res = (await monday.get("context")) as AppData;
      const jwt = (await monday.get("sessionToken")) as SessionTokenData;
      return { boardId: res?.data?.locationContext?.boardId, jwtToken: jwt };
    }
  );

  if (isBoardIdLoading)
    return (
      <div className="mt-10 h-10 w-10">
        <Loader />
      </div>
    );

  return (
    <div className="mt-10 flex flex-col gap-4 text-center">
      <h2 className="text-2xl font-bold">
        Select from the generation strategies
      </h2>
      <div className="flex justify-around">
        <Button
          color={Button.colors.POSITIVE}
          size={Button.sizes.SMALL}
          onClick={() =>
            generator({
              boardId: boardId?.boardId ?? 0,
              jwtToken: boardId?.jwtToken.data ?? "",
              type: "detailed",
            })
          }
        >
          Detailed
        </Button>
        <Button
          color={Button.colors.INVERTED}
          size={Button.sizes.SMALL}
          onClick={() =>
            generator({
              boardId: boardId?.boardId ?? 0,
              jwtToken: boardId?.jwtToken.data ?? "",
              type: "summary",
            })
          }
        >
          Summary
        </Button>
      </div>

      <div className="flex flex-col gap-4 text-center">
        <h2 className="text-2xl font-bold">Document</h2>
        <Button
          kind={Button.kinds.SECONDARY}
          size={Button.sizes.MEDIUM}
          onClick={() => navigator.clipboard.writeText(generatedData ?? "")}
        >
          copy
        </Button>
        <Button
          kind={Button.kinds.SECONDARY}
          size={Button.sizes.MEDIUM}
          // onClick={}
        >
          Generate document
        </Button>
        {isGeneratorLoading && (
          <div className="flex flex-col items-center gap-4">
            <div className="mt-5 h-5 w-10">
              <Loader />
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
