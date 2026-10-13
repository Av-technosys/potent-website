import RewardReferrelOverview from "@/app/components/common/reward&ReferrelOverview";
import RewardsReferrelHeader from "@/app/components/common/rewards&ReferrelHeader";
import RewardsHistory from "./rewardsHistory";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const cards = [
  {
    title: "Rewards Value",
    description: "100% Cash Credit (₹)",
  },
  {
    title: "Order Reward",
    description: "5% On Every Order",
  },
];

const page = () => {
  return (
    <div className="flex flex-col gap-6">
      <RewardsReferrelHeader
        tittle="Rewards & Security"
        description="Manage your rewards and account security"
      />
      <Suspense fallback={<div>Loading...</div>}>
        <RewardReferrelOverview
          tittle="Your Reward Balance"
          description="Available cash credit in rupees (₹)"
          cards={cards}
        />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <RewardsHistory />
      </Suspense>
    </div>
  );
};

export default page;
