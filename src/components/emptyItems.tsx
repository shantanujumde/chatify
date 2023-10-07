import { cn } from "@/utils/utils";
import { GhostIcon } from "lucide-react";
import type { FC } from "react";

interface EmptyItemsProps {
  title?: string;
  description?: string;
  className?: string;
}

const EmptyItems: FC<EmptyItemsProps> = ({ title, description, className }) => {
  return (
    <div className={cn("flex w-full flex-col items-center gap-2", className)}>
      <GhostIcon className="h-8 w-8" />
      <p className="text-xl font-semibold">
        {title ? title : "I am lonely here!"}
      </p>
      <p>{description ? description : "Let's create history together"}</p>
    </div>
  );
};

export default EmptyItems;
