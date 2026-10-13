import { db } from "@/db";
import { users } from "@/db/schema";
import { requireUserWithRefresh } from "@/helper/user/action";
import { syncAndGetUserRewards } from "@/lib/rewards";
import { eq } from "drizzle-orm";
import { IndianRupee } from "lucide-react";

const RewardReferrelOverview = async ({ tittle, description, cards }: any) => {
  const { email } = await requireUserWithRefresh();
  const [userRow] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const synced = userRow?.id
    ? await syncAndGetUserRewards(userRow.id)
    : { balance: 0, referralEarnings: 0 };

  const isRewardBalance = tittle === "Your Reward Balance";
  const displayRupees = isRewardBalance
    ? synced.balance
    : synced.referralEarnings;

  const overviewCards =
    cards && cards.length > 0
      ? cards
      : isRewardBalance
        ? [
            {
              title: "Rewards Value",
              description: "100% Cash Credit (₹)",
            },
            {
              title: "Order Reward",
              description: "5% On Every Order",
            },
          ]
        : [
            {
              title: "You Earn",
              description: "₹200 Per Friend",
            },
            {
              title: "Friend Gets",
              description: "₹100 On Joining",
            },
          ];

  return (
    <div className="w-full overflow-hidden rounded-2xl border-0 shadow-md">
      <div className="p-0">
        <div className="flex flex-col gap-6 bg-linear-to-r from-[#1f8a9e] to-[#9ccbd3] p-6 sm:p-8">
          {/* TOP SECTION */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white/85">{tittle}</p>
              <h2 className="mt-1 text-4xl font-bold text-white sm:text-5xl">
                ₹{Number(displayRupees || 0).toLocaleString("en-IN")}
              </h2>
              <p className="mt-1.5 text-sm font-medium text-white/90">
                {description || "Available cash credit to use at checkout"}
              </p>
            </div>

            {/* ICON */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 sm:h-14 sm:w-14">
              <IndianRupee className="h-6 w-6 text-white sm:h-7 sm:w-7" />
            </div>
          </div>

          {/* BOTTOM SECTION */}
          {overviewCards && overviewCards.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {overviewCards.map((item: any, index: number) => (
                <div
                  key={index}
                  className="rounded-xl bg-white/20 p-4 backdrop-blur-md"
                >
                  <p className="text-sm text-white/80">{item.title}</p>
                  <p className="mt-1 font-semibold text-white">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardReferrelOverview;
