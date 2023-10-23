import { z } from "zod";

export const PLANS: Plans[] = [
  {
    name: "Free",
    slug: "TIER-I",
    characters: 300,
    price: {
      amount: 0,
      priceId: process.env.STRIPE_TIER_I ?? "",
    },
  },
  {
    name: "Individual",
    slug: "TIER-II",
    characters: 3000,
    price: {
      amount: 30,
      priceId: process.env.STRIPE_TIER_II ?? "",
    },
  },
  {
    name: "Company",
    slug: "TIER-III",
    characters: 30000,
    price: {
      amount: 50,
      priceId: process.env.STRIPE_TIER_III ?? "",
    },
  },
];

export type Plans = {
  name: string;
  slug: TiersType;
  characters: number;
  price: {
    amount: number;
    priceId: string;
  };
};

export const Tiers = z.enum(["TIER-I", "TIER-II", "TIER-III"]);
export type TiersType = z.infer<typeof Tiers>;
