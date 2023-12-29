import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import nodemailer from "nodemailer";
import { env } from "process";
import { z } from "zod";
import { inviteUser } from "../helpers/auth.helpers";
import { getOrganizationId } from "../helpers/profile.helpers";

export const profileRouter = createTRPCRouter({
  getUserProfile: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: input.id,
        },
      });

      const organizationId = await getOrganizationId(ctx);

      const [organization, documentsCount, chatsCount] =
        await ctx.prisma.$transaction([
          ctx.prisma.organization.findFirst({
            where: {
              id: organizationId,
            },
            select: {
              name: true,
              users: true,
            },
          }),

          ctx.prisma.file.count({
            where: { deleted: false, organizationId },
          }),
          ctx.prisma.chats.count({ where: { userId: ctx.session.user.id } }),
        ]);

      return { user, organization, documentsCount, chatsCount };
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

  inviteUser: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      const organizationId = await getOrganizationId(ctx);

      const user = await ctx.prisma.user.upsert({
        update: {
          email: input.email,
          organizationId,
        },
        where: {
          email: input.email,
        },
        create: {
          email: input.email,
          organizationId,
        },
      });

      console.info("invited the user by InviteUser functionality", user);

      sendEmail(
        "You are invited to Chatify",
        inviteUser({ url: "http://localhost:3000/auth/login", user }),
        input.email
      );
    }),
});

export const sendEmail = (
  subject: string,
  html: string,
  emailTo: string,
  emailFrom = "noreply@chatify.com"
) => {
  const mailer = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });

  const mailDetails = {
    from: emailFrom,
    to: emailTo,
    subject,
    html,
  };

  mailer.sendMail(mailDetails, function (err) {
    if (err) {
      console.error("Error occurred while sending email");
    } else {
      console.info("Email sent successfully");
    }
  });
};
