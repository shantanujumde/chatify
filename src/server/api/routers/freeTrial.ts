import { createTRPCRouter, protectedProcedure } from "../trpc";

export const freeTrialRouter = createTRPCRouter({
  createFreeTrail: protectedProcedure.mutation(async ({ ctx }) => {
    const user = ctx.session.user;
    await ctx.prisma.payment.upsert({
      create: {
        stripeCustomerId: "freeTrial",
        stripeSubscriptionId: "freeTrial",
        stripePriceId: "freeTrial",
        stripeCurrentPeriodEnd: "freeTrial",
        userId: user.id,
      },
      update: {
        stripeCustomerId: "freeTrial",
        stripeSubscriptionId: "freeTrial",
        stripePriceId: "freeTrial",
        stripeCurrentPeriodEnd: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ),
        userId: user.id,
      },
      where: {
        userId: user.id,
      },
    });
  }),
});
