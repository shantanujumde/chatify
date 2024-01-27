import UpgradeButton from "@/components/UpgradeButton";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PLANS, type TiersType } from "@/config/stripe";
import { cn } from "@/utils/utils";
import { ArrowRight, Check, HelpCircle, Minus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Pricing = () => {
  const { data } = useSession();

  const user = data?.user;

  const pricingItems = [
    {
      plan: "Essential",

      slug: "TIER-I" as TiersType,
      tagline: "Free trail for 30 days.",
      features: [
        {
          text: "This is free trial plan.",
          footnote:
            "Plan is applicable only for new users. It will be automatically upgraded to a paid plan after 30 days.",
        },
        {
          text: "Up to 30 files of knowledge base.",
          footnote:
            "Each file can have only 1000 characters. This is the maximum number of characters that can be stored in a single document.",
        },
        {
          text: "1 individual user.",
          footnote: "Users that can access knowledge base.",
        },
        {
          text: "Mobile-friendly interface for on-the-go access.",
        },
        {
          text: "Higher-quality responses.",
          footnote: "Better algorithmic responses for enhanced content quality",
          negative: true,
        },
        {
          text: "Priority support.",
          negative: true,
        },
      ],
    },
    {
      plan: "Business",
      slug: "TIER-II" as TiersType,
      tagline: "For larger projects with higher needs.",
      features: [
        {
          text: "Expansive storage up to 300 files.",
          footnote:
            "Each file can have only 1000 characters. This is the maximum number of characters that can be stored in a single document.",
        },
        {
          text: "Unlimited collaborators",
          footnote:
            "Users that can access knowledge base (You can assign them roles, individuals that controls knowledge base & individuals that can only chat, etc.).",
        },
        {
          text: "Role-based access control (Coming soon).",
          footnote:
            "Users that can access knowledge base (You can assign them roles, individuals that controls knowledge base & individuals that can only chat, etc.).",
        },
        {
          text: "Mobile-friendly interface for on-the-go access.",
        },
        {
          text: "Enjoy higher-quality responses for enhanced productivity.",
          footnote: "Better algorithmic responses for enhanced content quality",
        },
        {
          text: "Priority support to address your business needs promptly.",
        },
      ],
    },
    {
      plan: "Enterprise",
      slug: "TIER-III" as TiersType,
      tagline: "Customized.",
      features: [
        {
          text: "Tailored for large enterprises with unique requirements.",
        },
        {
          text: "Scalable for companies.",
        },
        {
          text: "Experience higher-quality responses, ideal for corporate environments.",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "Higher-quality responses",
        },
        {
          text: "Priority support to meet the demands of your growing knowledge base.",
        },
      ],
    },
  ];

  return (
    <div className="my-10">
      <div className="my-10 text-left sm:max-w-lg">
        <h1 className="text-6xl font-bold sm:text-7xl">Pricing</h1>
        <p className="mt-5 text-gray-600 dark:text-gray-300 sm:text-lg">
          Whether you&apos;re just trying out our service or need more,
          we&apos;ve got you covered.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 pt-12 md:grid-cols-2 lg:grid-cols-3">
        <TooltipProvider>
          {pricingItems.map(({ plan, slug, tagline, features }) => {
            const price = PLANS.find((p) => p.slug === slug)?.price.amount ?? 0;

            return (
              <div
                key={slug}
                className={cn(
                  "relative rounded-2xl border border-gray-200 bg-white shadow-lg dark:bg-secondary",
                  {
                    "border-2 border-primary/80 shadow-blue-200 dark:shadow-primary":
                      slug === "TIER-II",
                    "border-2 border-primary shadow-blue-300 dark:shadow-primary":
                      slug === "TIER-III",
                  }
                )}
              >
                {slug === "TIER-II" && (
                  <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-primary to-cyan-600 px-3 py-2 text-sm font-medium text-white">
                    Upgrade now
                  </div>
                )}
                <div className="h-[80%]">
                  <div className="p-5">
                    <h3 className="font-display my-3 text-center text-3xl font-bold">
                      {plan}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-300">
                      {tagline}
                    </p>
                    <p className="font-display my-5 text-6xl font-semibold">
                      ${price}
                    </p>
                    <p className="text-gray-500 dark:text-gray-300">
                      per month
                    </p>
                  </div>

                  <ul className="my-10 space-y-5 px-8">
                    {features.map(({ text, footnote, negative }) => (
                      <li key={text} className="flex space-x-5">
                        <div className="flex-shrink-0">
                          {negative ? (
                            <Minus className="h-6 w-6 text-gray-300 dark:text-gray-500" />
                          ) : (
                            <Check className="h-6 w-6 text-primary/80" />
                          )}
                        </div>
                        {footnote ? (
                          <div className="flex items-center space-x-1">
                            <p
                              className={cn(
                                "text-gray-600 dark:text-gray-300",
                                {
                                  "text-gray-400 dark:text-gray-500": negative,
                                }
                              )}
                            >
                              {text}
                            </p>
                            <Tooltip delayDuration={300}>
                              <TooltipTrigger className="ml-1.5 cursor-default">
                                <HelpCircle className="h-4 w-4 text-zinc-500" />
                              </TooltipTrigger>
                              <TooltipContent className="w-80 p-2">
                                {footnote}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ) : (
                          <p
                            className={cn("text-gray-600 dark:text-gray-300", {
                              "text-gray-400 dark:text-gray-500": negative,
                            })}
                          >
                            {text}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="h-[20%] border-t border-gray-200">
                  <div className="p-5">
                    {slug === "TIER-I" ? (
                      <Link
                        href={user ? "/dashboard" : "/auth/login"}
                        className={buttonVariants({
                          className: "w-full",
                          variant: "secondary",
                        })}
                      >
                        {user ? "Upgrade now" : "Sign up"}
                        <ArrowRight className="ml-1.5 h-5 w-5" />
                      </Link>
                    ) : user ? (
                      <UpgradeButton tier={slug} />
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
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Pricing;
