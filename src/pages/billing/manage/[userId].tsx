import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { getUserSubscriptionPlan } from "@/libs/stripe";
import { api } from "@/utils/api";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { type GetServerSideProps } from "next";
import { useRouter } from "next/router";

interface ManageFormProps {
  subscription: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

const Manage = (props: ManageFormProps | null) => {
  const { toast } = useToast();
  const router = useRouter();
  if (props === null) return router.back();

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

  if (!subscriptionPlan) return <>something went wrong</>;

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
            You are currently on the{" "}
            <strong>{subscriptionPlan?.isCanceled}</strong> plan.
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
          <Button type="submit">
            {isLoading ? (
              <Loader2 className="mr-4 h-4 w-4 animate-spin" />
            ) : null}
            {subscriptionPlan.isSubscribed
              ? "Manage Subscription"
              : "Upgrade to PRO"}
          </Button>

          {subscriptionPlan.isSubscribed ? (
            <p className="rounded-full text-xs font-medium">
              {subscriptionPlan.isCanceled
                ? "Your plan will be canceled on "
                : "Your plan renews on"}
              {format(
                new Date(subscriptionPlan.stripeCurrentPeriodEnd!),
                "dd.MM.yyyy"
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

export const getServerSideProps = (async (context) => {
  const userId = context.query.userId;

  const user = { id: String(userId) };

  const subscriptionPlan = await getUserSubscriptionPlan(user);

  return {
    props: {
      subscription: {
        ...subscriptionPlan,
        stripeCurrentPeriodEnd:
          subscriptionPlan.stripeCurrentPeriodEnd?.toISOString(),
      },
    },
  };
}) satisfies GetServerSideProps;
