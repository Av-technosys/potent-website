/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/src/db";
import {
  order,
  payment,
  product,
  referralCoinHistory,
  review,
  rewardCoinsHistory,
  subscriptions,
  users,
} from "@/src/db/schema";
import { desc, eq, inArray, sql } from "drizzle-orm";

export const SIGNUP_BONUS_RUPEES = 100;
export const REFERRAL_EARNING_RUPEES = 200;
export const REFERRAL_FRIEND_BONUS_RUPEES = 100;
export const REVIEW_REWARD_RUPEES = 50;
export const BIRTHDAY_REWARD_RUPEES = 100;
export const ORDER_REWARD_RATE = 0.05; // Strictly 5% cash credit in rupees
export const MAX_REWARD_REDEEM_PER_ORDER = 500;

// Backward compatibility aliases so cached/reloaded modules never throw ReferenceError
export const SIGNUP_BONUS_COINS = SIGNUP_BONUS_RUPEES;
export const REFERRAL_EARNING_COINS = REFERRAL_EARNING_RUPEES;
export const REFERRAL_FRIEND_BONUS_COINS = REFERRAL_FRIEND_BONUS_RUPEES;
export const REVIEW_REWARD_COINS = REVIEW_REWARD_RUPEES;
export const BIRTHDAY_REWARD_COINS = BIRTHDAY_REWARD_RUPEES;
export function coinsToRupees(coins: number): number {
  return Number(coins || 0);
}

export function calculateOrderRewardRupees(orderAmount: number): number {
  const numeric = Number(orderAmount || 0);
  if (numeric <= 0) return 0;
  return Math.max(1, Math.round(numeric * ORDER_REWARD_RATE));
}

