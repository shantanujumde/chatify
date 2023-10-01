import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const documentsRouter = createTRPCRouter({
  getMyDocuments: protectedProcedure
    .input(z.object({ page: z.number().optional().default(1) }))
    .query(async ({ input, ctx }) => {
      const [pageLength, documents] = await ctx.prisma.$transaction([
        ctx.prisma.file.count({
          where: {
            userId: ctx.session.user.id,
            deleted: false,
          },
        }),
        ctx.prisma.file.findMany({
          where: {
            userId: ctx.session.user.id,
            deleted: false,
          },

          skip: (input.page - 1) * 10,
          take: 10,
        }),
      ]);
      return {
        pageLength,
        documents,
      };
    }),

  renameDocumentById: protectedProcedure
    .input(z.object({ id: z.number(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const file = await ctx.prisma.file.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });

      return file;
    }),

  deleteDocumentsById: protectedProcedure
    .input(z.array(z.number()))
    .mutation(async ({ ctx, input }) => {
      const files = await ctx.prisma.file.updateMany({
        where: {
          id: {
            in: input,
          },
        },
        data: {
          deleted: true,
        },
      });

      return files;
    }),
});
