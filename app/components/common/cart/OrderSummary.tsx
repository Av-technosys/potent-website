"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Truck, Tag, Gift, Luggage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import {
  calculateShippingFee,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/shippingConfig";
import { validateCartCoupon } from "@/helper";
import { toast } from "sonner";
import Image from "next/image";
import { getImageUrl } from "@/lib/imageUrl";
import {
  getCleanProductTitle,
  getCartItemVariantBadge,
  isOvyPadItem,
  getFreeLinersCount,
} from "@/lib/cartItemDisplay";
import { formatYatraKitContents, getYatraKitData } from "@/lib/yatraKit";
import { formatMixBoxRecipe } from "@/lib/mixYourBox";

export function OrderSummary() {
  const router = useRouter();

  // ✅ Zustand state
  const items = useCartStore((state) => state.items);
  const appliedCoupon = useCartStore((state) => state.appliedCoupon);
  const setAppliedCoupon = useCartStore((state) => state.setAppliedCoupon);
  const isGift = useCartStore((state) => state.isGift);
  const giftNote = useCartStore((state) => state.giftNote);
  const setIsGift = useCartStore((state) => state.setIsGift);
  const setGiftNote = useCartStore((state) => state.setGiftNote);

  const [couponInput, setCouponInput] = useState(appliedCoupon?.code || "");
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    if (appliedCoupon?.code) {
      setCouponInput(appliedCoupon.code);
    }
  }, [appliedCoupon]);

  // ✅ Derived calculations
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const totalPacks = items.reduce(
    (acc, item) => acc + Number(item.quantity || 1),
    0,
  );

  let discount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (
      Number(appliedCoupon.minimumOrderValue || 0) > 0 &&
      subtotal < Number(appliedCoupon.minimumOrderValue)
    ) {
      discount = 0;
    } else {
      if (appliedCoupon.isDiscountPercentage) {
        discount = subtotal * ((appliedCoupon.discountPercentage ?? 0) / 100);
      } else {
        discount = appliedCoupon.discountFixedAmount ?? 0;
      }
      if (
        appliedCoupon.maximumDiscountAmount &&
        appliedCoupon.maximumDiscountAmount > 0
      ) {
        discount = Math.min(discount, appliedCoupon.maximumDiscountAmount);
      }
      discount = Math.round(Math.min(discount, subtotal) * 100) / 100;
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shipping =
    items.length === 0 ? 0 : calculateShippingFee(discountedSubtotal);
  const final = items.length === 0 ? 0 : discountedSubtotal + shipping;

  if (items.length === 0) {
    return null;
  }

  const freeShippingDiff = FREE_SHIPPING_THRESHOLD - discountedSubtotal;

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      toast.error("Please enter a coupon code");
      return;
    }
    setCouponLoading(true);
    try {
      const res = await validateCartCoupon({ code, items });
      if (!res.success || !res.coupon) {
        toast.error(res.message || "Invalid coupon code");
        return;
      }
      setAppliedCoupon({
        ...res.coupon,
        discount: res.discount,
      });
      toast.success(res.message || `Coupon ${res.coupon.code} applied!`);
    } catch {
      toast.error("Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponInput("");
    setAppliedCoupon(null);
    toast.success("Coupon removed");
  };

  return (
    <div className="rounded-xl border border-gray-200/90 bg-white p-5 sm:p-6 shadow-sm">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xl font-bold text-[#333333]">Order Summary</h2>
        <span className="text-xs text-gray-500 font-medium">
          {totalPacks} {totalPacks === 1 ? "pack" : "packs"}
        </span>
      </div>

      {/* 📦 Order Items with Size and Quantity Details */}
      {items.length > 0 && (
        <div className="mb-5 rounded-xl border border-gray-200/80 bg-gray-50/70 p-3 sm:p-3.5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
              Items in this order ({totalPacks})
            </span>
          </div>

          <div className="divide-y divide-gray-200/70 max-h-56 overflow-y-auto pr-1">
            {items.map((item: any, idx: number) => {
              const cleanTitle = getCleanProductTitle(item);
              const badge = getCartItemVariantBadge(item) || item.variantName;
              const qty = Number(item.quantity || 1);
              const unitPrice = Number(item.price || 0);
              const lineTotal = unitPrice * qty;
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
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-gray-900">
                      ₹{lineTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Free delivery callout */}
      {discountedSubtotal < FREE_SHIPPING_THRESHOLD ? (
        <div className="mb-5 rounded-xl border border-[#016271]/20 bg-[#E2F4F7]/40 p-3 text-xs sm:text-sm text-[#016271]">
          <div className="flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1.5">
              <Truck className="h-4 w-4 shrink-0" />
              Add ₹{Math.ceil(freeShippingDiff)} more for free delivery
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-[#016271] transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.round((discountedSubtotal / FREE_SHIPPING_THRESHOLD) * 100))}%`,
              }}
            />
          </div>
        </div>
      ) : (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs sm:text-sm font-semibold text-emerald-800">
          <span>🎉</span>
          <span>You&apos;ve unlocked <strong>FREE delivery</strong>!</span>
        </div>
      )}

      {/* 🎟️ Coupon Box in Cart */}
      <div className="mb-5 space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (!appliedCoupon) handleApplyCoupon();
                }
              }}
              placeholder="Enter coupon code"
              className="h-10 pl-9 uppercase font-mono tracking-wider text-xs sm:text-sm"
              disabled={couponLoading || Boolean(appliedCoupon)}
            />
          </div>

          {appliedCoupon ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleRemoveCoupon}
              disabled={couponLoading}
              className="h-10 px-3 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
            >
              Remove
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleApplyCoupon}
              disabled={couponLoading || !couponInput.trim()}
              className="h-10 px-4 text-xs font-bold bg-[#016271] hover:bg-[#014d59] text-white"
            >
              {couponLoading ? "Checking..." : "Apply"}
            </Button>
          )}
        </div>

        {appliedCoupon && discount > 0 && (
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-800 flex items-center justify-between">
            <span>
              Coupon <strong>{appliedCoupon.code}</strong> applied! You saved ₹{discount.toFixed(2)}.
            </span>
          </div>
        )}

        {appliedCoupon &&
        Number(appliedCoupon.minimumOrderValue || 0) > 0 &&
        subtotal < Number(appliedCoupon.minimumOrderValue) ? (
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
            Min order value of ₹{appliedCoupon.minimumOrderValue} required for {appliedCoupon.code}.
          </div>
        ) : null}
      </div>

      {/* 🎁 Gift Option in Cart */}
      <div className="mb-5 rounded-xl border border-[#9A5B90]/30 bg-gradient-to-r from-[#FAF0F6] to-[#F1F8F9] p-3.5 sm:p-4">
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

      <div className="space-y-3.5 border-b pb-5">
        <div className="flex justify-between text-sm text-[#666666]">
          <span>Subtotal</span>
          <span className="font-bold text-[#333333]">
            ₹{subtotal.toFixed(2)}
          </span>
        </div>

        {appliedCoupon && discount > 0 && (
          <>
            <div className="flex justify-between text-sm text-emerald-700">
              <span>Coupon Discount ({appliedCoupon.code})</span>
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
            {shipping === 0 && subtotal > 0
              ? "Free Delivery"
              : `₹${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between text-xs text-gray-500 pt-0.5">
          <span>Taxes</span>
          <span className="font-medium text-gray-600">Prices include GST</span>
        </div>
      </div>

      <div className="py-5">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-lg font-bold text-[#333333]">Total</span>
            <p className="text-[11px] font-medium text-gray-500">
              Prices include GST
            </p>
          </div>

          <span className="text-2xl font-black text-[#333333]">
            ₹{final.toFixed(2)}
          </span>
        </div>
      </div>

      <Button
        onClick={() => router.push("/checkout")}
        disabled={items.length === 0}
        className="h-13 w-full rounded-xl bg-[#016271] text-base sm:text-lg font-bold text-white shadow-md transition-all hover:bg-[#014d59] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
      >
        Checkout
      </Button>

      <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
        <ShieldCheck className="h-4 w-4 text-[#00A86B]" />
        Secure 256-bit encrypted checkout
      </div>
    </div>
  );
}
