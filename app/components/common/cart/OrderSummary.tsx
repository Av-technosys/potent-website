"use client";

import { ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import {
  calculateShippingFee,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/shippingConfig";

export function OrderSummary() {
  const router = useRouter();

  // ✅ Zustand state
  const items = useCartStore((state) => state.items);

  // ✅ Derived calculations
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const totalPacks = items.reduce(
    (acc, item) => acc + Number(item.quantity || 1),
    0,
  );

  const shipping = items.length === 0 ? 0 : calculateShippingFee(subtotal);
  const final = items.length === 0 ? 0 : subtotal + shipping;

  if (items.length === 0) {
    return null;
  }

  const freeShippingDiff = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="rounded-xl border border-gray-200/90 bg-white p-5 sm:p-6 shadow-sm">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xl font-bold text-[#333333]">Order Summary</h2>
        <span className="text-xs text-gray-500 font-medium">
          {totalPacks} {totalPacks === 1 ? "pack" : "packs"}
        </span>
      </div>

      {/* Free delivery callout */}
      {subtotal < FREE_SHIPPING_THRESHOLD ? (
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
                width: `${Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100))}%`,
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

      <div className="space-y-3.5 border-b pb-5">
        <div className="flex justify-between text-sm text-[#666666]">
          <span>Subtotal</span>
          <span className="font-bold text-[#333333]">
            ₹{subtotal.toFixed(2)}
          </span>
        </div>

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
