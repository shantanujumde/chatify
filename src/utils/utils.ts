import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BRAND_NAME = "Onboard Owl";

export const CONTACT_US_EMAIL = "contact@onboardowl.com";

export const FROM_EMAIL = "noreply@onboardowl.com";
