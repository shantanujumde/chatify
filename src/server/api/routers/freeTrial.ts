import { createTRPCRouter, protectedProcedure } from "../trpc";

export const freeTrialRouter = createTRPCRouter({
  createFreeTrail: protectedProcedure.mutation(async ({ ctx }) => {
    const user = ctx.session.user;
    const dateAfterOneYear = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    );

    await ctx.prisma.payment.upsert({
      create: {
        stripeCustomerId: "freeTrial",
        stripeSubscriptionId: "freeTrial",
        stripePriceId: "freeTrial",
        stripeCurrentPeriodEnd: dateAfterOneYear,
        userId: user.id,
      },
      update: {
        stripeCustomerId: "freeTrial",
        stripeSubscriptionId: "freeTrial",
        stripePriceId: "freeTrial",
        stripeCurrentPeriodEnd: dateAfterOneYear,
        userId: user.id,
      },
      where: {
        userId: user.id,
      },
    });
  }),
});
