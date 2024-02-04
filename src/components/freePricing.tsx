import { ArrowRight, Check, HelpCircle, Link } from "lucide-react";
import { useSession } from "next-auth/react";
import { FC } from "react";
import { api } from "../utils/api";
import { cn } from "../utils/utils";
import { Button, buttonVariants } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface freePricingProps {}

const FreePricing: FC<freePricingProps> = ({}) => {
  const { data } = useSession();

  const user = data?.user;
  const { mutate: createFreeTrail, isLoading: isCreatingFreeTrailLoading } =
    api.freeTrial.createFreeTrail.useMutation();

  return (
    <TooltipProvider>
      <div
        className={cn(
          "relative rounded-2xl border border-gray-200 bg-white shadow-lg dark:bg-secondary"
        )}
      >
        <div className="h-[80%]">
          <div className="p-5">
            <h3 className="font-display my-3 text-center text-3xl font-bold">
              Free
            </h3>
            <p className="text-gray-500 dark:text-gray-300">Try for free!</p>
            <p className="font-display my-5 text-6xl font-semibold">$0</p>
            <p className="text-gray-500 dark:text-gray-300">per month</p>
          </div>
          <ul className="my-10 space-y-5 px-8">
            <li className="flex space-x-5">
              <div className="flex-shrink-0">
                <Check className="h-6 w-6 text-primary/80" />
              </div>

              <div className="flex items-center space-x-1">
                <p className={cn("text-gray-600 dark:text-gray-300")}>
                  File limit of 2 files and 100 chats per day.
                </p>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger className="ml-1.5 cursor-default">
                    <HelpCircle className="h-4 w-4 text-zinc-500" />
                  </TooltipTrigger>
                  <TooltipContent className="w-80 p-2">
                    Avail the full power of the platform with a free trial.
                  </TooltipContent>
                </Tooltip>
              </div>
            </li>
            <li className="flex space-x-5"></li>
          </ul>
        </div>
        <div className="h-[20%] border-t border-gray-200">
          <div className="p-5">
            {user ? (
              <Button
                onClick={() => createFreeTrail()}
                loading={isCreatingFreeTrailLoading}
                className={buttonVariants({
                  className: "w-full",
                })}
              >
                Save & Start using
              </Button>
            ) : (
              <Link
                href="/auth/login"
                className={buttonVariants({
                  className: "w-full",
                })}
              >
                Sign up
                <ArrowRight className="ml-1.5 h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default FreePricing;
