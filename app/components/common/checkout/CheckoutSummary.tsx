/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, CreditCard, Smartphone, Building2, Gift, Luggage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  initiateRazorpayPayment,
  initiateRazorpaySubscription,
} from "@/lib/razorpay";
import { toast } from "sonner";
import { getCheckoutPricing } from "@/helper";
import { getDirectCheckoutPricing } from "@/helper/checkout/action";
import { clearCart } from "@/store/cartActions";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cartStore";
import {
  getCleanProductTitle,
  getCartItemVariantBadge,
  isOvyPadItem,
  getFreeLinersCount,
} from "@/lib/cartItemDisplay";
import { getImageUrl } from "@/lib/imageUrl";
import { formatMixBoxRecipe } from "@/lib/mixYourBox";
import { formatYatraKitContents, getYatraKitData } from "@/lib/yatraKit";

export function CheckoutSummary({
  selected,
  address,
  checkoutMode = "cart",
  subscriptionCheckout,
  directCheckoutItem,
}: any) {
  const [cart, setCart] = useState<any[]>([]);
  const [subscriptionQuote, setSubscriptionQuote] = useState<any>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountedSubtotal, setDiscountedSubtotal] = useState(0);
  const [gst, setGst] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [rewardBalance, setRewardBalance] = useState(0);
  const [rewardsUsed, setRewardsUsed] = useState(0);
  const [final, setFinal] = useState(0);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "upi" | "card" | "netbanking"
  >("upi");
  const [paymentErrorMessage, setPaymentErrorMessage] = useState<string | null>(
    null,
  );
  const router = useRouter();

  const isSubscriptionCheckout = checkoutMode === "subscription";
  const isDirectCheckout = checkoutMode === "direct";

  const storeItems = useCartStore((state) => state.items);
  const isGift = useCartStore((state) => state.isGift);
  const giftNote = useCartStore((state) => state.giftNote);
  const setIsGift = useCartStore((state) => state.setIsGift);
  const setGiftNote = useCartStore((state) => state.setGiftNote);
  const displayItems = isDirectCheckout
    ? (directCheckoutItem ? [directCheckoutItem] : cart)
    : isSubscriptionCheckout
      ? (cart.length > 0 ? cart : (subscriptionQuote?.items ?? []))
      : (cart.length > 0 ? cart : storeItems);

  const totalItemCount = displayItems.reduce(
    (acc: number, item: any) => acc + Number(item.quantity || 1),
    0,
  );

  const normalizedAddress = address.map((item: any) => ({
    ...item,
    street: item.street ?? item.streetAddress1,
    locality: item.locality ?? item.streetAddress2,
  }));
  const filteredAddress = normalizedAddress.filter(
    (item: any) => String(item.id) === String(selected),
  );
  const isSummaryCalculating =
    checkoutMode === "loading" ||
    quoteLoading ||
    (isSubscriptionCheckout && !subscriptionQuote);

  const loadPricing = async (couponCode?: string | null) => {
    let res: any;
    if (isDirectCheckout) {
      if (!directCheckoutItem) return false;
      res = await getDirectCheckoutPricing(directCheckoutItem, couponCode);
    } else {
      res = await getCheckoutPricing(couponCode);
    }

    if (!res.success) {
      toast.error(res.message ?? "Failed to calculate checkout total");
      return false;
    }

    setCart(
      res.items ??
        (isDirectCheckout && directCheckoutItem ? [directCheckoutItem] : []),
    );
    setTotal(res.subtotal);
    setDiscount(res.discount);
    setDiscountedSubtotal(res.discountedSubtotal);
    setGst(res.gst);
    setShipping(res.shipping);
    setRewardBalance(Number(res.rewardBalance || 0));
    setRewardsUsed(Number(res.rewardsUsed || 0));
    setFinal(res.final);
    setAppliedCoupon(res.coupon);
    if (res.coupon) {
      useCartStore.getState().setAppliedCoupon({
        ...res.coupon,
        discount: res.discount,
      });
    } else if (couponCode === null || couponCode === "") {
      useCartStore.getState().setAppliedCoupon(null);
    }
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
        body: JSON.stringify({
          productId: subscriptionCheckout.productId,
          productVariantId: subscriptionCheckout.productVariantId,
          quantity: subscriptionCheckout.quantity,
          subscriptionType:
            subscriptionCheckout.subscriptionType ??
            subscriptionCheckout.selectedPlan?.subscriptionType ??
            subscriptionCheckout.plan?.subscriptionType,
          selectedPlan:
            subscriptionCheckout.selectedPlan ?? subscriptionCheckout.plan,
          cycleSync: subscriptionCheckout.cycleSync,
          mixBoxRecipe: subscriptionCheckout.mixBoxRecipe,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error ?? "Failed to calculate subscription total");
        return;
      }

      setSubscriptionQuote(data);
      setCart(data.items ?? []);
      setTotal(data.subtotal);
      setDiscount(data.discountAmount ?? data.discount ?? 0);
      setDiscountedSubtotal(data.discountedSubtotal ?? data.final);
      setGst(0);
      setShipping(data.shipping ?? 0);
      setRewardBalance(Number(data.rewardBalance || 0));
      setRewardsUsed(Number(data.rewardsUsed || 0));
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
      setRewardBalance(0);
      setRewardsUsed(0);
      setSubscriptionQuote(null);
      loadSubscriptionQuote();
    } else {
      const storeCoupon = useCartStore.getState().appliedCoupon?.code;
      if (storeCoupon) {
        setCouponInput(storeCoupon);
        loadPricing(storeCoupon);
      } else {
        loadPricing();
      }
    }
  }, [checkoutMode, subscriptionCheckout, directCheckoutItem]);

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
    await loadPricing("");
    useCartStore.getState().setAppliedCoupon(null);
    setCouponLoading(false);
    toast.success("Coupon removed");
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setPaymentErrorMessage(null);

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
          amount: subscriptionQuote.final,
          addressId: selected,
          name: "POTENT HYGIENE",
          description: subscriptionQuote?.label ?? "Subscription Payment",
          isGift,
          giftNote: isGift ? giftNote : "",
        });

        toast.success("Subscription payment successful");
        window.sessionStorage.removeItem("potent-subscription-checkout");
        router.push(`/order-confirmation/${res?.orderId}`);
        return;
      }

      if (isDirectCheckout) {
        const res: any = await initiateRazorpayPayment({
          amount: final,
          name: "POTENT HYGIENE",
          description: "Order Payment",
          items: directCheckoutItem ? [directCheckoutItem] : cart,
          couponCode: appliedCoupon?.code,
          address: filteredAddress[0],
          directItem: directCheckoutItem,
          paymentMethod: selectedPaymentMethod,
          isGift,
          giftNote: isGift ? giftNote : "",
        });

        toast.success("Payment Successful 🎉");
        window.sessionStorage.removeItem("potent-direct-checkout");
        // User bought single directItem; keep existing bag items safe!
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
        paymentMethod: selectedPaymentMethod,
        isGift,
        giftNote: isGift ? giftNote : "",
      });

      toast.success("Payment Successful 🎉");

      clearCart();
      router.push(`/order-confirmation/${res?.orderId}`);
    } catch (err: any) {
      const errMsg = err?.message || err?.description || "";
      if (
        errMsg === "Payment not completed" ||
        errMsg === "Payment cancelled" ||
        errMsg.toLowerCase().includes("cancel") ||
        errMsg.toLowerCase().includes("dismiss")
      ) {
        toast.info("Payment not completed");
        setPaymentErrorMessage("Payment not completed");
        return;
      }

      toast.error("Payment not completed", {
        description: err?.description || err?.message,
      });
      setPaymentErrorMessage("Payment not completed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200/90 bg-white p-5 sm:p-6 shadow-sm">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xl font-bold text-[#333333]">Order Summary</h2>
        <span className="text-xs text-gray-500 font-medium">
          {totalItemCount} {totalItemCount === 1 ? "pack" : "packs"}
        </span>
      </div>

      {isSubscriptionCheckout && subscriptionQuote && (
        <div className="mb-4 rounded-lg border border-blue-200/80 bg-blue-50/90 px-3.5 py-2.5 text-xs text-blue-800 space-y-1">
          <div className="font-semibold text-blue-900">
            {subscriptionQuote.label}
          </div>
          {subscriptionQuote.firstDeliveryDate && (
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-blue-700 font-medium">
              <span>
                First delivery:{" "}
                <strong className="font-bold text-blue-900">
                  {new Date(
                    subscriptionQuote.firstDeliveryDate,
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </strong>
              </span>
              {subscriptionQuote.billing?.label && (
                <span>
                  Renews {subscriptionQuote.billing.label.toLowerCase()}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* 📦 Order Items with Size and Quantity */}
      {displayItems.length > 0 && (
        <div className="mb-5 rounded-xl border border-gray-200/80 bg-gray-50/70 p-3 sm:p-3.5">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
              Items in this order ({totalItemCount})
            </span>
            {!isDirectCheckout && !isSubscriptionCheckout && (
              <Link
                href="/cart"
                className="text-xs font-semibold text-[#016271] hover:underline"
              >
                Edit Bag
              </Link>
            )}
          </div>

          <div className="divide-y divide-gray-200/70 max-h-56 overflow-y-auto pr-1">
            {displayItems.map((item: any, idx: number) => {
              const cleanTitle = getCleanProductTitle(item);
              const badge = getCartItemVariantBadge(item) || item.variantName;
              const qty = Number(item.quantity || 1);
              const unitPrice = Number(item.price || 0);
              const lineTotal = unitPrice * qty;
              const itemFirstDelivery =
                item.firstDeliveryDate ??
                (isSubscriptionCheckout
                  ? subscriptionQuote?.firstDeliveryDate
                  : null);

              const yatraKitData = getYatraKitData(item);
              const kitContents = formatYatraKitContents(yatraKitData);
              const freeLinersCount = getFreeLinersCount(item);

              return (
                <div
                  key={`${item.productId}-${item.productVariantId || item.sku || idx}-${idx}`}
                  className="flex items-start gap-2.5 py-2.5 first:pt-1 last:pb-1"
                >
                  {/* Thumbnail */}
                  <div className="relative h-12 w-12 shrink-0 rounded-lg bg-white border border-gray-200 p-1 overflow-hidden flex items-center justify-center">
                    <Image
                      src={yatraKitData ? "/looway/yatra-kit-thumb-v2.png" : getImageUrl(item.image)}
                      alt={cleanTitle}
                      width={48}
                      height={48}
                      className="h-full w-full object-contain"
                    />
                    
                  </div>

                  {/* Details: Product, Size, Quantity */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-1 leading-tight">
                      {yatraKitData
                        ? "Looway Yatra Kit"
                        : cleanTitle}
                    </h4>

                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      {yatraKitData?.kitName && (
                        <span className="inline-flex items-center rounded bg-[#F3E6F0] px-1.5 py-0.5 text-[10px] font-bold text-[#7E4D77] border border-[#9A5B90]/40">
                          {yatraKitData.kitName}
                        </span>
                      )}
                      {badge && !item.mixBoxRecipe && !yatraKitData && (
                        <span className="inline-flex items-center rounded bg-[#F4EFF3] px-1.5 py-0.5 text-[10px] font-semibold text-[#7E4D77] border border-[#E9DFE7]">
                          {badge}
                        </span>
                      )}
                      {freeLinersCount > 0 && !yatraKitData && (
                        <span className="inline-flex items-center gap-1 rounded bg-[#E6F4EA] px-1.5 py-0.5 text-[10px] font-bold text-[#15803D] border border-[#BFE3CA]">
                          🎁 +{freeLinersCount} Free Liners
                        </span>
                      )}
                      {yatraKitData && (
                        <span className="inline-flex items-center rounded bg-[#EAF6F4] px-1.5 py-0.5 text-[10px] font-bold text-[#116B66] border border-[#116B66]/20">
                          Travel Kit
                        </span>
                      )}
                      <span className="text-[11px] font-medium text-gray-600 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                        Qty: {qty}
                      </span>
                    </div>

                    {yatraKitData && (
                      <div className="space-y-1 mt-1">
                        {kitContents && (
                          <p className="text-[11px] font-medium text-[#116B66] leading-snug">
                            {kitContents}
                          </p>
                        )}
                        <div>
                          <span className="inline-flex items-center gap-1 rounded bg-[#E6F4EA] px-1.5 py-0.5 text-[10px] font-bold text-[#15803D] border border-[#BFE3CA]">
                            ✓ Free Intimate Wipes ({yatraKitData.freeWipesCount || 10} wipes) included
                          </span>
                        </div>
                      </div>
                    )}

                    {item.mixBoxRecipe && !yatraKitData && (
                      <p className="text-[11px] font-medium text-[#7E4D77] mt-1">
                        {formatMixBoxRecipe(item.mixBoxRecipe)}
                      </p>
                    )}

                    {itemFirstDelivery && (
                      <p className="text-[10px] font-medium text-[#016271] mt-1">
                        First delivery:{" "}
                        {new Date(itemFirstDelivery).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </p>
                    )}
                  </div>

                  {/* Line Total */}
                  <div className="text-right shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-[#016271]">
                      ₹{lineTotal.toFixed(2)}
                    </span>
                    {qty > 1 && (
                      <p className="text-[10px] text-gray-400">
                        ₹{unitPrice.toFixed(0)} ea
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pricing Breakdown */}
      <div className="space-y-3.5 border-b pb-5">
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

        {/* 🎁 Gift Option in Checkout */}
        <div className="rounded-xl border border-[#9A5B90]/30 bg-gradient-to-r from-[#FAF0F6] to-[#F1F8F9] p-3.5 sm:p-4">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isGift}
              onChange={(e) => setIsGift(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#9A5B90] accent-[#9A5B90] focus:ring-[#9A5B90]"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-[#7E4D77]">
                <Gift className="h-4 w-4 shrink-0 text-[#9A5B90]" />
                <span>This is a gift</span>
              </div>
              <p className="mt-0.5 text-[11px] text-[#7E4D77]/80">
                Hides price on parcel &amp; slip · Includes your personal note
              </p>
            </div>
          </label>

          {isGift && (
            <div className="mt-3 pt-3 border-t border-[#9A5B90]/20 space-y-1">
              <textarea
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value.slice(0, 200))}
                placeholder="Write a personal note for the recipient (up to 200 characters)..."
                maxLength={200}
                rows={2}
                className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-xs text-gray-800 placeholder-gray-400 focus:border-[#9A5B90] focus:outline-none focus:ring-1 focus:ring-[#9A5B90]"
              />
              <div className="flex justify-between items-center text-[10px] text-gray-400">
                <span>Prices will be omitted from the parcel &amp; slip</span>
                <span>{giftNote.length}/200</span>
              </div>
            </div>
          )}
        </div>

        {discount > 0 && (
          <>
            <div className="flex justify-between text-sm text-green-700">
              <span>
                {isSubscriptionCheckout
                  ? `Subscription Discount · Save ${subscriptionQuote?.discountPercentage ?? 0}%`
                  : appliedCoupon?.code
                    ? `Coupon Discount (${appliedCoupon.code})`
                    : "Coupon Discount"}
              </span>
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

        <div className="flex justify-between text-sm text-[#666666]">
          <span>Shipping</span>
          <span className="font-bold text-[#333333]">
            {shipping === 0 && total > 0
              ? "Free Delivery"
              : `₹${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="rounded-xl border border-[#1B8392]/25 bg-[#E9F7F9]/60 px-3.5 py-2.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#016271]">
              Rewards Balance Available
            </span>
            <span className="font-bold text-[#016271]">
              ₹{rewardBalance.toLocaleString("en-IN")}
            </span>
          </div>
          {rewardsUsed > 0 ? (
            <div className="flex items-center justify-between text-sm text-emerald-700 pt-1 border-t border-[#1B8392]/15">
              <span className="font-semibold">
                Rewards Credit Applied (Auto)
              </span>
              <span className="font-bold">-₹{rewardsUsed.toFixed(2)}</span>
            </div>
          ) : (
            <p className="text-[11px] text-gray-500">
              Earn cash credits on orders, reviews, referrals &amp; birthdays.
            </p>
          )}
        </div>

        <div className="flex justify-between text-xs text-gray-500 pt-0.5">
          <span>Taxes</span>
          <span className="font-medium text-gray-600">Prices include GST</span>
        </div>
      </div>

      <div className="py-4">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-lg font-bold text-[#333333]">Total</span>
            <p className="text-[11px] font-medium text-gray-500">
              Prices include GST
            </p>
          </div>

          <span className="text-2xl font-black text-[#333333]">
            {isSummaryCalculating ? "Calculating..." : `₹${final.toFixed(2)}`}
          </span>
        </div>
      </div>

      {/* 💳 Payment Method Selection: Choice of UPI, Card, Net Banking */}
      <div className="mb-5 space-y-2.5 pt-1">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
          Payment Method
        </label>
        <div className="space-y-2">
          {/* UPI Option */}
          <button
            type="button"
            onClick={() => setSelectedPaymentMethod("upi")}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedPaymentMethod === "upi"
                ? "border-[#016271] bg-[#E2F4F7]/40 ring-1 ring-[#016271]"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                  selectedPaymentMethod === "upi"
                    ? "bg-[#016271] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <Smartphone className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                  UPI (GPay, PhonePe, Paytm, QR)
                </p>
                <p className="text-[11px] text-gray-500">
                  Instant scan &amp; pay with any UPI app
                </p>
              </div>
            </div>
            <div
              className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                selectedPaymentMethod === "upi"
                  ? "border-[#016271] bg-[#016271]"
                  : "border-gray-300 bg-white"
              }`}
            >
              {selectedPaymentMethod === "upi" && (
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </div>
          </button>

          {/* Card Option */}
          <button
            type="button"
            onClick={() => setSelectedPaymentMethod("card")}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedPaymentMethod === "card"
                ? "border-[#016271] bg-[#E2F4F7]/40 ring-1 ring-[#016271]"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                  selectedPaymentMethod === "card"
                    ? "bg-[#016271] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <CreditCard className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                  Credit / Debit Card
                </p>
                <p className="text-[11px] text-gray-500">
                  Visa, Mastercard, RuPay &amp; Maestro
                </p>
              </div>
            </div>
            <div
              className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                selectedPaymentMethod === "card"
                  ? "border-[#016271] bg-[#016271]"
                  : "border-gray-300 bg-white"
              }`}
            >
              {selectedPaymentMethod === "card" && (
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </div>
          </button>

          {/* Net Banking Option */}
          <button
            type="button"
            onClick={() => setSelectedPaymentMethod("netbanking")}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedPaymentMethod === "netbanking"
                ? "border-[#016271] bg-[#E2F4F7]/40 ring-1 ring-[#016271]"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                  selectedPaymentMethod === "netbanking"
                    ? "bg-[#016271] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <Building2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                  Net Banking
                </p>
                <p className="text-[11px] text-gray-500">
                  All major Indian banks supported
                </p>
              </div>
            </div>
            <div
              className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                selectedPaymentMethod === "netbanking"
                  ? "border-[#016271] bg-[#016271]"
                  : "border-gray-300 bg-white"
              }`}
            >
              {selectedPaymentMethod === "netbanking" && (
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </div>
          </button>
        </div>
      </div>

      {paymentErrorMessage && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 font-medium flex items-start gap-2 shadow-xs">
          <span className="font-bold text-amber-800 shrink-0">Payment not completed:</span>
          <span>Your items are still safely in your bag. You can try again whenever you are ready.</span>
        </div>
      )}

      <Button
        onClick={handlePayment}
        disabled={
          loading ||
          isSummaryCalculating ||
          final <= 0 ||
          (isSubscriptionCheckout && !subscriptionQuote)
        }
        className="h-13 w-full rounded-xl bg-[#016271] text-base sm:text-lg font-bold text-white shadow-md transition-all hover:bg-[#014d59] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
      >
        {loading
          ? "Processing..."
          : isSummaryCalculating
            ? "Calculating..."
            : `Pay ₹${final.toFixed(2)} with ${
                selectedPaymentMethod === "upi"
                  ? "UPI"
                  : selectedPaymentMethod === "card"
                    ? "Card"
                    : "Net Banking"
              }`}
      </Button>

      <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
        <ShieldCheck className="h-4 w-4 text-[#00A86B]" />
        Secure 256-bit encrypted checkout
      </div>
    </div>
  );
}
