import { PlusIcon } from "lucide-react";
import Image from "next/image";
import type { FC } from "react";
import Skeleton from "react-loading-skeleton";

const ChatMessagesSkeletion: FC = ({}) => {
  const random = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min)) + min;

  const LOADING_SKELETON = [];
  for (let i = 0; i <= 10; i++) {
    LOADING_SKELETON.push(
      <div key={i}>
        <div className="ml-auto w-max max-w-[50%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
          <Skeleton
            direction="rtl"
            baseColor="#90310057"
            highlightColor="#903100"
            width={random(50, 150)}
          />
        </div>
        <div className="flex w-max max-w-[50%] flex-col gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
          <Skeleton
            baseColor="#7a7a7a"
            highlightColor="#fff"
            width={random(50, 150)}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col  space-y-1.5 p-6">
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
          <p className="text-sm font-medium leading-none">
            <Skeleton baseColor="#7a7a7a" highlightColor="#fff" width={100} />
          </p>
          <p className="text-sm text-muted-foreground">
            <Skeleton baseColor="#7a7a7a" highlightColor="#fff" width={100} />
          </p>
        </div>
      </div>
      <button
        className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-input bg-transparent text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        data-state="closed"
      >
        <PlusIcon />
        <span className="sr-only">New message</span>
      </button>
      {LOADING_SKELETON}
    </div>
  );
};

export default ChatMessagesSkeletion;
