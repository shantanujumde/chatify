import { createTRPCRouter, protectedProcedure } from "../trpc";

export const documentsRouter = createTRPCRouter({
  getMyDocuments: protectedProcedure.query(async ({ ctx }) => {
    const files = await ctx.prisma.file.findMany({
      where: {
        userId: ctx.session.user.id,
        deleted: false,
      },
    });

    return files;
  }),
});
