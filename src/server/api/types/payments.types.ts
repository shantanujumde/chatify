import { z } from "zod";
import { PlanNames } from "../../../config/stripe";

export const PaymentTokenSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  image: z.string().nullable().optional(),
  id: z.string(),
  organizationId: z.string().nullable(),
  plan: z.object({
    cid: z.string(),
    sid: z.string(),
    plan: PlanNames,
    exp: z.string(),
    active: z.boolean(),
  }),
});
