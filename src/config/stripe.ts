import { z } from "zod";

export const PLANS: Plans[] = [
  {
    name: "Essential",
    slug: "TIER-I",
    price: {
      amount: 0,
      priceId: process.env.STRIPE_TIER_I ?? "",
    },
  },
  {
    name: "Business",
    slug: "TIER-II",
    price: {
      amount: 30,
      priceId: process.env.STRIPE_TIER_II ?? "",
    },
  },
  {
    name: "Enterprise",
    slug: "TIER-III",
    price: {
      amount: "Custom",
      priceId: process.env.STRIPE_TIER_III ?? "",
    },
  },
];

export type Plans = {
  name: z.infer<typeof PlanNames>;
  slug: TiersType;
  price: {
    amount: number | "Custom";
    priceId: string;
  };
};

export const Tiers = z.enum(["TIER-I", "TIER-II", "TIER-III"]);
export const PlanNames = z.enum(["Essential", "Business", "Enterprise"]);
export type TiersType = z.infer<typeof Tiers>;
