import { PLANS } from "@/config/stripe";
import { getUserSubscriptionPlan, stripe } from "@/libs/stripe";
import { getBaseUrl } from "@/utils/api";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const paymentsRouter = createTRPCRouter({
  createStripeSession: protectedProcedure
    .input(z.object({ tier: z.enum(["TIER-I", "TIER-II", "TIER-III"]) }))
    .mutation(async ({ input, ctx }) => {
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
            price: PLANS.find((plan) => plan.slug === input.tier)?.price
              .priceId,
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
