/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  initiateRazorpayPayment,
  initiateRazorpaySubscription,
} from "@/lib/razorpay";
import { toast } from "sonner";
import { getCheckoutPricing } from "@/helper";
import { clearCart } from "@/store/cartActions";
import { Input } from "@/components/ui/input";

export function CheckoutSummary({
  selected,
  address,
  checkoutMode = "cart",
  subscriptionCheckout,
}: any) {
  const [cart, setCart] = useState<any[]>([]);
  const [subscriptionQuote, setSubscriptionQuote] = useState<any>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountedSubtotal, setDiscountedSubtotal] = useState(0);
  const [gst, setGst] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [final, setFinal] = useState(0);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const normalizedAddress = address.map((item: any) => ({
    ...item,
    street: item.street ?? item.streetAddress1,
    locality: item.locality ?? item.streetAddress2,
  }));
  const filteredAddress = normalizedAddress.filter(
    (item: any) => String(item.id) === String(selected),
  );
  const isSubscriptionCheckout = checkoutMode === "subscription";
  const isSummaryCalculating =
    checkoutMode === "loading" ||
    quoteLoading ||
    (isSubscriptionCheckout && !subscriptionQuote);

  const loadPricing = async (couponCode?: string | null) => {
    const res = await getCheckoutPricing(couponCode);

    if (!res.success) {
      toast.error(res.message ?? "Failed to calculate checkout total");
      return false;
    }

    setCart(res.items ?? []);
    setTotal(res.subtotal);
    setDiscount(res.discount);
    setDiscountedSubtotal(res.discountedSubtotal);
    setGst(res.gst);
    setShipping(res.shipping);
    setFinal(res.final);
    setAppliedCoupon(res.coupon);
    return true;
  };

  const loadSubscriptionQuote = async () => {
    if (!subscriptionCheckout) return;

    setQuoteLoading(true);

    try {
      const res = await fetch("/api/razorpay/subscription-checkout/quote", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: subscriptionCheckout }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error ?? "Failed to calculate subscription total");
        return;
      }

      setSubscriptionQuote(data);
      setCart(data.items ?? []);
      setTotal(data.subtotal);
      setDiscount(data.discount);
      setDiscountedSubtotal(data.final);
      setGst(0);
      setShipping(0);
      setFinal(data.final);
    } finally {
      setQuoteLoading(false);
    }
  };

  useEffect(() => {
    if (checkoutMode === "loading") return;

    if (isSubscriptionCheckout) {
      setFinal(0);
      setTotal(0);
      setDiscount(0);
      setSubscriptionQuote(null);
      loadSubscriptionQuote();
    } else {
      loadPricing();
    }
  }, [checkoutMode, subscriptionCheckout]);

  const handleApplyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) {
      toast.error("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    const applied = await loadPricing(code);
    setCouponLoading(false);

    if (applied) {
      toast.success("Coupon applied");
    }
  };

  const handleRemoveCoupon = async () => {
    setCouponInput("");
    setCouponLoading(true);
    await loadPricing();
    setCouponLoading(false);
    toast.success("Coupon removed");
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      if (!selected) {
        toast.error("Please select an address");
        return;
      }

      if (isSubscriptionCheckout) {
        if (!subscriptionQuote) {
          toast.error("Subscription amount is still being calculated");
          return;
        }

        const res: any = await initiateRazorpaySubscription({
          item: subscriptionCheckout,
          addressId: selected,
          name: "POTENT HYGIENE",
          description: subscriptionQuote?.label ?? "Subscription Payment",
        });

        toast.success("Subscription payment successful");
        window.sessionStorage.removeItem("potent-subscription-checkout");
        router.push(`/order-confirmation/${res?.orderId}`);
        return;
      }

      const res: any = await initiateRazorpayPayment({
        amount: final,
        name: "POTENT HYGIENE",
        description: "Order Payment",
        items: cart,
        couponCode: appliedCoupon?.code,
        // userId,
        address: filteredAddress[0],
      });

      toast.success("Payment Successful 🎉");

      clearCart();
      router.push(`/order-confirmation/${res?.orderId}`);
    } catch (err: any) {
      if (err?.message === "Payment cancelled") {
        toast.info("Payment cancelled");
        return;
      }

      toast.error("Payment Failed ❌", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-md border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-[#333333]">Order Summary</h2>

      {isSubscriptionCheckout && subscriptionQuote && (
        <div className="mb-4 rounded-md bg-blue-50 px-3 py-2 text-xs text-blue-700">
          {subscriptionQuote.label}
        </div>
      )}

      <div className="space-y-4 border-b pb-6">
        <div className="flex justify-between text-sm text-[#666666]">
          <span>Subtotal</span>
          <span className="font-bold text-[#333333]">
            {isSummaryCalculating ? "Calculating..." : `₹${total.toFixed(2)}`}
          </span>
        </div>

        {!isSubscriptionCheckout && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={couponInput}
                onChange={(event) =>
                  setCouponInput(event.target.value.toUpperCase())
                }
                placeholder="Enter coupon code"
                className="h-10 uppercase"
                disabled={couponLoading || loading || Boolean(appliedCoupon)}
              />

              {appliedCoupon ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemoveCoupon}
                  disabled={couponLoading || loading}
                  className="h-10"
                >
                  Remove
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || loading}
                  className="h-10"
                >
                  {couponLoading ? "Checking..." : "Apply"}
                </Button>
              )}
            </div>

            {appliedCoupon && (
              <div className="rounded-md bg-green-50 px-3 py-2 text-xs text-green-700">
                Coupon {appliedCoupon.code} applied. You saved ₹
                {discount.toFixed(2)}.
              </div>
            )}
          </div>
        )}

        {discount > 0 && (
          <>
            <div className="flex justify-between text-sm text-green-700">
              <span>Coupon Discount</span>
              <span className="font-bold">-₹{discount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm text-[#666666]">
              <span>Discounted Subtotal</span>
              <span className="font-bold text-[#333333]">
                ₹{discountedSubtotal.toFixed(2)}
              </span>
            </div>
          </>
        )}

        {!isSubscriptionCheckout && (
          <div className="flex justify-between text-sm text-[#666666]">
            <span>GST (18%)</span>
            <span className="font-bold text-[#333333]">₹{gst.toFixed(2)}</span>
          </div>
        )}

        {!isSubscriptionCheckout && (
          <div className="flex justify-between text-sm text-[#666666]">
            <span>Shipping</span>
            <span className="font-bold text-[#333333]">
              ₹{shipping.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div className="py-6">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-[#333333]">Total</span>

          <span className="text-2xl font-black text-[#333333]">
            {isSummaryCalculating ? "Calculating..." : `₹${final.toFixed(2)}`}
          </span>
        </div>
      </div>

      <Button
        onClick={handlePayment}
        disabled={
          loading ||
          isSummaryCalculating ||
          final <= 0 ||
          (isSubscriptionCheckout && !subscriptionQuote)
        }
        className="h-14 w-full rounded-xl bg-[#016271] text-lg font-bold"
      >
        {loading
          ? "Processing..."
          : isSummaryCalculating
            ? "Calculating..."
            : `Pay ₹${final.toFixed(2)}`}
      </Button>

      <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-gray-400">
        <ShieldCheck className="h-4 w-4 text-[#00FF1E]" />
        Secure Checkout
      </div>
    </div>
  );
}
