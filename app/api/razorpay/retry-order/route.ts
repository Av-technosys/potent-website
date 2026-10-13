import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from "@/env";
import { requireUserWithRefresh } from "@/helper/user/action";
import { db } from "@/src/db";
import { order, payment } from "@/src/db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId } = body;
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 },
      );
    }

    const { userId } = await requireUserWithRefresh();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [existingOrder] = await db
      .select()
      .from(order)
      .where(and(eq(order.id, orderId), eq(order.userId, userId)))
      .limit(1);

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (existingOrder.status !== "pending") {
      return NextResponse.json(
        { error: "This order is not eligible for payment completion" },
        { status: 400 },
      );
    }

    const [existingPayment] = await db
      .select()
      .from(payment)
      .where(and(eq(payment.orderId, orderId), eq(payment.userId, userId)))
      .orderBy(desc(payment.createdAt))
      .limit(1);

    if (existingPayment?.paymentStatus === "success") {
      return NextResponse.json(
        { error: "This order has already been paid" },
        { status: 400 },
      );
    }

    const safeAmount = Math.round(Number(existingOrder.totalAmount || 0));
    if (safeAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid order amount" },
        { status: 400 },
      );
    }

    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID!,
      key_secret: RAZORPAY_KEY_SECRET!,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: safeAmount * 100,
      currency: "INR",
      receipt: `paynow_${orderId.slice(0, 8)}_${Date.now()}`,
    });

    if (existingPayment) {
      await db
        .update(payment)
        .set({
          gatewayOrderId: razorpayOrder.id,
          amount: safeAmount,
          paymentStatus: "pending",
        })
        .where(eq(payment.id, existingPayment.id));
    } else {
      await db.insert(payment).values({
        orderId,
        userId,
        gatewayOrderId: razorpayOrder.id,
        paymentStatus: "pending",
        modeOfPayment: "razorpay",
        amount: safeAmount,
      });
    }

    return NextResponse.json({
      success: true,
      orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: safeAmount * 100,
      currency: "INR",
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error("Retry order error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to initiate payment" },
      { status: 500 },
    );
  }
}
