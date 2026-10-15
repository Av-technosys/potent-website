// helper/user/profile.ts
"use server"
import { db } from "@/src/db";
import { order, users, payment } from "@/src/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { requireUserWithRefresh } from "@/helper/user/action";

import { syncAndGetUserRewards } from "@/lib/rewards";

export async function getUserProfile() {
  const { email } = await requireUserWithRefresh();

  if (!email) throw new Error("UNAUTHORIZED");

  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!userResult.length) throw new Error("USER_NOT_FOUND");

  const user = userResult[0];

  const [userOrders, rewards] = await Promise.all([
    db
      .select()
      .from(order)
      .where(eq(order.userId, user.id))
      .orderBy(desc(order.createdAt)),
    syncAndGetUserRewards(user.id),
  ]);

  const orderIds = userOrders.map((o) => o.id);
  const paymentRows = orderIds.length
    ? await db
        .select()
        .from(payment)
        .where(inArray(payment.orderId, orderIds))
        .orderBy(desc(payment.createdAt))
    : [];

  const paymentMap = new Map<string, (typeof paymentRows)[0]>();
  for (const p of paymentRows) {
    if (p.orderId && !paymentMap.has(p.orderId)) {
      paymentMap.set(p.orderId, p);
    }
  }

  // Count and sum ONLY paid orders that were not cancelled or failed
  const validPaidOrders = userOrders.filter((o) => {
    const status = String(o.status || "").toLowerCase();
    if (
      status === "cancelled" ||
      status === "canceled" ||
      status === "failed" ||
      status === "returned"
    ) {
      return false;
    }
    const pay = paymentMap.get(o.id);
    const paymentStatus = String(pay?.paymentStatus || "").toLowerCase();

    // If order status is pending, consider it paid only if gateway/payment succeeded
    if (status === "pending") {
      return paymentStatus === "success";
    }

    // Statuses like paid, processing, shipped, delivered, completed are valid paid orders unless payment failed
    if (
      ["paid", "processing", "packed", "shipped", "delivered", "completed"].includes(
        status,
      )
    ) {
      return paymentStatus !== "failed";
    }

    return paymentStatus === "success";
  });

  const totalOrders = validPaidOrders.length;

  const totalSpent = validPaidOrders.reduce(
    (sum, o) => sum + Number(o.totalAmount || 0),
    0,
  );

  return {
    user: {
      fullName: user.name,
      email: user.email,
      phone: user.phone,
    },
    stats: {
      totalOrders,
      totalSpent,
      rewardBalance: rewards.balance,
    },
    orders: userOrders.slice(0, 5).map((o) => ({
      ...o,
      paymentStatus: paymentMap.get(o.id)?.paymentStatus || "pending",
    })),
  };
}
export async function updateUserProfile(fullName: string, phone: string) {
  if (!fullName || !phone) throw new Error("INVALID_INPUT");

  const { email } = await requireUserWithRefresh();

  if (!email) throw new Error("UNAUTHORIZED");

  const updated = await db
    .update(users)
    .set({
      name: fullName,
      phone,
    })
    .where(eq(users.email, email))
    .returning();

  if (!updated.length) throw new Error("USER_NOT_FOUND");

  const user = updated[0];

  return {
    fullName: user.name,
    email: user.email,
    phone: user.phone,
  };
}