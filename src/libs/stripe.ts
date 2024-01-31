import { PLANS } from "@/config/stripe";
import { prisma } from "@/server/db";
import type { User } from "next-auth";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2023-10-16",
  typescript: true,
});

export async function getUserSubscriptionPlan(user: Partial<User>) {
  if (!user.id) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
    };
  }

  const dbUser = await prisma.user.findFirst({
    where: {
      id: user.id,
    },
    include: {
      Payment: true,
    },
  });

  if (!dbUser) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
    };
  }

  const isSubscribed = Boolean(
    dbUser.Payment?.stripePriceId &&
      dbUser.Payment.stripeCurrentPeriodEnd && // 86400000 = 1 day
      dbUser.Payment.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
  );

  const plan = isSubscribed
    ? PLANS.find((plan) => plan.price.priceId === dbUser.Payment?.stripePriceId)
    : null;

  let isCanceled = false;
  if (isSubscribed && dbUser.Payment?.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      dbUser.Payment.stripeSubscriptionId
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }

  return {
    plan,
    stripeSubscriptionId: dbUser.Payment?.stripeSubscriptionId,
    stripeCurrentPeriodEnd: dbUser.Payment?.stripeCurrentPeriodEnd,
    stripeCustomerId: dbUser.Payment?.stripeCustomerId,
    isSubscribed,
    isCanceled,
  };
}
