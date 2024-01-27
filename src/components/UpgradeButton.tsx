"use client";

import { type TiersType } from "@/config/stripe";
import { api } from "@/utils/api";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";

const UpgradeButton = ({ tier }: { tier: TiersType }) => {
  const session = useSession();

  const { mutate: createStripeSession, isLoading: stripeLoading } =
    api.payments.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        window.location.href =
          url ?? "/billing/manage/" + session.data?.user.id;
      },
    });

  if (tier === "TIER-III")
    return (
      <Button className="w-full">
        Contact us <ArrowRight className="ml-1.5 h-5 w-5" />
      </Button>
    );

  return (
    <Button
      onClick={() => createStripeSession({ tier })}
      loading={stripeLoading}
      className="w-full"
    >
      Upgrade now <ArrowRight className="ml-1.5 h-5 w-5" />
    </Button>
  );
};

export default UpgradeButton;
