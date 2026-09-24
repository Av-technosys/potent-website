/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createPaymentGatewayPlan,
  CreatePaymentGatewaySubscription,
  createSubscription,
} from "@/helper";
import { getCurrentUser } from "@/helper/user/action";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);

    // prevent loading twice
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

export const initiateRazorpaySubscription = async ({
  item,
  addressId,
  name,
  description,
}: {
  item: any;
  addressId: string;
  name: string;
  description: string;
}) => {
  const scriptLoaded = await loadRazorpayScript();

  if (!scriptLoaded) {
    throw new Error("Razorpay SDK failed to load");
  }

  const startRes = await fetch("/api/razorpay/subscription-checkout/start", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item, addressId }),
  });

  const startData = await startRes.json();
  if (!startRes.ok || !startData?.subscriptionId) {
    throw new Error(startData?.error ?? "Subscription checkout failed");
  }

  return new Promise((resolve, reject) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      subscription_id: startData.subscriptionId,
      name,
      description,
      handler: async function (response: any) {
        try {
          const verifyRes = await fetch(
            "/api/razorpay/subscription-checkout/verify",
            {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                addressId,
                item,
              }),
            },
          );

          const verifyData = await verifyRes.json();

          if (verifyRes.ok && verifyData.success) {
            resolve(verifyData);
          } else {
            reject(verifyData?.error ?? "Subscription verification failed");
          }
        } catch (err) {
          reject(err);
        }
      },
      theme: {
        color: "#000000",
      },
      modal: {
        ondismiss: function () {
          reject(new Error("Payment cancelled"));
        },
      },
    };

    const razor = new window.Razorpay(options);

    razor.on("payment.failed", function (response: any) {
      reject(response.error);
    });

    razor.open();
  });
};

/**
 * Opens Razorpay Checkout
 */ export const initiateRazorpayPayment = async ({
  amount,
  name,
  description,
  items,
  couponCode,
  // userId,
  address,
}: {
  amount: number;
  name: string;
  description: string;
  items: any[];
  couponCode?: string;
  // userId: string;
  address: any;
}) => {
  const scriptLoaded = await loadRazorpayScript();

  if (!scriptLoaded) {
    throw new Error("Razorpay SDK failed to load");
  }

  const subscriptionItems = items.filter(
    (item: any) =>
      (item.isTypeSubscription === true || item.isSubscribed === true) &&
      item.subscriptionType !== "cycle_sync",
  );

  let localSubscriptions: any[] = [];
  if (items.some((item: any) => item.isTypeSubscription === true || item.isSubscribed === true)) {
    const { userId }: any = await getCurrentUser()
    const subscriptionResult: any = await createSubscription({ userId, items });
    localSubscriptions = subscriptionResult?.subscriptions ?? [];
  }

  if (subscriptionItems.length > 0) {
    const { userId }: any = await getCurrentUser()
    const plan = await fetch("/api/razorpay/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, items }),
    });

    const planData = await plan.json();

    if (!Array.isArray(planData) || planData.length === 0) {
      throw new Error("Plan creation failed");
    }

    await createPaymentGatewayPlan(planData);

    const subscriptions = await Promise.all(
      planData.map(async (p: any, index: number) => {
        const res = await fetch("/api/razorpay/subscriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId: p.id }),
        });

        const data = await res.json();

        if (!data?.id) {
          throw new Error("Subscription creation failed");
        }

        return {
          ...data,
          productId: p.productId,
          subscriptionId: localSubscriptions[index]?.id,
          userId,
        };
      }),
    );

    await CreatePaymentGatewaySubscription(subscriptions);

  }

  // 1️⃣ Create Razorpay Order (ONLY amount here)
  const res = await fetch("/api/razorpay/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ couponCode, addressId: address?.id }),
  });

  const order = await res.json();
  if (!order?.id) {
    throw new Error("Order creation failed");
  }

  // 2️⃣ Open Razorpay Checkout
  return new Promise((resolve, reject) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name,
      description,
      order_id: order.id,

      handler: async function (response: any) {
        try {
          // 3️⃣ Verify + Create DB Order
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              items,
              // userId,
              address,
              couponCode,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            resolve(verifyData);
          } else {
            reject("Payment verification failed");
          }
        } catch (err) {
          reject(err);
        }
      },

      theme: {
        color: "#000000",
      },
      modal: {
        ondismiss: function () {
          reject(new Error("Payment cancelled"));
        },
      },
    };

    const razor = new window.Razorpay(options);

    razor.on("payment.failed", function (response: any) {
      reject(response.error);
    });

    razor.open();
  });
};
