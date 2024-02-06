import { prisma } from "../../db";
import { type Context } from "../trpc";

export const CHAT_LIMIT = 15;
export const FILES_LIMIT = 2;

export const chatLimit = async (userId: string) => {
  const chatCount = await prisma.chats.count({
    where: { userId },
  });

  console.log("freeTrial.helpers=>chatCount", chatCount);

  return chatCount <= CHAT_LIMIT;
};

export const fileLimit = async (ctx: Context) => {
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
  console.log("freeTrial.helpers=>fileCount", fileCount);

  return fileCount?._count.File <= FILES_LIMIT;
};
