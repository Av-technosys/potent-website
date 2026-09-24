import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { referralCoinHistory, rewardCoinsHistory, users } from "@/db/schema";
import { requireUserWithRefresh } from "@/helper/user/action";
import { eq } from "drizzle-orm";
import { Check } from "lucide-react";

const programTerms = [
  "Your friend must be a new customer to Potent Hygiene",
  "Minimum order value of ₹500 required for referral to be valid",
  "Maximum ₹500 referral credit can be used per order",
  "Referral credits have no expiry date",
];
export async function ReferralHistory() {
  const { email } = await requireUserWithRefresh();
  const [userDetail] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email));
  const referralHistory = await db
    .select()
    .from(referralCoinHistory)
    .where(eq(referralCoinHistory.userId, userDetail?.id));

  return (
    <div className="w-full space-y-6">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {referralHistory && referralHistory.length >= 0 ? (
            referralHistory.map((item, index) => (
              <div
                key={index}
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
                    <p className="font-medium text-gray-800">
                      {item.newUserName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Referred on {item.createdAt?.toISOString()}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="font-semibold whitespace-nowrap text-green-600">
                  {item.coins}
                </div>
              </div>
            ))
          ) : (
            <p>No Referral History</p>
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
