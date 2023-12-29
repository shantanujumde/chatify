import { z } from "zod";

export const UserMetadataInviteSchema = z.object({
  expired: z.boolean(),
  invitedBy: z.string(),
  invitedOn: z.string(),
  invitedToOrganization: z.string(),
});

export type UserMetadataInviteType = z.infer<typeof UserMetadataInviteSchema>;
