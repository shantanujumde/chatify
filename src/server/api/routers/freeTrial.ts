import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Session } from "next-auth";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const CHAT_LIMIT = 100;
const FILES_LIMIT = 2;

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
        stripeCurrentPeriodEnd: "freeTrial",
        userId: user.id,
      },
      where: {
        userId: user.id,
      },
    });
  }),
});

export const chatLimit = async (ctx: {
  session: Session | null;
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
}) => {
  const chatCount = await ctx.prisma.chats.count({
    where: {
      userId: ctx.session?.user.id,
    },
  });

  return chatCount <= CHAT_LIMIT;
};

export const fileLimit = async (ctx: {
  session: Session | null;
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
}) => {
  const fileCount = await ctx.prisma.organization.findFirst({
    where: {
      id: ctx.session?.user.organizationId,
    },
    include: {
      _count: {
        select: {
          File: true,
        },
      },
    },
  });

  if (!fileCount?._count) return false;

  return fileCount?._count.File <= FILES_LIMIT;
};
