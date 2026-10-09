import RewardReferrelOverview from "@/app/components/common/reward&ReferrelOverview";
import RewardsReferrelHeader from "@/app/components/common/rewards&ReferrelHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Share2, ShoppingCart } from "lucide-react";
import { ReferralHistory } from "./ReferrakHistory";
import { requireUserWithRefresh } from "@/helper/user/action";
import { users } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import ShareReferralClient from "./ShareReferralClient";
import { Suspense } from "react";

import { generateUniqueReferralCode } from "@/lib/referralCode";

export const dynamic = "force-dynamic";

const page = async () => {
  const { email } = await requireUserWithRefresh();
  const [userDetail] = await db
    .select({
      id: users.id,
      name: users.name,
      referralCode: users.referralCode,
    })
    .from(users)
    .where(eq(users.email, email));

  let activeReferralCode = userDetail?.referralCode;
  if (!activeReferralCode && userDetail?.id) {
    activeReferralCode = await generateUniqueReferralCode(db, userDetail.name);
    await db
      .update(users)
      .set({ referralCode: activeReferralCode, updatedAt: new Date() })
      .where(eq(users.id, userDetail.id));
  }

  const userDetailWithCode = {
    ...userDetail,
    referralCode: activeReferralCode,
  };

  return (
    <div className="flex flex-col gap-6">
      <RewardsReferrelHeader
        tittle="Referral Program"
        description="Manage your rewards and account security"
      />
      <RewardReferrelOverview
        tittle="Total Earnings"
        amount="1600"
        description="From successful referrals"
      />
      <div className="w-full space-y-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>How it Work</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
              {/* STEP 1 */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-100">
                  <Share2 className="text-red-500" />
                </div>
                <p className="font-medium">1. Share Your Code</p>
                <p className="text-sm text-gray-500">
                  Share your unique referral code or link with friends
                </p>
              </div>

              {/* STEP 2 */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-100">
                  <ShoppingCart className="text-yellow-600" />
                </div>
                <p className="font-medium">2. Friend Makes Purchase</p>
                <p className="text-sm text-gray-500">
                  They get ₹100 off on orders above ₹500
                </p>
              </div>

              {/* STEP 3 */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-teal-100">
                  <Gift className="text-teal-600" />
                </div>
                <p className="font-medium">3. You Both Earn</p>
                <p className="text-sm text-gray-500">
                  You get ₹200 credit for each successful referral
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Share Your Referral</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <ShareReferralClient userDetail={userDetailWithCode} />
          </CardContent>
        </Card>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <ReferralHistory />
      </Suspense>
    </div>
  );
};

export default page;
