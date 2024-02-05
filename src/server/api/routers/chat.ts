import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const chatRouter = createTRPCRouter({
  getChats: protectedProcedure
    .input(z.object({ page: z.number().default(1) }))
    .query(async ({ input, ctx }) => {
      const [chatLength, chats] = await ctx.prisma.$transaction([
        ctx.prisma.chats.count({
          where: {
            userId: ctx.session.user.id,
          },
        }),

        ctx.prisma.chats.findMany({
          where: {
            userId: ctx.session.user.id,
          },
          orderBy: {
            id: "desc",
          },
          skip: (input.page - 1) * 10,
          take: 10,
        }),
      ]);
      return {
        chatLength: Math.ceil(chatLength / 10),
        chats: chats.reverse(),
      };
    }),
});
