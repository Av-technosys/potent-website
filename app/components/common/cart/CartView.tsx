"use client";

import { useCartStore } from "@/store/cartStore";
import { CartItems } from "./CartItems";
import { OrderSummary } from "./OrderSummary";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

export function CartView() {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#016271] border-t-transparent mx-auto" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl py-12 text-center">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#016271]/20 bg-white p-8 sm:p-12 shadow-xs">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#E2F4F7] text-[#016271]">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-[#1A150F]">Your bag is empty</h1>
          <p className="mb-6 max-w-sm text-sm text-gray-500">
            You don’t have any items in your bag yet. Explore our toxin-free period & hygiene care essentials.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#016271] px-8 py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-[#014d59] hover:shadow-lg active:scale-95"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:gap-10 lg:grid-cols-12 items-start">
      <div className="lg:col-span-8">
        <CartItems />
      </div>
      <div className="lg:col-span-4 lg:sticky lg:top-49">
        <OrderSummary />
      </div>
    </div>
  );
}