export function formatRewardDate(dateInput?: Date | string | null): string {
  if (!dateInput) return "";
  const parsed = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

let birthdayColumnEnsured = false;

export async function ensureUserBirthdayColumn() {
  if (birthdayColumnEnsured) return;
  try {
    await db.execute(
      sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "birthday" varchar`,
    );
    birthdayColumnEnsured = true;
  } catch (err) {
    console.warn("Could not ensure birthday column on users:", err);
  }
}

export async function getUserBirthday(userId: string): Promise<string | null> {
  try {
    await ensureUserBirthdayColumn();
    const res: any = await db.execute(
      sql`SELECT "birthday" FROM "users" WHERE "id" = ${userId} LIMIT 1`,
    );
    const rows = Array.isArray(res) ? res : res?.rows ?? [];
    const raw = rows[0]?.birthday;
    return raw ? String(raw) : null;
  } catch {
    return null;
  }
}

export async function setUserBirthday(
  userId: string,
  birthday: string | null | undefined,
): Promise<{
  birthday: string | null;
  bonusAdded: boolean;
  alreadyLocked?: boolean;
  balance: number;
  coins?: number;
}> {
  const cleanBirthday = birthday ? String(birthday).trim() : "";
  await ensureUserBirthdayColumn();

  const existingBirthday = await getUserBirthday(userId);

  // Production rule: Date of Birth can only be set ONCE per user account.
  // If already set, do not allow changing it or claiming multiple times.
  if (existingBirthday) {
    const synced = await syncAndGetUserRewards(userId);
    return {
      birthday: existingBirthday,
      bonusAdded: false,
      alreadyLocked: true,
      balance: synced.balance,
      coins: synced.balance,
    };
  }

  if (!cleanBirthday) {
    const synced = await syncAndGetUserRewards(userId);
    return {
      birthday: null,
      bonusAdded: false,
      alreadyLocked: false,
      balance: synced.balance,
      coins: synced.balance,
    };
  }

  await db.execute(
    sql`UPDATE "users" SET "birthday" = ${cleanBirthday}, "updated_at" = NOW() WHERE "id" = ${userId}`,
  );

  const currentYear = new Date().getFullYear();
  const birthdayTypePrefix = `birthday_reward:${currentYear}`;
  const existingRows = await db
    .select()
    .from(rewardCoinsHistory)
    .where(eq(rewardCoinsHistory.userId, userId));

  const alreadyCredited = existingRows.some(
    (row) =>
      row.type === "birthday_reward" ||
      (row.type && row.type.startsWith("birthday_reward:")),
  );

  let bonusAdded = false;
  if (!alreadyCredited) {
    await db.insert(rewardCoinsHistory).values({
      userId,
      coins: BIRTHDAY_REWARD_RUPEES,
      type: `${birthdayTypePrefix}:${cleanBirthday}`,
    });
    bonusAdded = true;
  }

  const synced = await syncAndGetUserRewards(userId);
  return {
    birthday: cleanBirthday,
    bonusAdded,
    alreadyLocked: false,
    balance: synced.balance,
    coins: synced.balance,
  };
}

export async function syncAndGetUserRewards(userId: string) {
  const [userRow] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!userRow) {
    return {
      balance: 0,
      referralEarnings: 0,
      history: [],
      validReferrals: [],
    };
  }

  const [
    existingHistory,
    rawReferrals,
    userOrders,
    userReviews,
    userSubscriptions,
  ] = await Promise.all([
    db
      .select()
      .from(rewardCoinsHistory)
      .where(eq(rewardCoinsHistory.userId, userId))
      .orderBy(desc(rewardCoinsHistory.createdAt)),
    db
      .select()
      .from(referralCoinHistory)
      .where(eq(referralCoinHistory.userId, userId))
      .orderBy(desc(referralCoinHistory.createdAt)),
    db
      .select({
        order: order,
        payment: payment,
      })
      .from(order)
      .leftJoin(payment, eq(payment.orderId, order.id))
      .where(eq(order.userId, userId))
      .orderBy(desc(order.createdAt)),
    db
      .select({
        id: review.id,
        productId: review.productId,
        createdAt: review.createdAt,
        productName: product.name,
      })
      .from(review)
      .leftJoin(product, eq(review.productId, product.id))
      .where(eq(review.userId, userId)),
    db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId)),
  ]);

  // Identify all orders tied to cancelled or ended subscriptions
  const cancelledSubscriptionOrderIds = new Set<string>();
  for (const sub of userSubscriptions) {
    if (!sub.isActive || sub.endDate !== null) {
      if (sub.orderId) {
        cancelledSubscriptionOrderIds.add(sub.orderId);
      }
    }
  }

  // Self-heal: ensure order status reflects cancellation in the database
  for (const row of userOrders) {
    if (!row.order?.id) continue;
    if (cancelledSubscriptionOrderIds.has(row.order.id)) {
      const currentStatus = String(row.order.status || "").toLowerCase();
      if (currentStatus !== "canceled" && currentStatus !== "cancelled") {
        row.order.status = "cancelled";
        await db
          .update(order)
          .set({ status: "cancelled", updatedAt: new Date() })
          .where(eq(order.id, row.order.id));
      }
    }
  }

  let mutated = false;
  const rewardIdsToDelete = new Set<string>();

  // 1. Clean out self-referrals & duplicate referrals in referralCoinHistory
  const selfOrDupReferralIds: string[] = [];
  const validReferrals: typeof rawReferrals = [];
  const seenReferredKeys = new Set<string>();
  const normalizedUserName = (userRow.name || "").trim().toLowerCase();

  for (const refRow of rawReferrals) {
    const isSameId = Boolean(refRow.newUserId && refRow.newUserId === userId);
    const isSameName =
      !refRow.newUserId &&
      Boolean(
        normalizedUserName &&
          (refRow.newUserName || "").trim().toLowerCase() === normalizedUserName,
      );

    const dedupKey = refRow.newUserId
      ? `id:${refRow.newUserId}`
      : `name:${(refRow.newUserName || "").trim().toLowerCase()}:${refRow.createdAt ? new Date(refRow.createdAt).toISOString().slice(0, 10) : ""}`;

    if (isSameId || isSameName || seenReferredKeys.has(dedupKey)) {
      selfOrDupReferralIds.push(refRow.id);
    } else {
      seenReferredKeys.add(dedupKey);
      validReferrals.push(refRow);
    }
  }

  if (selfOrDupReferralIds.length > 0) {
    await db
      .delete(referralCoinHistory)
      .where(inArray(referralCoinHistory.id, selfOrDupReferralIds));
    mutated = true;
  }

  for (const refRow of validReferrals) {
    if (Number(refRow.coins) !== REFERRAL_EARNING_RUPEES) {
      await db
        .update(referralCoinHistory)
        .set({ coins: REFERRAL_EARNING_RUPEES })
        .where(eq(referralCoinHistory.id, refRow.id));
      refRow.coins = REFERRAL_EARNING_RUPEES;
      mutated = true;
    }
  }

  // 2. Deduplicate & validate existing rewardCoinsHistory rows
  // - At most 1 signup_bonus / welcome_bonus row
  // - At most 1 birthday_reward row per calendar year
  // - Referral bonus rows must strictly match validReferrals (1 row per refRow.id)
  // - Review reward rows must strictly match userReviews (1 row per review.id)
  let seenSignupBonus = false;
  const seenBirthdayYears = new Set<string>();
  const matchedReferralIds = new Set<string>();
  const validReferralMap = new Map(validReferrals.map((r) => [r.id, r]));
  const validReviewMap = new Map(userReviews.map((r) => [r.id, r]));
  const matchedReviewIds = new Set<string>();

  // Walk oldest-first so we keep the original row and delete newer duplicates
  const chronologicalHistory = [...existingHistory].reverse();

  for (const h of chronologicalHistory) {
    const rawType = String(h.type || "").trim();

    if (rawType === "signup_bonus" || rawType === "welcome_bonus") {
      if (seenSignupBonus) {
        rewardIdsToDelete.add(h.id);
      } else {
        seenSignupBonus = true;
        if (Number(h.coins) !== SIGNUP_BONUS_RUPEES) {
          await db
            .update(rewardCoinsHistory)
            .set({ coins: SIGNUP_BONUS_RUPEES })
            .where(eq(rewardCoinsHistory.id, h.id));
          h.coins = SIGNUP_BONUS_RUPEES;
          mutated = true;
        }
      }
      continue;
    }

    if (rawType === "birthday_reward" || rawType.startsWith("birthday_reward:")) {
      const parts = rawType.split(":");
      const yearKey = parts[1] && /^\d{4}$/.test(parts[1]) ? parts[1] : String(new Date(h.createdAt ?? Date.now()).getFullYear());
      if (seenBirthdayYears.has(yearKey)) {
        rewardIdsToDelete.add(h.id);
      } else {
        seenBirthdayYears.add(yearKey);
        if (Number(h.coins) !== BIRTHDAY_REWARD_RUPEES) {
          await db
            .update(rewardCoinsHistory)
            .set({ coins: BIRTHDAY_REWARD_RUPEES })
            .where(eq(rewardCoinsHistory.id, h.id));
          h.coins = BIRTHDAY_REWARD_RUPEES;
          mutated = true;
        }
      }
      continue;
    }

    if (rawType === "referral" || rawType.startsWith("referral_bonus:")) {
      const parts = rawType.split(":");
      const refId = parts[1] || "";
      if (refId && validReferralMap.has(refId) && !matchedReferralIds.has(refId)) {
        matchedReferralIds.add(refId);
        if (Number(h.coins) !== REFERRAL_EARNING_RUPEES) {
          await db
            .update(rewardCoinsHistory)
            .set({ coins: REFERRAL_EARNING_RUPEES })
            .where(eq(rewardCoinsHistory.id, h.id));
          h.coins = REFERRAL_EARNING_RUPEES;
          mutated = true;
        }
      } else {
        // Duplicate or invalid referral bonus row — remove it!
        rewardIdsToDelete.add(h.id);
      }
      continue;
    }

    if (rawType === "review_reward" || rawType.startsWith("review_reward:")) {
      const parts = rawType.split(":");
      const revId = parts[1] || "";
      if (revId && validReviewMap.has(revId) && !matchedReviewIds.has(revId)) {
        matchedReviewIds.add(revId);
        if (Number(h.coins) !== REVIEW_REWARD_RUPEES) {
          await db
            .update(rewardCoinsHistory)
            .set({ coins: REVIEW_REWARD_RUPEES })
            .where(eq(rewardCoinsHistory.id, h.id));
          h.coins = REVIEW_REWARD_RUPEES;
          mutated = true;
        }
      } else {
        rewardIdsToDelete.add(h.id);
      }
      continue;
    }
  }

  // 3. Reconcile order rewards & deduplicate per orderId
  const orderMap = new Map<string, { order: any; payment: any }>();
  for (const row of userOrders) {
    if (!row.order?.id) continue;
    const existing = orderMap.get(row.order.id);
    if (
      !existing ||
      (existing.payment?.paymentStatus !== "success" &&
        row.payment?.paymentStatus === "success")
    ) {
      orderMap.set(row.order.id, row);
    }
  }

  const seenOrderEarn = new Set<string>();
  const seenOrderCancel = new Set<string>();
  const seenOrderRedeem = new Set<string>();
  const seenOrderRedeemRefund = new Set<string>();
  const orderEarnAmountMap = new Map<string, number>();
  const orderRedeemAmountMap = new Map<string, number>();

  for (const h of chronologicalHistory) {
    if (rewardIdsToDelete.has(h.id)) continue;
    const rawType = String(h.type || "").trim();

    if (
      rawType === "order_payment" ||
      rawType === "subscription_charge" ||
      rawType === "purchase"
    ) {
      if (!h.orderId || !orderMap.has(h.orderId) || seenOrderEarn.has(h.orderId)) {
        rewardIdsToDelete.add(h.id);
        continue;
      }
      const linked = orderMap.get(h.orderId)!;
      const ordStatus = String(linked.order?.status || "").toLowerCase();
      const payStatus = String(linked.payment?.paymentStatus || "").toLowerCase();
      const isActuallyPaid =
        payStatus === "success" ||
        ["paid", "processing", "shipped", "delivered", "completed", "cancelled", "canceled", "returned"].includes(ordStatus);

      if (!isActuallyPaid) {
        rewardIdsToDelete.add(h.id);
        continue;
      }

      seenOrderEarn.add(h.orderId);
      const orderTotal = Number(linked.order?.totalAmount || 0);
      const expectedCredit = calculateOrderRewardRupees(orderTotal);
      if (expectedCredit > 0 && Number(h.coins) !== expectedCredit) {
        await db
          .update(rewardCoinsHistory)
          .set({ coins: expectedCredit })
          .where(eq(rewardCoinsHistory.id, h.id));
        h.coins = expectedCredit;
        mutated = true;
      }
      orderEarnAmountMap.set(h.orderId, Number(h.coins));
      continue;
    }

    if (rawType === "order_cancelled") {
      if (!h.orderId || seenOrderCancel.has(h.orderId)) {
        rewardIdsToDelete.add(h.id);
        continue;
      }
      seenOrderCancel.add(h.orderId);
      const linked = orderMap.get(h.orderId);
      if (linked) {
        const credited =
          orderEarnAmountMap.get(h.orderId) ||
          calculateOrderRewardRupees(Number(linked.order?.totalAmount || 0));
        const expectedReversal = -Math.abs(credited);
        if (expectedReversal < 0 && Number(h.coins) !== expectedReversal) {
          await db
            .update(rewardCoinsHistory)
            .set({ coins: expectedReversal })
            .where(eq(rewardCoinsHistory.id, h.id));
          h.coins = expectedReversal;
          mutated = true;
        }
      }
      continue;
    }

    if (rawType === "checkout_redeem") {
      if (!h.orderId || seenOrderRedeem.has(h.orderId)) {
        rewardIdsToDelete.add(h.id);
        continue;
      }
      seenOrderRedeem.add(h.orderId);
      const linked = orderMap.get(h.orderId);
      const metaRupees = Number((linked?.payment?.paymentMeta as any)?.rewardsUsed || 0);
      let coinsVal = Math.abs(Number(h.coins));
      if (metaRupees > 0) {
        coinsVal = Math.round(metaRupees);
      } else if (coinsVal >= 1000) {
        coinsVal = Math.round(coinsVal / 100);
      }
      if (Number(h.coins) !== -Math.abs(coinsVal)) {
        await db
          .update(rewardCoinsHistory)
          .set({ coins: -Math.abs(coinsVal) })
          .where(eq(rewardCoinsHistory.id, h.id));
        h.coins = -Math.abs(coinsVal);
        mutated = true;
      }
      orderRedeemAmountMap.set(h.orderId, coinsVal);
      continue;
    }

    if (rawType === "checkout_redeem_refund") {
      if (!h.orderId || seenOrderRedeemRefund.has(h.orderId)) {
        rewardIdsToDelete.add(h.id);
        continue;
      }
      seenOrderRedeemRefund.add(h.orderId);
      const linked = orderMap.get(h.orderId);
      const metaRupees = Number((linked?.payment?.paymentMeta as any)?.rewardsUsed || 0);
      let refundRupees =
        orderRedeemAmountMap.get(h.orderId) ||
        (metaRupees > 0 ? Math.round(metaRupees) : Math.abs(Number(h.coins)));
      if (refundRupees >= 1000) {
        refundRupees = Math.round(refundRupees / 100);
      }
      if (refundRupees > 0 && Number(h.coins) !== refundRupees) {
        await db
          .update(rewardCoinsHistory)
          .set({ coins: refundRupees })
          .where(eq(rewardCoinsHistory.id, h.id));
        h.coins = refundRupees;
        mutated = true;
      }
      continue;
    }
  }

  if (rewardIdsToDelete.size > 0) {
    await db
      .delete(rewardCoinsHistory)
      .where(inArray(rewardCoinsHistory.id, Array.from(rewardIdsToDelete)));
    mutated = true;
  }

  // 4. Insert missing legitimate entries (at most 1 each)
  if (!seenSignupBonus) {
    await db.insert(rewardCoinsHistory).values({
      userId,
      coins: SIGNUP_BONUS_RUPEES,
      type: "signup_bonus",
      createdAt: userRow.createdAt ?? new Date(),
    });
    mutated = true;
  }

  for (const refRow of validReferrals) {
    if (!matchedReferralIds.has(refRow.id)) {
      await db.insert(rewardCoinsHistory).values({
        userId,
        coins: REFERRAL_EARNING_RUPEES,
        type: `referral_bonus:${refRow.id}:${refRow.newUserName || "Friend"}`,
        createdAt: refRow.createdAt ?? new Date(),
      });
      matchedReferralIds.add(refRow.id);
      mutated = true;
    }
  }

  for (const rev of userReviews) {
    if (!matchedReviewIds.has(rev.id)) {
      const cleanProdName = (rev.productName || "Potent Product").trim();
      await db.insert(rewardCoinsHistory).values({
        userId,
        coins: REVIEW_REWARD_RUPEES,
        type: `review_reward:${rev.id}:${cleanProdName}`,
        createdAt: rev.createdAt ?? new Date(),
      });
      matchedReviewIds.add(rev.id);
      mutated = true;
    }
  }

  // Only credit orders that have a confirmed payment (paymentStatus === "success")
  // or paid status, and reverse cancelled/returned orders.
  for (const [ordId, { order: ord, payment: pay }] of orderMap.entries()) {
    const status = String(ord.status || "").toLowerCase();
    const isCancelledOrReturned =
      status === "cancelled" ||
      status === "canceled" ||
      status === "returned" ||
      cancelledSubscriptionOrderIds.has(ordId);
    const isConfirmedPaid =
      pay?.paymentStatus === "success" ||
      ["paid", "processing", "shipped", "delivered", "completed"].includes(status);

    if (!isConfirmedPaid && !isCancelledOrReturned) continue;

    const creditAmount = calculateOrderRewardRupees(Number(ord.totalAmount || 0));

    if (!seenOrderEarn.has(ordId) && creditAmount > 0) {
      await db.insert(rewardCoinsHistory).values({
        userId,
        orderId: ordId,
        coins: creditAmount,
        type: "order_payment",
        createdAt: ord.createdAt ?? new Date(),
      });
      seenOrderEarn.add(ordId);
      orderEarnAmountMap.set(ordId, creditAmount);
      mutated = true;
    }

    const metaRewardsUsedRupees = Number(
      (pay?.paymentMeta as any)?.rewardsUsed ??
      (pay?.paymentMeta as any)?.rewardUsed ??
      (pay?.paymentMeta as any)?.rewardsRedeemed ??
      0,
    );
    const redeemedAmount = Math.max(
      Math.round(metaRewardsUsedRupees),
      orderRedeemAmountMap.get(ordId) || 0,
    );

    if (redeemedAmount > 0 && !seenOrderRedeem.has(ordId)) {
      await db.insert(rewardCoinsHistory).values({
        userId,
        orderId: ordId,
        coins: -Math.abs(redeemedAmount),
        type: "checkout_redeem",
        createdAt: ord.createdAt ?? new Date(),
      });
      seenOrderRedeem.add(ordId);
      orderRedeemAmountMap.set(ordId, redeemedAmount);
      mutated = true;
    }

    if (isCancelledOrReturned) {
      const earned = orderEarnAmountMap.get(ordId) || creditAmount;
      if (seenOrderEarn.has(ordId) && earned > 0 && !seenOrderCancel.has(ordId)) {
        await db.insert(rewardCoinsHistory).values({
          userId,
          orderId: ordId,
          coins: -Math.abs(earned),
          type: "order_cancelled",
          createdAt: ord.updatedAt ?? new Date(),
        });
        seenOrderCancel.add(ordId);
        mutated = true;
      }

      if (redeemedAmount > 0 && !seenOrderRedeemRefund.has(ordId)) {
        await db.insert(rewardCoinsHistory).values({
          userId,
          orderId: ordId,
          coins: Math.abs(redeemedAmount),
          type: "checkout_redeem_refund",
          createdAt: ord.updatedAt ?? new Date(),
        });
        seenOrderRedeemRefund.add(ordId);
        mutated = true;
      }
    }
  }

  // 5. Fetch clean final history and compute exact rupee balance
  const finalHistory = mutated
    ? await db
        .select()
        .from(rewardCoinsHistory)
        .where(eq(rewardCoinsHistory.userId, userId))
        .orderBy(desc(rewardCoinsHistory.createdAt))
    : existingHistory;

  const rawSum = finalHistory.reduce(
    (sum, item) => sum + Number(item.coins || 0),
    0,
  );
  const balance = Math.max(0, Math.round(rawSum));
  const referralEarnings = validReferrals.length * REFERRAL_EARNING_RUPEES;

  if (
    Number(userRow.rewardOrderCoins ?? -1) !== balance ||
    Number(userRow.referralCoins ?? -1) !== referralEarnings
  ) {
    await db
      .update(users)
      .set({
        rewardOrderCoins: balance,
        referralCoins: referralEarnings,
      })
      .where(eq(users.id, userId));
  }

  return {
    balance,
    referralEarnings,
    history: finalHistory,
    validReferrals,
  };
}

export async function reverseCancelledOrderRewards(orderId: string) {
  const [ord] = await db
    .select()
    .from(order)
    .where(eq(order.id, orderId))
    .limit(1);

  if (ord?.userId) {
    await syncAndGetUserRewards(ord.userId);
    return;
  }

  if (orderId.startsWith("subscription-")) {
    const subId = Number(orderId.replace("subscription-", ""));
    if (!Number.isNaN(subId)) {
      const [sub] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.id, subId))
        .limit(1);
      if (sub?.userId) {
        await syncAndGetUserRewards(sub.userId);
      }
    }
  }
}

export function describeRewardHistoryRow(item: {
  id?: string;
  coins: number;
  type?: string | null;
  orderId?: string | null;
  createdAt?: Date | string | null;
}) {
  const rawType = String(item.type || "").trim();
  const rupees = Number(item.coins || 0);
  const isPositive = rupees >= 0;
  const absRupees = Math.abs(Math.round(rupees));
  const formattedAmount = `${isPositive ? "+" : "-"}₹${absRupees.toLocaleString("en-IN")}`;
  const formattedDate = formatRewardDate(item.createdAt);
  const shortOrder = item.orderId ? `#${item.orderId.slice(0, 8).toUpperCase()}` : "";

  if (rawType === "signup_bonus" || rawType === "welcome_bonus") {
    return {
      title: "Welcome Bonus — Joined Potent Rewards",
      subtitle: `₹${SIGNUP_BONUS_RUPEES} cash credit for creating your account`,
      formattedAmount,
      isPositive: true,
      category: "signup" as const,
      formattedDate,
    };
  }

  if (rawType === "referral_welcome" || rawType.startsWith("referral_welcome:")) {
    return {
      title: "Referral Welcome Credit",
      subtitle: `₹${REFERRAL_FRIEND_BONUS_RUPEES} cash credit for signing up with friend's referral code`,
      formattedAmount,
      isPositive: true,
      category: "referral" as const,
      formattedDate,
    };
  }

  if (rawType === "referral" || rawType.startsWith("referral_bonus:")) {
    const parts = rawType.split(":");
    const friendName = parts.length >= 3 ? parts.slice(2).join(":") : "";
    return {
      title: friendName
        ? `Referral Credit — ${friendName} Joined`
        : "Referral Credit Earned",
      subtitle: `₹${REFERRAL_EARNING_RUPEES} cash credit earned from a successful referral`,
      formattedAmount,
      isPositive: true,
      category: "referral" as const,
      formattedDate,
    };
  }

  if (rawType === "birthday_reward" || rawType.startsWith("birthday_reward:")) {
    return {
      title: "Birthday Cash Credit",
      subtitle: `₹${BIRTHDAY_REWARD_RUPEES} annual birthday bonus (1x per year)`,
      formattedAmount,
      isPositive: true,
      category: "birthday" as const,
      formattedDate,
    };
  }

  if (rawType === "review_reward" || rawType.startsWith("review_reward:")) {
    const parts = rawType.split(":");
    const productName = parts.length >= 3 ? parts.slice(2).join(":") : "";
    return {
      title: productName
        ? `Review Reward — ${productName}`
        : "Product Review Reward",
      subtitle: `₹${REVIEW_REWARD_RUPEES} cash credit earned for writing a product review`,
      formattedAmount,
      isPositive: true,
      category: "review" as const,
      formattedDate,
    };
  }

  if (rawType === "order_cancelled") {
    return {
      title: `Cancelled Order Credit Reversed ${shortOrder}`.trim(),
      subtitle: item.orderId
        ? `Reward cash credit reversed for cancelled order (${item.orderId})`
        : "Reward cash credit reversed due to order cancellation",
      formattedAmount,
      isPositive: false,
      category: "cancelled" as const,
      formattedDate,
    };
  }

  if (rawType === "checkout_redeem") {
    return {
      title: `Rewards Used at Checkout ${shortOrder}`.trim(),
      subtitle: item.orderId
        ? `Cash credit applied to order (${item.orderId})`
        : "Cash credit applied at checkout",
      formattedAmount,
      isPositive: false,
      category: "redeem" as const,
      formattedDate,
    };
  }

  if (rawType === "checkout_redeem_refund") {
    return {
      title: `Checkout Credit Refunded ${shortOrder}`.trim(),
      subtitle: item.orderId
        ? `Redeemed credit restored from cancelled order (${item.orderId})`
        : "Redeemed credit restored to your balance",
      formattedAmount,
      isPositive: true,
      category: "order" as const,
      formattedDate,
    };
  }

  if (rawType === "subscription_charge") {
    return {
      title: `Subscription Order Cash Credit ${shortOrder}`.trim(),
      subtitle: item.orderId
        ? `5% reward earned on subscription order (${item.orderId})`
        : "5% reward earned on subscription renewal",
      formattedAmount,
      isPositive: true,
      category: "order" as const,
      formattedDate,
    };
  }

  return {
    title: `Order Cash Credit Earned ${shortOrder}`.trim(),
    subtitle: item.orderId
      ? `5% cash credit earned on order (${item.orderId})`
      : "5% cash credit earned on purchase",
    formattedAmount,
    isPositive: isPositive,
    category: "order" as const,
    formattedDate,
  };
}
