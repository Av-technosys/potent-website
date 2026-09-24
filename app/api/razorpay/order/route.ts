import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from "@/env";
import { calculateCheckoutPricingForUser, createPendingCheckoutOrder } from "@/helper";
import { requireUserWithRefresh } from "@/helper/user/action";
import { db } from "@/src/db";
import { address } from "@/src/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json();
  const { couponCode, addressId } = body;
  const { userId } = await requireUserWithRefresh();
  const pricing = await calculateCheckoutPricingForUser({ userId, couponCode });

  if (!pricing.success || pricing.final <= 0) {
    return NextResponse.json(
      { error: pricing.message ?? "Unable to calculate checkout total" },
      { status: 400 },
    );
  }

  const [shippingAddress] = await db
    .select()
    .from(address)
    .where(and(eq(address.id, Number(addressId)), eq(address.userId, userId)))
    .limit(1);

  if (!shippingAddress) {
    return NextResponse.json(
      { error: "Please select a valid address" },
      { status: 400 },
    );
  }

  const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID!,
    key_secret: RAZORPAY_KEY_SECRET!,
  });

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(pricing.final * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const pendingOrder = await createPendingCheckoutOrder({
      userId,
      couponCode,
      address: shippingAddress,
      razorpayOrderId: order.id,
    });

    if (!pendingOrder.success) {
      return NextResponse.json(pendingOrder, { status: 400 });
    }

    return NextResponse.json({
      ...order,
      checkout: pricing,
      localOrderId: pendingOrder.orderId,
    });
  } catch (error: unknown) {
    console.error("Razorpay order creation failed:", error);
    const razorpayError = error as {
      error?: { description?: string };
      statusCode?: number;
    };

    return NextResponse.json(
      {
        error:
          razorpayError.error?.description ??
          "Razorpay order creation failed. Check Razorpay key id and secret.",
      },
      { status: razorpayError.statusCode ?? 500 },
    );
  }
}
