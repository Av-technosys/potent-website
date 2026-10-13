// helper/user/profile.ts
"use server"
import { db } from "@/src/db";
import { order, users } from "@/src/db/schema";
import { eq , desc} from "drizzle-orm";
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

  // Exclude unpaid (pending) and cancelled orders from user totals
  const paidOrders = userOrders.filter((o) =>
    ["paid", "processing", "shipped", "delivered", "completed"].includes(
      String(o.status || "").toLowerCase(),
    ),
  );

  const totalOrders = paidOrders.length;

  const totalSpent = paidOrders.reduce(
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
    orders: userOrders.slice(0, 5),
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