import { z } from "zod";
import { getOrganizationId } from "../helpers/profile.helpers";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const documentsRouter = createTRPCRouter({
  getMyDocuments: protectedProcedure
    .input(z.object({ page: z.number().optional().default(1) }))
    .query(async ({ input, ctx }) => {
      const organizationId = await getOrganizationId(ctx);
      const [pageLength, documents] = await ctx.prisma.$transaction([
        ctx.prisma.file.count({
          where: {
            organizationId,
            deleted: false,
          },
        }),
        ctx.prisma.file.findMany({
          where: {
            organizationId,
            deleted: false,
          },
          orderBy: {
            createdAt: "desc",
          },
          skip: (input.page - 1) * 10,
          take: 10,
          include: {
            _count: true,
          },
        }),
      ]);
      return {
        pageLength: Math.ceil(pageLength / 10),
        totalFiles: pageLength,
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
