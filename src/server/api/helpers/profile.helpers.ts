import { type Prisma, type PrismaClient } from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";
import { type Session } from "next-auth";

export const getOrganizationId = async (ctx: {
  session: Session;
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
}): Promise<string> => {
  let organizationId = ctx.session.user.organizationId;
  if (!organizationId) {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });

    if (user?.organizationId) organizationId = user.organizationId;
    else {
      const organization = await ctx.prisma.organization.create({
        data: {
          users: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      organizationId = organization.id;
    }
  }
  return organizationId;
};
