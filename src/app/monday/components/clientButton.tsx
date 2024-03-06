"use client";
import { Button } from "monday-ui-react-core";
import { PropsWithChildren } from "react";

export const ClientButton = ({
  fn,
  param,
  children,
  content,
}: PropsWithChildren<{
  fn: (boardName: string, content: { content: string }[]) => Promise<void>;
  param: string;
  content: { content: string }[];
}>) => {
  return <Button onClick={() => fn(param, content)}>{children}</Button>;
};
