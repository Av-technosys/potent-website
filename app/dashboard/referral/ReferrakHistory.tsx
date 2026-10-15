import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireUserWithRefresh } from "@/helper/user/action";
import { formatRewardDate, syncAndGetUserRewards } from "@/lib/rewards";
import { eq } from "drizzle-orm";
import { Check, Clock } from "lucide-react";

const programTerms = [
  "₹100 reward for you when your friend's first order is delivered",
  "₹100 off for your friend on their first order",
  "Your friend must be a new customer and their first order must be ₹399 or more",
  "Up to 5 referrals per person per month",
  "Credits are strictly for shopping on our site and cannot be taken out as cash or transferred",
];

export async function ReferralHistory() {
  const { email } = await requireUserWithRefresh();
  const [userDetail] = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(eq(users.email, email));

  const synced = userDetail?.id
    ? await syncAndGetUserRewards(userDetail.id)
    : { validReferrals: [] };

  const referralHistory = (synced.validReferrals || []).filter(
    (item: any) =>
      item.newUserId !== userDetail?.id &&
      (item.newUserName || "").trim().toLowerCase() !==
        (userDetail?.name || "").trim().toLowerCase(),
  );

  return (
    <div className="w-full space-y-6">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {referralHistory && referralHistory.length > 0 ? (
            referralHistory.map((item: any, index: number) => {
              const isCredited = item.isQualified === true || item.status === "credited";
              const isCapReached = item.status === "monthly_cap_reached";

              return (
                <div
                  key={item.id || index}
                  className="flex items-center justify-between gap-4 rounded-xl border p-4"
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    {/* ICON */}
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        isCredited ? "bg-green-100" : "bg-amber-100"
                      }`}
                    >
                      {isCredited ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-amber-600" />
                      )}
                    </div>

                    {/* TEXT */}
                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.newUserName || "Referred Friend"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Referred on {formatRewardDate(item.createdAt)}
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-gray-500">
                        {isCredited
                          ? "First order delivered (₹399+) • Credited to Rewards"
                          : isCapReached
                            ? "Monthly referral limit reached (max 5 per month)"
                            : "Pending: Awaiting friend's first delivered order (₹399+)"}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div
                    className={`font-bold whitespace-nowrap text-sm sm:text-base ${
                      isCredited ? "text-green-600" : "text-amber-600"
                    }`}
                  >
                    {isCredited
                      ? `+₹${Number(item.coins || 100).toLocaleString("en-IN")}`
                      : "Pending"}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">
              No referrals yet. Share your code above to earn ₹100 when your friend&apos;s first order of ₹399+ is delivered!
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Program Terms</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {programTerms.map((term, index) => (
            <div key={index} className="flex items-start gap-3">
              {/* ICON */}
              <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C9E6EA]">
                <Check className="h-4 w-4 text-teal-600" />
              </div>

              <p className="text-sm text-gray-700">{term}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
