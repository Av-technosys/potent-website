import RewardReferrelOverview from "@/app/components/common/reward&ReferrelOverview";
import RewardsReferrelHeader from "@/app/components/common/rewards&ReferrelHeader";
import RewardsHistory from "./rewardsHistory";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const cards = [
  {
    title: "Coin Value",
    description: "₹1 = 100 Coin",
  },
  // {
  //   title: "Per Referrel",
  //   description: "200 Coins",
  // },
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
          description="Coins"
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
