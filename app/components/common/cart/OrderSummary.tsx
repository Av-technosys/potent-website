"use client";

import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

export function OrderSummary() {
  const router = useRouter();

  // ✅ Zustand state
  const items = useCartStore((state) => state.items);

  // ✅ Derived calculations
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const shipping = subtotal > 599 ? 0 : 60;
  const final = subtotal + shipping;

  return (
    <div className="rounded-md border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-[#333333]">Order Summary</h2>

      <div className="space-y-4 border-b pb-6">
        <div className="flex justify-between text-sm text-[#666666]">
          <span>Subtotal</span>
          <span className="font-bold text-[#333333]">
            ₹{subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-sm text-[#666666]">
          <span>Shipping</span>
          <span className="font-bold text-[#333333]">
            ₹{shipping.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="py-6">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-[#333333]">Total</span>

          <span className="text-2xl font-black text-[#333333]">
            ₹{final.toFixed(2)}
          </span>
        </div>
      </div>

      <Button
        onClick={() => router.push("/checkout")}
        disabled={items.length === 0}
        className="h-14 w-full rounded-xl bg-[#016271] text-lg font-bold disabled:opacity-50"
      >
        Checkout
      </Button>

      <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-gray-400">
        <ShieldCheck className="h-4 w-4 text-[#00FF1E]" />
        Secure Checkout
      </div>
    </div>
  );
}
