import { Context } from "../trpc";

export const getOrganizationId = async (ctx: Context): Promise<string> => {
  let organizationId = ctx.session?.user.organizationId;
  if (!organizationId) {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session?.user.id,
      },
    });

    if (user?.organizationId) organizationId = user.organizationId;
    else {
      const organization = await ctx.prisma.organization.create({
        data: {
          users: {
            connect: {
              id: ctx.session?.user.id,
            },
          },
        },
      });
      organizationId = organization.id;
    }
  }
  return organizationId;
};
