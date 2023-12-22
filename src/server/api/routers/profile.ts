import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import nodemailer from "nodemailer";
import { env } from "process";
import { z } from "zod";
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

      const { email, password } = await createUser(input.email, organizationId);
      sendEmail(
        "Welcome to Chatify",
        "here is your username & password " + email + " " + password,
        input.email
      );
    }),
});

export const createUser = async (email: string, organizationId: string) => {
  const password = randomUUID();
  const hashedPassword = await hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      organizationId,
    },
  });

  return { email, password };
};

export const sendEmail = (
  subject: string,
  text: string,
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
    text,
  };

  mailer.sendMail(mailDetails, function (err) {
    if (err) {
      console.error("Error occurred while sending email");
    } else {
      console.info("Email sent successfully");
    }
  });
};
