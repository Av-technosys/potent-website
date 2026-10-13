/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto";
import { NextResponse } from "next/server";
import { RAZORPAY_KEY_SECRET } from "@/env";
import { requireUserWithRefresh } from "@/helper/user/action";
import { db } from "@/src/db";
import { order, payment } from "@/src/db/schema";
import { and, eq } from "drizzle-orm";
import { ORDER_STATUS } from "@/const/globalconst";
import { syncAndGetUserRewards } from "@/lib/rewards";

function signaturesMatch(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);

  return (
    expectedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

export async function POST(req: Request) {
  const body = await req.json();
  const { userId } = await requireUserWithRefresh();
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json(
      { success: false, error: "Missing Razorpay payment fields" },
      { status: 400 },
    );
  }

  const generated_signature = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (!signaturesMatch(generated_signature, razorpay_signature)) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const [pendingPayment] = await db
    .select({
      id: payment.id,
      orderId: payment.orderId,
      paymentStatus: payment.paymentStatus,
      paymentMeta: payment.paymentMeta,
    })
    .from(payment)
    .where(
      and(
        eq(payment.gatewayOrderId, razorpay_order_id),
        eq(payment.userId, userId),
      ),
    )
    .limit(1);

  if (!pendingPayment?.orderId) {
    return NextResponse.json(
      { success: false, error: "Pending order not found" },
      { status: 404 },
    );
  }

  if (pendingPayment.paymentStatus !== "success") {
    await db
      .update(payment)
      .set({
        gatewayPaymentId: razorpay_payment_id,
        paymentStatus: "success",
        paymentMeta: {
          ...((pendingPayment.paymentMeta as any) || {}),
          status: "success",
          checkoutVerifiedAt: new Date().toISOString(),
          razorpayPaymentId: razorpay_payment_id,
          ...(body.isGift !== undefined
            ? {
                isGift: Boolean(body.isGift),
                giftNote:
                  body.isGift && body.giftNote
                    ? String(body.giftNote).trim().slice(0, 200)
                    : null,
              }
            : {}),
        },
      })
      .where(eq(payment.id, pendingPayment.id));

    await db
      .update(order)
      .set({
        status: ORDER_STATUS.PAID,
        updatedAt: new Date(),
      })
      .where(eq(order.id, pendingPayment.orderId));
  }

  await syncAndGetUserRewards(userId);

  return NextResponse.json({
    success: true,
    orderId: pendingPayment.orderId,
    paymentStatus: "success",
  });
}

