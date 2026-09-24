import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from "@/env";
import { calculateMixBoxPricing, type MixBoxRecipe } from "@/lib/mixYourBox";

export async function POST(req: Request) {
  const body = await req.json();
  const { items } = body;

  const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID!,
    key_secret: RAZORPAY_KEY_SECRET!,
  });

  const plans = await Promise.all(
    items.map(async (item: any) => {
      if (!item.isTypeSubscription && !item.isSubscribed) return null;

      const frequencyInMonths =
        item.frequencyInMonths ??
        item.selectedPlan?.period ??
        (item.subscriptionType === "every_2_months" ? 2 : 1);

      const mixPricing = item.mixBoxRecipe
        ? calculateMixBoxPricing({
          recipe: item.mixBoxRecipe as MixBoxRecipe,
          setPrice: item.price,
          purchaseType: "subscription",
          subscriptionType: item.subscriptionType,
        })
        : null;
      const planAmount = mixPricing?.valid ? mixPricing.price : item.price;

      const plan = await razorpay.plans.create({
        period: "monthly",
        interval: frequencyInMonths, 
        item: {
          name: item.title,
          amount: Math.round(planAmount * 100), 
          currency: "INR",
        },
      });

      return {
        ...plan,
        productId: item.productId,
        productVariantId: item.productVariantId,
        frequencyType: item.subscriptionType,
        quantity: item.quantity,
      };
    })
  );

  // null values hata do (non-subscription items)
  const filteredPlans = plans.filter(Boolean);

  return NextResponse.json(filteredPlans);
}
