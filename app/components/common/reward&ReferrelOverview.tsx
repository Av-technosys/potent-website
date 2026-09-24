import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireUserWithRefresh } from "@/helper/user/action";
import { eq } from "drizzle-orm";
import { Coins } from "lucide-react";

const RewardReferrelOverview = async ({ tittle, description, cards }: any) => {
  let details = {
    coint: 0,
    id: "",
  };

  const { email } = await requireUserWithRefresh();
  if (tittle == "Your Reward Balance") {
    const [rewardCoins] = await db
      .select({ id: users.id, rewardOrderCoins: users.rewardOrderCoins })
      .from(users)
      .where(eq(users.email, email));
    details.coint = rewardCoins?.rewardOrderCoins || 0;
    details.id = rewardCoins?.id || "";
  } else {
    const [rewardCoins] = await db
      .select({ id: users.id, referralCoins: users.referralCoins })
      .from(users)
      .where(eq(users.email, email));
    details.coint = rewardCoins?.referralCoins || 0;
    details.id = rewardCoins?.id || "";
  }

  return (
    <>
      <div className="w-full overflow-hidden rounded-2xl border-0 shadow-md">
        <div className="p-0">
          <div className="flex flex-col gap-6 bg-linear-to-r from-[#1f8a9e] to-[#9ccbd3] p-6 sm:p-8">
            {/* TOP SECTION */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/80">{tittle}</p>
                <h2 className="mt-1 text-4xl font-bold text-white sm:text-5xl">
                  {details.coint}
                </h2>
                <p className="mt-1 text-sm text-white/80">{description}</p>
              </div>

              {/* ICON */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 sm:h-14 sm:w-14">
                <Coins className="h-6 w-6 text-white sm:h-7 sm:w-7" />
              </div>
            </div>

            {/* BOTTOM SECTION */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* PER PURCHASE */}
              {cards &&
                cards.map((item: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className="rounded-xl bg-white/20 p-4 backdrop-blur-md"
                    >
                      <p className="text-sm text-white/80">{item.title}</p>
                      <p className="mt-1 font-semibold text-white">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RewardReferrelOverview;
