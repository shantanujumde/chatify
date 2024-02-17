import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getBaseUrl } from "@/utils/api";
import { type User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import nodemailer from "nodemailer";
import { env } from "process";
import { z } from "zod";
import { inviteUserEmailHtml } from "../helpers/auth.helpers";
import { getOrganizationId } from "../helpers/profile.helpers";
import {
  UserMetadataInviteSchema,
  type UserMetadataInviteType,
} from "../types/profile.types";

export const profileRouter = createTRPCRouter({
  getUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { id: input.id },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              file: true,
              users: true,
              _count: { select: { file: true } },
            },
          },
          _count: { select: { chats: true } },
        },
      });

      return {
        user,
        organization: user?.organization,
        documentsCount: user?.organization?._count.file,
        chatsCount: user?._count.chats,
      };
    }),

  updateUser: protectedProcedure
    .input((input) => input as Partial<User>)
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          ...input,
          metaData: JSON.stringify(input.metaData),
        },
      });
      return user;
    }),

  getInviteUserMetadata: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });

    if (!user)
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

    const validationMetaData = UserMetadataInviteSchema.safeParse(
      user.metaData
    );

    if (validationMetaData.success) {
      const inviteeUser = await ctx.prisma.user.findUnique({
        where: {
          id: validationMetaData.data.invitedBy,
        },
        include: {
          organization: true,
        },
      });

      return {
        invitedBy: inviteeUser,
        invitedOn: validationMetaData.data.invitedOn,
        invitedToOrganization: validationMetaData.data.invitedToOrganization,
      };
    }
  }),

  inviteUser: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      const organizationId = await getOrganizationId(ctx);

      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
        include: { organization: true },
      });
      const websiteUrl = getBaseUrl();

      if (user) {
        if (user.organizationId) {
          const metaData: UserMetadataInviteType = {
            expired: false,
            invitedBy: ctx.session.user.id,
            invitedOn: new Date().toISOString(),
            invitedToOrganization: organizationId,
          };

          await ctx.prisma.user.update({
            where: { id: user.id },
            data: { metaData },
          });
          return sendEmail(
            "You are invited to Chatify",
            inviteUserEmailHtml({
              url: websiteUrl + "/auth/login",
              user,
              message: {
                title: "Warning",
                body: `Your email will be unlinked from the previous organization, please use different email (${
                  user.organizationId
                }, ${
                  user.organization?.name ?? "Organization name not available"
                }). Contact support for more information.`,
              },
            }),
            input.email
          );
        } else {
          await ctx.prisma.user.update({
            where: { id: user.id },
            data: { organizationId },
          });
        }
      } else {
        await ctx.prisma.organization.update({
          where: { id: organizationId },
          data: { users: { create: { email: input.email } } },
        });
      }

      console.info("invited the user by InviteUser functionality", user);

      sendEmail(
        "You are invited to Chatify",
        inviteUserEmailHtml({ url: websiteUrl + "/auth/login", user }),
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
