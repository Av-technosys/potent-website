"use server";
import {
  paymentGatewayPlans,
  paymentGatewaySubscription,
  product,
  productVariant,
  subscriptions,
} from "@/db/schema";
import { db } from "@/lib/db";
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from "@/env";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireUserWithRefresh } from "../user/action";

export async function createSubscription({ userId, items }: any) {
  try {
    const subscriptionItems = items.filter(
      (item: any) => (item.isTypeSubscription || item.isSubscribed) && item.subscriptionType !== "cycle_sync",
    );

    if (subscriptionItems.length === 0) {
      return {
        success: true,
        message: "No gateway subscriptions to create",
        subscriptions: [],
      };
    }

    const createdSubscriptions = await db.insert(subscriptions).values(
      subscriptionItems.map((item: any) => {
        const startDate = new Date();
        const frequencyInMonths =
          item.frequencyInMonths ??
          item.selectedPlan?.period ??
          (item.subscriptionType === "every_2_months" ? 2 : 1);

        // 1 month = 30 days
        const totalDays = frequencyInMonths * 30;

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + totalDays);

        const nextOrderDate = new Date(endDate);
        nextOrderDate.setDate(nextOrderDate.getDate() + 1);

        return {
          userId,
          productId: item.productId,
          productVariantId: item.productVariantId || null,
          frequencyInDays: totalDays,
          subscriptionType: item.subscriptionType,
          startDate,
          endDate,
          nextOrderDate,
        };
      }),
    ).returning();

    return {
      success: true,
      message: "Subscription created successfully",
      subscriptions: createdSubscriptions,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to create subscription",
    };
  }
}

export async function createPaymentGatewayPlan(planData: any) {
  try {
    await db.insert(paymentGatewayPlans).values(
      planData.map((item: any) => {
        return {
          name: item.item.name,
          price: item.item.amount,
          descirption: item.item.description,
          billingFrequency: String(item.interval),
          frequencyType: item.frequencyType ?? null,
          gatewayPlanId: item.id,
        };
      }),
    );

    return {
      success: true,
      message: "Payment gateway plan created successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to create payment gateway plan",
    };
  }
}


export async function CreatePaymentGatewaySubscription(subscriptions:any){
    try {
        await db.insert(paymentGatewaySubscription).values(
            subscriptions.map((item: any) => {
                return {
                    userId: item.userId,
                    subscriptionId: item.subscriptionId,
                    gatewaySubscriptionId: item.gatewaySubscriptionId || item.id,
                    planId: item.plan_id,
                    totalCount: item.total_count,
                    remainingCount:item.remaining_count,
                    quantity: item.quantity,
                    startAt: item.start_at ? new Date(item.start_at * 1000) : null,
                    customerNotify: item.customer_notify,
                    expireBy: item.expire_by ? new Date(item.expire_by * 1000) : null,
                    // startDate: item.start_date,
                };
            })
        );
        
    } catch (error) {
        
    }
}

export async function getUserSubscriptions() {
  try {
    const { userId } = await requireUserWithRefresh();

    const rows = await db
      .select({
        subscription: subscriptions,
        gatewaySubscription: paymentGatewaySubscription,
        plan: paymentGatewayPlans,
        product: product,
        variant: productVariant,
      })
      .from(subscriptions)
      .leftJoin(
        paymentGatewaySubscription,
        eq(paymentGatewaySubscription.subscriptionId, subscriptions.id),
      )
      .leftJoin(
        paymentGatewayPlans,
        eq(paymentGatewaySubscription.planId, paymentGatewayPlans.gatewayPlanId),
      )
      .leftJoin(product, eq(subscriptions.productId, product.id))
      .leftJoin(productVariant, eq(subscriptions.productVariantId, productVariant.id))
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.startDate));

    return {
      success: true,
      subscriptions: rows.map((row) => ({
        id: row.subscription.id,
        orderId: row.subscription.orderId,
        productId: row.subscription.productId,
        productVariantId: row.subscription.productVariantId,
        productName: row.product?.name ?? "Subscription",
        variantName: row.variant?.name ?? row.product?.name ?? "Product",
        image: row.variant?.bannerImage ?? row.product?.bannerImage ?? null,
        sku: row.variant?.sku ?? null,
        subscriptionType: row.subscription.subscriptionType,
        frequencyInDays: row.subscription.frequencyInDays,
        nextOrderDate: row.subscription.nextOrderDate,
        chargeDate: row.subscription.chargeDate,
        startDate: row.subscription.startDate,
        endDate: row.subscription.endDate,
        isActive: row.subscription.isActive,
        gatewaySubscriptionId:
          row.gatewaySubscription?.gatewaySubscriptionId ?? null,
        planId: row.gatewaySubscription?.planId ?? null,
        amount: row.plan?.price ? Number(row.plan.price) / 100 : null,
        remainingCount: row.gatewaySubscription?.remainingCount ?? null,
        totalCount: row.gatewaySubscription?.totalCount ?? null,
      })),
    };
  } catch (error: any) {
    console.error("Failed to fetch subscriptions:", error);
    if (error?.message === "UNAUTHORIZED") {
      return {
        success: false,
        subscriptions: [],
        message: "UNAUTHORIZED",
      };
    }

    return {
      success: false,
      subscriptions: [],
      message: "Failed to fetch subscriptions",
    };
  }
}

export async function cancelUserSubscription(subscriptionId: number) {
  try {
    const { userId } = await requireUserWithRefresh();

    const [row] = await db
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
          eq(subscriptions.id, Number(subscriptionId)),
          eq(subscriptions.userId, userId),
        ),
      )
      .limit(1);

    if (!row?.subscription) {
      return { success: false, message: "Subscription not found" };
    }

    if (!row.subscription.isActive) {
      return { success: true, message: "Subscription is already cancelled" };
    }

    const gatewaySubscriptionId =
      row.gatewaySubscription?.gatewaySubscriptionId;

    if (gatewaySubscriptionId) {
      const auth = Buffer.from(
        `${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`,
      ).toString("base64");
      const response = await fetch(
        `https://api.razorpay.com/v1/subscriptions/${gatewaySubscriptionId}/cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cancel_at_cycle_end: false }),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message:
            data?.error?.description ??
            "Unable to cancel subscription with Razorpay",
        };
      }

      await db
        .update(paymentGatewaySubscription)
        .set({
          remainingCount: data.remaining_count ?? row.gatewaySubscription?.remainingCount,
        })
        .where(eq(paymentGatewaySubscription.subscriptionId, row.subscription.id));
    }

    await db
      .update(subscriptions)
      .set({
        isActive: false,
        endDate: new Date(),
      })
      .where(eq(subscriptions.id, row.subscription.id));

    revalidatePath("/dashboard/subscriptions");

    return { success: true, message: "Subscription cancelled" };
  } catch (error) {
    console.error("Failed to cancel subscription:", error);
    return {
      success: false,
      message: "Failed to cancel subscription",
    };
  }
}
