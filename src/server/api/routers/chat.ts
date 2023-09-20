import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const chatRouter = createTRPCRouter({
  getChats: protectedProcedure
    .input(z.object({ page: z.number().default(1) }))
    .query(async ({ input, ctx }) => {
      const chats = await ctx.prisma.chats.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        orderBy: {
          id: "desc",
        },
        skip: (input.page - 1) * 10,
        take: 10,
      });

      return chats.reverse();
    }),

  createChat: protectedProcedure
    .input(
      z.object({
        question: z.string(),
        response: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const chat = await ctx.prisma.chats.create({
        data: {
          question: input.question,
          response: input.response,
          userId: ctx.session.user.id,
        },
      });

      return chat;
    }),
});
