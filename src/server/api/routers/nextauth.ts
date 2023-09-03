import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { hash } from "bcrypt";
import { z } from "zod";

export const nextAuthRouter = createTRPCRouter({
  registerUser: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const hashedPassword = await hash(input.password, 10);
      const user = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
        },
      });
      return user;
    }),
});
