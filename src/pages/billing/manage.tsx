import { type getUserSubscriptionPlan } from "@/libs/stripe";

interface ManageFormProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

const Manage = ({ subscriptionPlan }: ManageFormProps) => {
  // const { toast } = useToast();

  // const { mutate: createStripeSession, isLoading } =
  //   api.payments.createStripeSession.useMutation({
  //     onSuccess: ({ url }) => {
  //       if (url) window.location.href = url;
  //       if (!url) {
  //         toast({
  //           title: "There was a problem...",
  //           description: "Please try again in a moment",
  //           variant: "destructive",
  //         });
  //       }
  //     },
  //   });
  return (
    // <form
    //   className="mt-12"
    //   onSubmit={(e) => {
    //     e.preventDefault();
    //     // createStripeSession();
    //   }}
    // >
    //   <Card>
    //     <CardHeader>
    //       <CardTitle>Subscription Plan</CardTitle>
    //       <CardDescription>
    //         You are currently on the{" "}
    //         <strong>{"subscriptionPlan.isCanceled"}</strong> plan.
    //       </CardDescription>
    //     </CardHeader>

    //     <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
    //       <Button type="submit">
    //         {isLoading ? (
    //           <Loader2 className="mr-4 h-4 w-4 animate-spin" />
    //         ) : null}
    //         {"subscriptionPlan.isSubscribed"
    //           ? "Manage Subscription"
    //           : "Upgrade to PRO"}
    //       </Button>

    //       {"subscriptionPlan.isSubscribed" ? (
    //         <p className="rounded-full text-xs font-medium">
    //           {"subscriptionPlan.isCanceled"
    //             ? "Your plan will be canceled on "
    //             : "Your plan renews on"}
    //           {format(new Date(), "dd.MM.yyyy")}.
    //         </p>
    //       ) : null}
    //     </CardFooter>
    //   </Card>
    // </form>
    <></>
  );
};
export default Manage;
