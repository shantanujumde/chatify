import { getUuid } from "pdfjs-dist/types/src/shared/util";
import { FREE_TRIAL } from "../helpers/freeTrial.helpers";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const freeTrialRouter = createTRPCRouter({
  createFreeTrail: protectedProcedure.mutation(async ({ ctx }) => {
    const user = ctx.session.user;
    const dateAfterOneYear = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    );
    const freeTrialId = FREE_TRIAL + "_" + getUuid();

    await ctx.prisma.payment.upsert({
      create: {
        stripeCustomerId: freeTrialId,
        stripeSubscriptionId: freeTrialId,
        stripePriceId: freeTrialId,
        stripeCurrentPeriodEnd: dateAfterOneYear,
        userId: user.id,
      },
      update: {
        stripeCustomerId: freeTrialId,
        stripeSubscriptionId: freeTrialId,
        stripePriceId: freeTrialId,
        stripeCurrentPeriodEnd: dateAfterOneYear,
        userId: user.id,
      },
      where: {
        userId: user.id,
      },
    });
  }),
});
