import { PlusIcon, UserCircle2 } from "lucide-react";
import type { FC } from "react";
import Skeleton from "react-loading-skeleton";

const ChatMessagesSkeleton: FC = ({}) => {
  const LOADING_SKELETON = [];

  for (let i = 0; i <= 10; i++) {
    LOADING_SKELETON.push(
      <div key={i}>
        <div className="ml-auto w-max max-w-[50%] rounded-lg bg-primary px-3 py-2 text-right text-sm text-primary-foreground">
          <Skeleton
            direction="rtl"
            baseColor="#00ff5d"
            highlightColor="#d8ffe6"
            width={250}
            borderRadius="1rem"
          />
          <Skeleton
            direction="rtl"
            baseColor="#00ff5d"
            highlightColor="#d8ffe6"
            width={140}
            borderRadius="1rem"
          />
        </div>
        <div className="flex w-max max-w-[50%] flex-col gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
          <Skeleton
            baseColor="#7a7a7a"
            highlightColor="#fff"
            width={190}
            borderRadius="1rem"
          />
          <Skeleton
            baseColor="#7a7a7a"
            highlightColor="#fff"
            width={140}
            borderRadius="1rem"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="my-4 flex items-center space-y-1.5 rounded-2xl border border-gray-500/50 p-2">
        <div className="flex items-center space-x-4">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full">
            <UserCircle2 className="h-8 w-8" />
          </span>
          <div>
            <p className="text-sm font-medium leading-none">
              <Skeleton baseColor="#7a7a7a" highlightColor="#fff" width={100} />
            </p>
            <p className="text-sm text-muted-foreground">
              <Skeleton baseColor="#7a7a7a" highlightColor="#fff" width={50} />
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
      </div>
      <div
        className={`
          scrollbar-thumb-black scrollbar-track-black-lighter  
          dark:scrollbar-thumb-white dark:scrollbar-track-white-lighter 
          scrollbar-thumb-rounded 
         scrollbar-w-2 scrolling-touch max-h-screen 
        overflow-y-scroll rounded-xl bg-gray-300/5 p-6`}
      >
        {LOADING_SKELETON}
      </div>
    </>
  );
};

export default ChatMessagesSkeleton;
