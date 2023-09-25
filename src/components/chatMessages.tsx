import type { Chats } from "@prisma/client";
import { PlusIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import type { FC } from "react";
import Spinner from "./ui/spinner";

interface ChatMessagesProps {
  chats: Chats[];
  isScreenLoading: boolean;
  isChatLoading: boolean;
}

const ChatMessages: FC<ChatMessagesProps> = ({
  chats,
  isScreenLoading,
  isChatLoading,
}) => {
  if (isScreenLoading) return <Spinner />;
  if (!chats.length)
    return (
      <div className="w-full">Please write something to create history!</div>
    );

  return (
    <>
      <div className="flex flex-row items-center space-y-1.5 p-6">
        <div className="flex items-center space-x-4">
          <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
            <Image
              alt="Image"
              width="40"
              height="40"
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            />
          </span>
          <div>
            <p className="text-sm font-medium leading-none">Sofia Davis</p>
            <p className="text-sm text-muted-foreground">m@example.com</p>
          </div>
        </div>
        <button
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-input bg-transparent text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          data-state="closed"
        >
          <PlusIcon />
          <span className="sr-only">New message</span>
        </button>
      </div>
      <div className="p-6 pt-0">
        <div className="space-y-4">
          {chats.map((chat) => {
            return (
              <div key={chat.id}>
                <div className="ml-auto w-max max-w-[50%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
                  {chat.question}
                </div>
                <div className="flex w-max max-w-[50%] flex-col gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
                  {chat.response}
                </div>
              </div>
            );
          })}
          {isChatLoading && (
            <div className="flex w-max max-w-[50%] flex-col gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
              <i className="flex">
                typing... <Spinner className="h-3 w-3" />
              </i>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatMessages;
