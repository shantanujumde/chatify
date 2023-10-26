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
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import type { GetServerSideProps, GetServerSidePropsResult } from "next";
import Link from "next/link";

type ManageFormProps =
  | {
      subscription: {
        isCanceled: boolean;
        isSubscribed: boolean;
        stripeCurrentPeriodEnd: string;
        plan: Plans | undefined | null;
      };
    }
  | {
      subscription: null;
    };

const Manage = (props: ManageFormProps) => {
  const { toast } = useToast();

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
      className="mt-12"
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
          {subscriptionPlan.isSubscribed ? (
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
    </form>
  );
};
export default Manage;

export const getServerSideProps: GetServerSideProps = async (
  context
): Promise<GetServerSidePropsResult<ManageFormProps>> => {
  const userId = context.query.userId;

  const session = await getServerAuthSession(context);
  console.log("session?.user.id !== userId", session?.user.id, userId);
  if (session?.user.id !== userId) return { props: { subscription: null } };

  const user = { id: String(userId) };

  const subscriptionPlan = await getUserSubscriptionPlan(user);
  console.log("plan", subscriptionPlan.plan);

  return {
    props: {
      subscription: {
        isCanceled: subscriptionPlan.isCanceled,
        isSubscribed: subscriptionPlan.isSubscribed,
        stripeCurrentPeriodEnd:
          subscriptionPlan.stripeCurrentPeriodEnd?.toISOString() ?? "",
        plan: subscriptionPlan.plan,
      },
    },
  };
};
