import { getUserSubscriptionPlan, stripe } from "@/libs/stripe";
import { getBaseUrl } from "@/utils/api";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const paymentsRouter = createTRPCRouter({
  createStripeSession: protectedProcedure.mutation(async ({ ctx }) => {
    const user = ctx.session.user;
    const billingUrl = getBaseUrl() + "/dashboard/billing";

    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

    const subscriptionPlan = await getUserSubscriptionPlan(user);

    if (subscriptionPlan.isSubscribed && subscriptionPlan.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: subscriptionPlan.stripeCustomerId,
        return_url: billingUrl,
      });
      return { url: stripeSession.url };
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      line_items: [
        {
          price: "", // @todo: add price id dynamically
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
      },
    });

    return { url: stripeSession.url };
  }),
});
