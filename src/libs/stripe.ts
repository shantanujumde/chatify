import { PLANS } from "@/config/stripe";
import { prisma } from "@/server/db";
import type { User } from "next-auth";
import Stripe from "stripe";
import { FREE_TRIAL } from "../server/api/helpers/freeTrial.helpers";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2023-10-16",
  typescript: true,
});

export async function getUserSubscriptionPlan(user: Partial<User>) {
  if (!user.id) {
    return {
      plan: PLANS[0],
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
      payment: true,
    },
  });

  if (!dbUser) {
    return {
      plan: PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
    };
  }

  if (dbUser.payment?.stripeCustomerId?.includes(FREE_TRIAL)) {
    return {
      plan: PLANS[0],
      isSubscribed: true,
      stripeSubscriptionId: dbUser.payment?.stripeSubscriptionId,
      stripeCurrentPeriodEnd: dbUser.payment?.stripeCurrentPeriodEnd,
      stripeCustomerId: dbUser.payment?.stripeCustomerId,
      isCanceled: false,
      stripeCreatedAt: dbUser.payment?.createdAt,
      stripeUpdatedAt: dbUser.payment?.updatedAt,
    };
  }

  const isSubscribed = Boolean(
    dbUser.payment?.stripePriceId &&
      dbUser.payment.stripeCurrentPeriodEnd && // 86400000 = 1 day
      dbUser.payment.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
  );

  const plan = isSubscribed
    ? PLANS.find((plan) => plan.price.priceId === dbUser.payment?.stripePriceId)
    : null;

  let isCanceled = false;
  if (isSubscribed && dbUser.payment?.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      dbUser.payment.stripeSubscriptionId
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }

  return {
    plan,
    stripeSubscriptionId: dbUser.payment?.stripeSubscriptionId,
    stripeCurrentPeriodEnd: dbUser.payment?.stripeCurrentPeriodEnd,
    stripeCustomerId: dbUser.payment?.stripeCustomerId,
    isSubscribed,
    isCanceled,
    stripeCreatedAt: dbUser.payment?.createdAt,
    stripeUpdatedAt: dbUser.payment?.updatedAt,
  };
}
