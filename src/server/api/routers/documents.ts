import { z } from "zod";
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
