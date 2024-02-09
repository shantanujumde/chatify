import { ArrowRight, Check, HelpCircle, Minus } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { type FC } from "react";
import { api } from "../utils/api";
import { cn } from "../utils/utils";
import { Button, buttonVariants } from "./ui/button";
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
        <div className="h-[85%]">
          <div className="p-5">
            <h3 className="font-display my-3 text-center text-3xl font-bold">
              Free trial
            </h3>
            <p className="text-gray-500 dark:text-gray-300">Try for free!</p>
            <p className="font-display my-5 text-6xl font-semibold">$0</p>
            <p className="text-gray-500 dark:text-gray-300">
              per month (no credit card required!)
            </p>
          </div>
          <ul className="my-10 space-y-5 px-8">
            {[
              {
                text: "Create a knowledge base of 2 files.",
                footnote:
                  "You can store up to 2 files. Each file can have more than 3000+ characters.",
              },
              {
                text: "Up to 100 chat messages.",
                footnote:
                  "You can have up to 100 chat messages. And understand every aspects of your file",
              },
              {
                text: "Mobile-friendly interface for on-the-go access.",
              },
              {
                text: "Priority support to address your business needs promptly.",
              },
              {
                text: "Limited collaborators",
                footnote:
                  "Users that can access knowledge base (You can assign them roles, individuals that controls knowledge base & individuals that can only chat, etc.).",
              },
              {
                text: "Role-based access control (Coming soon).",
                footnote:
                  "Users that can access knowledge base (You can assign them roles, individuals that controls knowledge base & individuals that can only chat, etc.).",
              },
              {
                text: "Very fast & higher quality responses.",
                footnote:
                  "Expect slower responses as compared to Business plan having better algorithmic responses for enhanced content quality.",

                negative: true,
              },
              {
                text: "Unlimited collaborators",
                negative: true,
              },
            ].map((feature) => (
              <li key={feature.text} className="flex space-x-5">
                <div className="flex-shrink-0">
                  {!feature.negative ? (
                    <Check className="h-6 w-6 text-primary/80" />
                  ) : (
                    <Minus className="h-6 w-6 text-gray-300 dark:text-gray-500" />
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  <p className={cn("text-gray-600 dark:text-gray-300")}>
                    {feature.text}
                  </p>
                  {feature.footnote && (
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger className="ml-1.5 cursor-default">
                        <HelpCircle className="h-4 w-4 text-zinc-500" />
                      </TooltipTrigger>
                      <TooltipContent className="w-80 p-2">
                        {feature.footnote}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="h-1/6 border-t border-gray-200">
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
