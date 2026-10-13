import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireUserWithRefresh } from "@/helper/user/action";
import { formatRewardDate, syncAndGetUserRewards } from "@/lib/rewards";
import { eq } from "drizzle-orm";
import { Check } from "lucide-react";

const programTerms = [
  "Your friend must be a new customer to Potent Hygiene",
  "Minimum order value of ₹500 required for referral to be valid",
  "Maximum ₹500 referral credit can be used per order",
  "Referral credits are added in rupees (₹) to your Rewards Balance with no expiry date",
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
    (item) =>
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
            referralHistory.map((item, index) => (
              <div
                key={item.id || index}
                className="flex items-center justify-between gap-4 rounded-xl border p-4"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  {/* ICON */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>

                  {/* TEXT */}
                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.newUserName || "Referred Friend"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Referred on {formatRewardDate(item.createdAt)}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="font-bold whitespace-nowrap text-green-600">
                  +₹{Number(item.coins || 200).toLocaleString("en-IN")}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No referrals yet. Share your code above to earn ₹200 per friend!</p>
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
              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#C9E6EA]">
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
