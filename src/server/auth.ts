import { getUserSubscriptionPlan } from "@/libs/stripe";
import { prisma } from "@/server/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { Role, User } from "@prisma/client";
import { compare } from "bcrypt";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";

import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import { createTransport } from "nodemailer";
import { type z } from "zod";
import { type PlanNames } from "../config/stripe";
import { BRAND_NAME } from "../utils/utils";
import {
  inviteUserEmailHtml,
  signInLinkEmailHtml,
  text,
} from "./api/helpers/auth.helpers";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      organizationId: string;
      name: string;
      email: string;
      // ...other properties
      role: Role;
      plan: {
        cid: string | undefined;
        sid: string | undefined;
        plan: z.infer<typeof PlanNames>;
        exp: Date | null | undefined;
        active: string | boolean | undefined;
      };
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          organizationId: token.organizationId,
          plan: token.plan,
        },
      };
    },

    async jwt({ token, user }) {
      // called before session callback
      if (user) {
        const plan = await getUserSubscriptionPlan(user);

        token.id = user.id;
        token.organizationId = (user as User).organizationId;
        token.plan = {
          cid: plan.stripeCustomerId,
          sid: plan.stripeSubscriptionId,
          plan: plan.plan?.name,
          exp: plan.stripeCurrentPeriodEnd,
          active: plan.plan?.price.priceId && plan.isSubscribed,
        };
      }
      return token;
    },

    // async signIn({ user }) {}, // callback called after each signIn
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),

    EmailProvider({
      server: {
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
      from: "noreply@example.com",
      sendVerificationRequest: async (params) => {
        console.log(
          "auth=>",
          {
            clientId: process.env.DISCORD_CLIENT_ID ?? "",
            clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
          },
          {
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
          }
        );

        const { identifier, url, provider } = params;
        const { host } = new URL(url);
        // NOTE: You are not required to use `nodemailer`, use whatever you want.
        const transport = createTransport(provider.server as string);

        const user = await prisma.user.findUnique({
          where: {
            email: identifier,
          },
        });

        const urlToPricingPage = new URL(url);
        urlToPricingPage.searchParams.set(
          "callbackUrl",
          urlToPricingPage.origin + "/billing/pricing?newUser=true"
        );

        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Sign in to ${BRAND_NAME}`,
          text: text({ url, host }),
          html: user
            ? signInLinkEmailHtml({ url, user })
            : inviteUserEmailHtml({ url: urlToPricingPage.toString(), user }),
        });

        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
        }
      },
    }),

    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) return null;

        if (!user.password) return null;

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) return null;

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
