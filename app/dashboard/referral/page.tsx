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

export const dynamic = "force-dynamic";

const page = async () => {
  const { email } = await requireUserWithRefresh();
  const [userDetail] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email));

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
            <ShareReferralClient userDetail={userDetail} />

            {/* SHARE BUTTONS */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Share Via</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button className="flex h-10 items-center gap-2 bg-green-500 text-white hover:bg-green-600">
                  {/* whatsapp icon manually */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.52 3.48A11.82 11.82 0 0 0 12.05 0C5.42 0 .05 5.37.05 12c0 2.11.55 4.17 1.6 5.98L0 24l6.2-1.62A11.9 11.9 0 0 0 12.05 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.2-3.53-8.52zM12.05 22c-1.9 0-3.75-.5-5.36-1.44l-.38-.22-3.68.96.98-3.6-.24-.37A9.9 9.9 0 0 1 2.05 12c0-5.52 4.48-10 10-10 2.67 0 5.18 1.04 7.07 2.93A9.93 9.93 0 0 1 22.05 12c0 5.52-4.48 10-10 10zm5.5-7.5c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.5-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.52s1.07 2.93 1.22 3.13c.15.2 2.1 3.2 5.1 4.48.71.3 1.27.48 1.7.61.71.23 1.35.2 1.86.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
                  </svg>
                  Whatsapp
                </Button>
              </div>
            </div>
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
