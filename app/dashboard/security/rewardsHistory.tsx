import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireUserWithRefresh } from "@/helper/user/action";
import {
  describeRewardHistoryRow,
  getUserBirthday,
  syncAndGetUserRewards,
} from "@/lib/rewards";
import { eq } from "drizzle-orm";
import {
  Cake,
  Gift,
  RotateCcw,
  ShoppingCart,
  Star,
  UserPlus,
  Wallet,
} from "lucide-react";
import BirthdayRewardCard from "./BirthdayRewardCard";

export default async function RewardsHistory() {
  const { email } = await requireUserWithRefresh();

  const [userInfo] = await db
    .select({ userId: users.id })
    .from(users)
    .where(eq(users.email, email));

  const [{ history: rewardHistoryRes }, currentBirthday] = await Promise.all([
    syncAndGetUserRewards(userInfo.userId),
    getUserBirthday(userInfo.userId),
  ]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "signup":
        return {
          icon: <Gift className="h-5 w-5" />,
          style: "bg-teal-100 text-teal-700",
        };
      case "referral":
        return {
          icon: <UserPlus className="h-5 w-5" />,
          style: "bg-purple-100 text-purple-700",
        };
      case "review":
        return {
          icon: <Star className="h-5 w-5" />,
          style: "bg-amber-100 text-amber-700",
        };
      case "birthday":
        return {
          icon: <Cake className="h-5 w-5" />,
          style: "bg-pink-100 text-pink-700",
        };
      case "cancelled":
        return {
          icon: <RotateCcw className="h-5 w-5" />,
          style: "bg-red-100 text-red-600",
        };
      case "redeem":
        return {
          icon: <Wallet className="h-5 w-5" />,
          style: "bg-blue-100 text-blue-700",
        };
      default:
        return {
          icon: <ShoppingCart className="h-5 w-5" />,
          style: "bg-emerald-100 text-emerald-700",
        };
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <BirthdayRewardCard initialBirthday={currentBirthday} />

      <Card className="w-full rounded-2xl shadow-sm">
        {/* HEADER */}
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Rewards History
          </CardTitle>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="space-y-4">
          {rewardHistoryRes && rewardHistoryRes.length > 0 ? (
            rewardHistoryRes.map((item, index) => {
              const details = describeRewardHistoryRow(item);
              const { icon, style } = getCategoryIcon(details.category);

              return (
                <div
                  key={item.id || index}
                  className="flex items-center justify-between gap-4 rounded-xl border p-4 transition hover:shadow-sm"
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    {/* ICON */}
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${style}`}
                    >
                      {icon}
                    </div>

                    {/* TEXT */}
                    <div>
                      <p className="font-semibold text-gray-800">
                        {details.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {details.subtitle}
                      </p>
                      {details.formattedDate && (
                        <p className="mt-1 text-xs text-gray-400">
                          {details.formattedDate}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div
                    className={`text-sm font-bold whitespace-nowrap sm:text-base ${
                      details.isPositive ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {details.formattedAmount}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">No rewards history found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
