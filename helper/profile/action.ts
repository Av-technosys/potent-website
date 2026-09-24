// helper/user/profile.ts
"use server"
import { db } from "@/src/db";
import { order, users } from "@/src/db/schema";
import { eq , desc} from "drizzle-orm";
import { requireUserWithRefresh } from "@/helper/user/action";

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

  const userOrders = await db
    .select()
    .from(order)
    .where(eq(order.userId, user.id)) 
    .orderBy(desc(order.createdAt))
    .limit(5);

  const totalOrders = userOrders.length;

  const totalSpent = userOrders.reduce(
    (sum, o) => sum + Number(o.totalAmount || 0),
    0
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
    },
    orders: userOrders,
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