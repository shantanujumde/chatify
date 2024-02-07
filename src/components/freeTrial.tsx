import { ArrowRight, Check, HelpCircle, MessageCircle } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { type FC } from "react";
import { api } from "../utils/api";
import { cn } from "../utils/utils";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { toast } from "./ui/use-toast";

const FreeTrial: FC = () => {
  const { data } = useSession();

  const user = data?.user;

  const { mutate: createFreeTrail, isLoading: createFreeTrailIsLoading } =
    api.freeTrial.createFreeTrail.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description:
            "Your free trial has been created, Please re-login to continue!",
        });

        setTimeout(() => {
          void signOut({ callbackUrl: "/auth/login" });
        }, 3000);
      },
    });

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
              Free trial
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
                  Use your own OpenAI API key & Access all Chatify&apos;s
                  Business plan features for free.
                </p>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger className="ml-1.5 cursor-default">
                    <HelpCircle className="h-4 w-4 text-zinc-500" />
                  </TooltipTrigger>
                  <TooltipContent className="w-80 p-2">
                    Leverage your personal OpenAI API key to seamlessly unlock
                    all premium features of Chatify&apos;s Business plan,
                  </TooltipContent>
                </Tooltip>
              </div>
            </li>
            <li className="flex space-x-5">
              <div className="flex-shrink-0">
                <MessageCircle className="top-3 h-6 w-6 text-primary/80" />
              </div>
              <Input
                className="w-full"
                placeholder="Enter your OpenAI API key"
              />
            </li>
          </ul>
        </div>
        <div className="h-[20%] border-t border-gray-200">
          <div className="p-5">
            {user ? (
              <Button
                loading={createFreeTrailIsLoading}
                className={buttonVariants({
                  className: "w-full",
                })}
                onClick={() => createFreeTrail()}
              >
                Avail Free Trial
              </Button>
            ) : (
              <Link
                href="/auth/login"
                className={buttonVariants({
                  className: "w-full",
                })}
              >
                {user ? "Upgrade now" : "Sign up"}
                <ArrowRight className="ml-1.5 h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default FreeTrial;
