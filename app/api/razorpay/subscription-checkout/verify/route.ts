// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { RAZORPAY_KEY_SECRET } from "@/env";
import { db } from "@/src/db";
import {
  payment,
  paymentGatewaySubscription,
  subscriptions,
} from "@/src/db/schema";
import { requireUserWithRefresh } from "@/helper/user/action";

function signaturesMatch(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);

  return (
    expectedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

export async function POST(req: Request) {
  try {
    const { userId } = await requireUserWithRefresh();
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_order_id,
      razorpay_signature,
    } = await req.json();

    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing Razorpay subscription payment fields" },
        { status: 400 },
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest("hex");

    if (!signaturesMatch(generatedSignature, razorpay_signature)) {
      return NextResponse.json(
        { success: false, error: "Payment verification failed" },
        { status: 400 },
      );
    }

    const [subscriptionRow] = await db
      .select({
        paymentId: payment.id,
        orderId: payment.orderId,
        paymentStatus: payment.paymentStatus,
        paymentMeta: payment.paymentMeta,
      })
      .from(paymentGatewaySubscription)
      .innerJoin(
        subscriptions,
        eq(paymentGatewaySubscription.subscriptionId, subscriptions.id),
      )
      .innerJoin(
        payment,
        eq(payment.gatewayTransactionId, paymentGatewaySubscription.gatewaySubscriptionId),
      )
      .where(
        and(
          eq(paymentGatewaySubscription.gatewaySubscriptionId, razorpay_subscription_id),
          eq(paymentGatewaySubscription.userId, userId),
        ),
      )
      .limit(1);

    if (!subscriptionRow) {
      return NextResponse.json(
        { success: false, error: "Pending subscription order not found" },
        { status: 404 },
      );
    }

    if (subscriptionRow.paymentStatus !== "success") {
      await db
        .update(payment)
        .set({
          gatewayOrderId: razorpay_order_id ?? null,
          gatewayPaymentId: razorpay_payment_id,
          paymentMeta: {
            ...((subscriptionRow.paymentMeta as any) || {}),
            checkoutVerifiedAt: new Date().toISOString(),
            razorpayOrderId: razorpay_order_id ?? null,
            razorpayPaymentId: razorpay_payment_id,
          },
        })
        .where(eq(payment.id, subscriptionRow.paymentId));
    }

    return NextResponse.json({
      success: true,
      orderId: subscriptionRow.orderId,
      paymentStatus: subscriptionRow.paymentStatus ?? "pending",
    });
  } catch (error) {
    console.error("Subscription checkout verification failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify subscription payment" },
      { status: 500 },
    );
  }
}
