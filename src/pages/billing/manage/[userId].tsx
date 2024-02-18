import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { type Plans } from "@/config/stripe";
import { getUserSubscriptionPlan } from "@/libs/stripe";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/utils/api";
import { format, sub } from "date-fns";
import { Loader2 } from "lucide-react";
import type { GetServerSideProps, GetServerSidePropsResult } from "next";
import Link from "next/link";
import { useEffect } from "react";

type ManageFormProps = {
  subscription: {
    isCanceled: boolean;
    isSubscribed: boolean;
    stripeCurrentPeriodEnd: string;
    plan: Plans | undefined | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

const Manage = (props: ManageFormProps) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!props.subscription?.createdAt) return;

    if (
      new Date(props.subscription?.createdAt) >= sub(new Date(), { days: 2 })
    ) {
      toast({
        title: "Please re-login to continue",
        description:
          "If you have made changes to your subscription, please re-login to continue.",
      });
    }
  }, [props.subscription?.createdAt, toast]);

  if (props.subscription === null)
    return <>You are not authorized to view this page</>;

  const { subscription: subscriptionPlan } = props;

  const { mutate: createStripeSession, isLoading } =
    api.payments.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) window.location.href = url;
        if (!url) {
          toast({
            title: "There was a problem...",
            description: "Please try again in a moment",
            variant: "destructive",
          });
        }
      },
    });

  if (!subscriptionPlan) return <>You do not have a subscription yet</>;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createStripeSession({ tier: "TIER-II" });
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>
            {!subscriptionPlan.isSubscribed ? (
              "You do not have any active plan"
            ) : subscriptionPlan.plan?.slug ? (
              <>
                You are currently on the
                <strong> {subscriptionPlan.plan?.name}</strong> plan.
              </>
            ) : null}
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
          {subscriptionPlan.isSubscribed &&
          !(subscriptionPlan.plan?.name === "Essential") ? (
            <Button type="submit">
              {isLoading ? (
                <Loader2 className="mr-4 h-4 w-4 animate-spin" />
              ) : null}
              Manage Subscription
            </Button>
          ) : (
            <Link href="/billing/pricing" className={buttonVariants()}>
              {isLoading ? (
                <Loader2 className="mr-4 h-4 w-4 animate-spin" />
              ) : null}
              Upgrade to PRO
            </Link>
          )}

          {subscriptionPlan.isSubscribed ? (
            <p className="rounded-full text-xs font-medium">
              {subscriptionPlan.isCanceled
                ? "Your plan will be canceled on "
                : "Your plan renews on "}
              {format(
                new Date(subscriptionPlan.stripeCurrentPeriodEnd),
                "dd MMM yyyy"
              )}
              .
            </p>
          ) : null}
        </CardFooter>
      </Card>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(67.56% 94.52%, 89.76% 80.39%, 100% 100%, 89.79% 70.05%, 83.47% 93.18%, 85.8% 68.75%, 88.44% 58.88%, 77.33% 94.5%, 90.14% 100%, 54.66% 89%, 72.21% 84.69%, 100% 59.15%, 21.05% 100%, 100% 0%, 0% 100%, 60.6% 0.1%, 0.7% 65.93%, 27.34% 0.1%, 0% 31.5%, 100% 44.4%, 5.85% 100%, 70.09% 70.65%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>{" "}
    </form>
  );
};
export default Manage;

export const getServerSideProps: GetServerSideProps = async (
  context
): Promise<GetServerSidePropsResult<ManageFormProps>> => {
  const userId = context.query.userId;

  const session = await getServerAuthSession(context);
  if (session?.user.id !== userId) return { props: { subscription: null } };

  const user = { id: String(userId) };

  const subscriptionPlan = await getUserSubscriptionPlan(user);

  return {
    props: {
      subscription: {
        isCanceled: subscriptionPlan.isCanceled,
        isSubscribed: subscriptionPlan.isSubscribed,
        stripeCurrentPeriodEnd:
          subscriptionPlan.stripeCurrentPeriodEnd?.toISOString() ?? "",
        plan: subscriptionPlan.plan,
        createdAt: subscriptionPlan.stripeCreatedAt?.toISOString() ?? "",
        updatedAt: subscriptionPlan.stripeUpdatedAt?.toISOString() ?? "",
      },
    },
  };
};
