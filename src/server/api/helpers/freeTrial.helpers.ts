import { prisma } from "../../db";
import { type Context } from "../trpc";
import { getOrganizationId } from "./profile.helpers";

export const CHAT_LIMIT = 100;
export const FILES_LIMIT = 2;
export const FREE_TRIAL = "FREE_TRIAL";

export const chatLimit = async (userId: string) => {
  const chatCount = await prisma.chats.count({
    where: { userId },
  });

  return chatCount <= CHAT_LIMIT;
};

export const fileLimit = async (ctx: Context) => {
  const organizationId = await getOrganizationId(ctx);

  const fileCount = await ctx.prisma.organization.findFirst({
    where: {
      id: organizationId,
    },
    include: {
      _count: {
        select: {
          file: true,
        },
      },
    },
  });

  if (!fileCount?._count) return false;

  return fileCount?._count.file <= FILES_LIMIT;
};
