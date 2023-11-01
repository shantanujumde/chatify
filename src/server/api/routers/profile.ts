import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import nodemailer from "nodemailer";
import { env } from "process";
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

  sendEmail: protectedProcedure
    .input(z.object({ email: z.string() }))
    .mutation(({ input }) => {
      const mailer = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASS,
        },
      });

      const mailDetails = {
        from: "noreply@chatify.com",
        to: input.email,
        subject: "Test mail",
        text: "Node.js testing mail for GeeksforGeeks",
      };

      mailer.sendMail(mailDetails, function (err, data) {
        if (err) {
          console.log("Error Occurs");
        } else {
          console.log("Email sent successfully", data);
        }
      });
    }),
});
