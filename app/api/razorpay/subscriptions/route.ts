import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from "@/env";

export async function POST(req: Request) {
  const body = await req.json();
  const { planId } = body;

  const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID!,
    key_secret: RAZORPAY_KEY_SECRET!,
  });

  const subscriptions = await razorpay.subscriptions.create({
  plan_id: planId,
  total_count: 12, // 12 months
});

  return NextResponse.json(subscriptions);
}