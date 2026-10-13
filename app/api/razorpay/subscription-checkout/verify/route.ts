// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { RAZORPAY_KEY_SECRET } from "@/env";
import { db } from "@/src/db";
import {
  order,
  payment,
  paymentGatewaySubscription,
  subscriptions,
} from "@/src/db/schema";
import { requireUserWithRefresh } from "@/helper/user/action";
import { ORDER_STATUS } from "@/const/globalconst";

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
        localSubscriptionId: subscriptions.id,
        nextOrderDate: subscriptions.nextOrderDate,
        chargeDate: subscriptions.chargeDate,
        subscriptionType: subscriptions.subscriptionType,
        frequencyInDays: subscriptions.frequencyInDays,
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
          paymentStatus: "success",
          paymentMeta: {
            ...((subscriptionRow.paymentMeta as any) || {}),
            status: "success",
            checkoutVerifiedAt: new Date().toISOString(),
            razorpayOrderId: razorpay_order_id ?? null,
            razorpayPaymentId: razorpay_payment_id,
          },
        })
        .where(eq(payment.id, subscriptionRow.paymentId));

      if (subscriptionRow.orderId) {
        await db
          .update(order)
          .set({
            status: ORDER_STATUS.PAID,
            updatedAt: new Date(),
          })
          .where(eq(order.id, subscriptionRow.orderId));
      }

      const freqDays = Number(
        subscriptionRow.frequencyInDays ||
          (subscriptionRow.subscriptionType === "cycle_sync"
            ? 28
            : subscriptionRow.subscriptionType === "every_2_months"
              ? 60
              : 30),
      );
      const d1 = subscriptionRow.nextOrderDate
        ? new Date(subscriptionRow.nextOrderDate)
        : new Date(Date.now() + freqDays * 24 * 60 * 60 * 1000);
      const existingCharge = subscriptionRow.chargeDate
        ? new Date(subscriptionRow.chargeDate)
        : null;

      let nextCharge: Date;
      if (subscriptionRow.subscriptionType === "cycle_sync") {
        // First box (d1) is already paid today; Next Charge Date must be Box 2's charge date (5 days before Box 2's delivery date).
        if (existingCharge && !Number.isNaN(existingCharge.getTime()) && existingCharge > d1) {
          nextCharge = existingCharge;
        } else {
          nextCharge = new Date(d1);
          nextCharge.setDate(nextCharge.getDate() + freqDays - 5);
        }
      } else {
        nextCharge =
          existingCharge && !Number.isNaN(existingCharge.getTime())
            ? existingCharge
            : d1;
      }

      await db
        .update(subscriptions)
        .set({
          isActive: true,
          isPaused: false,
          chargeDate: nextCharge,
        })
        .where(eq(subscriptions.id, subscriptionRow.localSubscriptionId));
    }

    return NextResponse.json({
      success: true,
      orderId: subscriptionRow.orderId,
      paymentStatus: "success",
    });
  } catch (error) {
    console.error("Subscription checkout verification failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify subscription payment" },
      { status: 500 },
    );
  }
}
