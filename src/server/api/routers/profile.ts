import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const profileRouter = createTRPCRouter({
  getUserProfile: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.user.findFirst({
        where: {
          id: input.id,
        },
      });
    }),

  purchase: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        paymentDetails: z.object({
          price: z.number(),
          status: z.string(),
          planCategory: z.enum(["basic", "premium"]),
        }),
        premiumUser: z.boolean(),
        role: z.enum(["user", "admin"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const role = await ctx.prisma.rolesAndPaymentInfo.create({
        data: {
          ...input,
        },
      });

      return role;
    }),
});
