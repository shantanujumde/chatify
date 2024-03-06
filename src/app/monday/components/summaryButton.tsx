"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import mondaySdk from "monday-sdk-js";
import { Button, Loader } from "monday-ui-react-core";
import { FC, useState } from "react";

interface SummaryButtonProps {
  generator: (boardId: number | null) => Promise<string | undefined>;
}

const SummaryButton: FC<SummaryButtonProps> = ({ generator }) => {
  const [summary, setSummary] = useState<string>();

  const monday = mondaySdk();
  monday.setApiVersion("2023-10");
  monday.setToken(process.env.MONDAY_API_KEY ?? "");

  const { data: boardId, isLoading: isBoardIdLoading } = useQuery(
    ["boardId"],
    async () => {
      const res = (await monday.get("context")) as AppData;
      return res.data.locationContext.boardId;
    }
  );

  const { mutate: getSummary, isLoading: isGetSummaryLoading } = useMutation(
    ["summary"],
    async () => {
      const summaryRes = await generator(boardId ?? null);
      setSummary(summaryRes);
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
      <h2 className="text-2xl font-bold">Generate summary for current board</h2>
      <Button size={Button.sizes.MEDIUM} onClick={() => getSummary()}>
        Generate Summary
      </Button>

      <div className="flex flex-col gap-4 text-center">
        <h2 className="text-2xl font-bold">Summary</h2>
        <Button
          kind={Button.kinds.SECONDARY}
          size={Button.sizes.MEDIUM}
          onClick={() => navigator.clipboard.writeText(summary ?? "")}
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
      </div>
      {isGetSummaryLoading && (
        <div className="mt-5 h-5 w-10">
          <Loader /> Generating summary...
        </div>
      )}
      {summary && <p>{summary}</p>}
    </div>
  );
};

export default SummaryButton;

type AppData = {
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
