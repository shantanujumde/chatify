import { createTRPCRouter, protectedProcedure } from "../trpc";

export const documentsRouter = createTRPCRouter({
  getMyDocuments: protectedProcedure.query(async ({ ctx }) => {
    const text = await ctx.prisma.text.findMany({
      where: {
        userId: ctx.session.user.id,
        deleted: false,
      },
    });

    return text;
  }),
});
