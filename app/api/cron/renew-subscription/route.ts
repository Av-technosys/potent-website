// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { and, eq, lte } from "drizzle-orm";
import { db } from "@/db";
import {
  payment,
  paymentGatewaySubscription,
  subscriptions,
} from "@/db/schema";
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from "@/env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID!,
  key_secret: RAZORPAY_KEY_SECRET!,
});

function isAuthorizedCron(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true;

  const authHeader = req.headers.get("authorization");
  const cronHeader = req.headers.get("x-cron-secret");

  return authHeader === `Bearer ${cronSecret}` || cronHeader === cronSecret;
}

function rupeesFromPaise(value?: number | null) {
  return Math.round(Number(value || 0) / 100);
}

async function fetchSubscriptionInvoices(gatewaySubscriptionId: string) {
  const params = new URLSearchParams({
    subscription_id: gatewaySubscriptionId,
    count: "100",
  });
  const auth = Buffer.from(
    `${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`,
  ).toString("base64");

  const response = await fetch(
    `https://api.razorpay.com/v1/invoices?${params.toString()}`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      cache: "no-store",
    },
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.description ?? "Failed to fetch Razorpay invoices",
    );
  }

  return Array.isArray(data.items) ? data.items : [];
}

async function storeUnpaidInvoice({
  subscription,
  gatewaySubscription,
  invoice,
}: {
  subscription: any;
  gatewaySubscription: any;
  invoice: any;
}) {
  if (!invoice.order_id) return { action: "ignored" };

  const [existingPayment] = await db
    .select({ id: payment.id })
    .from(payment)
    .where(
      and(
        eq(payment.gatewayOrderId, invoice.order_id),
        eq(payment.gatewayTransactionId, gatewaySubscription.gatewaySubscriptionId),
      ),
    )
    .limit(1);

  const amount = rupeesFromPaise(invoice.amount ?? invoice.amount_due);
  const paymentMeta = {
    invoice,
    subscriptionId: subscription.id,
    gatewaySubscriptionId: gatewaySubscription.gatewaySubscriptionId,
    syncedAt: new Date().toISOString(),
  };

  if (existingPayment) {
    await db
      .update(payment)
      .set({
        paymentStatus: invoice.status,
        amount,
        paymentMeta,
      })
      .where(eq(payment.id, existingPayment.id));

    return { action: "updated_unpaid_invoice" };
  }

  await db.insert(payment).values({
    userId: subscription.userId,
    gatewayOrderId: invoice.order_id,
    gatewayPaymentId: invoice.payment_id ?? null,
    gatewayTransactionId: gatewaySubscription.gatewaySubscriptionId,
    paymentStatus: invoice.status,
    modeOfPayment: "razorpay_subscription",
    amount,
    paymentMeta,
  });

  return { action: "stored_unpaid_invoice" };
}

async function syncSubscription(subscriptionRow: any) {
  const gatewaySubscription = subscriptionRow.gatewaySubscription;

  if (!gatewaySubscription?.gatewaySubscriptionId) {
    return {
      subscriptionId: subscriptionRow.subscription.id,
      action: "skipped",
      reason: "No Razorpay subscription id",
    };
  }

  const gatewaySub = await razorpay.subscriptions.fetch(
    gatewaySubscription.gatewaySubscriptionId,
  );

  if (["cancelled", "completed", "halted"].includes(gatewaySub.status)) {
    await db
      .update(subscriptions)
      .set({ isActive: false })
      .where(eq(subscriptions.id, subscriptionRow.subscription.id));
  }

  await db
    .update(paymentGatewaySubscription)
    .set({
      remainingCount:
        gatewaySub.remaining_count ?? gatewaySubscription.remainingCount,
      totalCount: gatewaySub.total_count ?? gatewaySubscription.totalCount,
    })
    .where(eq(paymentGatewaySubscription.id, gatewaySubscription.id));

  const invoices = await fetchSubscriptionInvoices(
    gatewaySubscription.gatewaySubscriptionId,
  );
  const dueInvoices = invoices
    .filter((invoice: any) => invoice.subscription_id === gatewaySub.id)
    .sort((a: any, b: any) => Number(a.paid_at || 0) - Number(b.paid_at || 0));

  const results = [];

  for (const invoice of dueInvoices) {
    if (invoice.status === "paid" && invoice.payment_id) {
      results.push({
        action: "skipped",
        reason: "Paid subscription invoices are processed by Razorpay webhook",
        paymentId: invoice.payment_id,
      });
      continue;
    }

    if (["issued", "partially_paid", "expired"].includes(invoice.status)) {
      results.push(
        await storeUnpaidInvoice({
          subscription: subscriptionRow.subscription,
          gatewaySubscription,
          invoice,
        }),
      );
    }
  }

  return {
    subscriptionId: subscriptionRow.subscription.id,
    gatewaySubscriptionId: gatewaySubscription.gatewaySubscriptionId,
    gatewayStatus: gatewaySub.status,
    actions: results,
  };
}

async function handler(req: Request) {
  if (!isAuthorizedCron(req)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized cron request" },
      { status: 401 },
    );
  }

  const today = new Date();
  const dueSubscriptions = await db
    .select({
      subscription: subscriptions,
      gatewaySubscription: paymentGatewaySubscription,
    })
    .from(subscriptions)
    .leftJoin(
      paymentGatewaySubscription,
      eq(paymentGatewaySubscription.subscriptionId, subscriptions.id),
    )
    .where(
      and(
        eq(subscriptions.isActive, true),
        lte(subscriptions.nextOrderDate, today),
      ),
    );

  const results = [];

  for (const subscriptionRow of dueSubscriptions) {
    try {
      results.push(await syncSubscription(subscriptionRow));
    } catch (error: any) {
      console.error("Subscription renewal sync failed:", error);
      results.push({
        subscriptionId: subscriptionRow.subscription.id,
        action: "error",
        message: error?.message ?? "Subscription renewal sync failed",
      });
    }
  }

  return NextResponse.json({
    success: true,
    checked: dueSubscriptions.length,
    results,
  });
}

export async function GET(req: Request) {
  return handler(req);
}

export async function POST(req: Request) {
  return handler(req);
}
