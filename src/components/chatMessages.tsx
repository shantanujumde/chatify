import type { Chats } from "@prisma/client";
import { PlusIcon } from "@radix-ui/react-icons";
import { UserCircle2 } from "lucide-react";
import type { User } from "next-auth";
import Image from "next/image";
import type { FC } from "react";
import ChatMessagesSkeletion from "./chatMessagesSkeletion";
import EmptyItems from "./emptyItems";
import Spinner from "./ui/spinner";

interface ChatMessagesProps {
  chats?: Chats[];
  isScreenLoading: boolean;
  isChatLoading: boolean;
  user?: User | null;
}

const ChatMessages: FC<ChatMessagesProps> = ({
  chats,
  isScreenLoading,
  isChatLoading,
  user,
}) => {
  if (isScreenLoading) {
    return <ChatMessagesSkeletion />;
  }

  return (
    <>
      {user && (
        <div className="my-4 flex flex-row items-center space-y-1.5 rounded-2xl border border-gray-500/50 p-2">
          <div className="flex items-center space-x-4">
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full">
              {user.image ? (
                <Image alt="Image" width="40" height="40" src={user.image} />
              ) : (
                <UserCircle2 className="h-8 w-8" />
              )}
            </span>
            <div>
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <button
            className="ml-auto inline-flex h-9 w-9 items-center justify-center  rounded-full border border-input bg-transparent text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            data-state="closed"
          >
            <PlusIcon className="my-auto" />
            <span className="sr-only">New message</span>
          </button>
        </div>
      )}
      {chats?.length ? (
        <div
          className={`
          scrollbar-thumb-black scrollbar-track-black-lighter  
          dark:scrollbar-thumb-white dark:scrollbar-track-white-lighter 
          scrollbar-thumb-rounded 
         scrollbar-w-2 scrolling-touch max-h-screen 
        overflow-y-scroll rounded-xl bg-gray-300/5 p-6`}
        >
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
      ) : (
        <EmptyItems className="py-16" />
      )}
    </>
  );
};

export default ChatMessages;
