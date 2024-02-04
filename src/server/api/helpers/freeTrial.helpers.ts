import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Session } from "next-auth";

export const CHAT_LIMIT = 100;
export const FILES_LIMIT = 2;

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
