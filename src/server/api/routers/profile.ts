import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
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
    .mutation(async ({ input, ctx }) => {
      const currentUser = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
      });

      let organizationId: string;
      if (!currentUser?.organizationId) {
        const organization = await ctx.prisma.organization.create({
          data: {
            name: "",
          },
        });

        await ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            organizationId: organization.id,
          },
        });

        organizationId = organization.id;
      } else {
        organizationId = currentUser.organizationId;
      }

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
