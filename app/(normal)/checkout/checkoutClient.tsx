"use client";

import { useState, useEffect } from "react";
import CheckoutForm from "../../components/common/checkout/CheckoutForm";
import { CheckoutSummary } from "../../components/common/checkout/CheckoutSummary";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function CheckoutClient({ address }: any) {
  const [addresses, setAddresses] = useState<any[]>(address ?? []);
  const [selected, setSelected] = useState<string>("");
  const [subscriptionCheckout, setSubscriptionCheckout] = useState<any>(null);
  const [directCheckoutItem, setDirectCheckoutItem] = useState<any>(null);
  const [checkoutMode, setCheckoutMode] = useState<
    "loading" | "cart" | "subscription" | "direct"
  >("loading");
  const [mounted, setMounted] = useState(false);

  const cartItems = useCartStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Auto select default / first address
  useEffect(() => {
    setAddresses(address ?? []);
  }, [address]);

  useEffect(() => {
    if (addresses?.length > 0 && !selected) {
      const defaultAddress =
        addresses.find((a: any) => a.isDefault) || addresses[0];

      if (defaultAddress) {
        setSelected(String(defaultAddress.id));
      }
    }
  }, [addresses, selected]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");

    if (mode === "subscription") {
      setCheckoutMode("subscription");
      const pendingCheckout = window.sessionStorage.getItem(
        "potent-subscription-checkout",
      );
      if (pendingCheckout) {
        try {
          setSubscriptionCheckout(JSON.parse(pendingCheckout));
        } catch {
          window.sessionStorage.removeItem("potent-subscription-checkout");
        }
      }
      return;
    }

    if (mode === "direct") {
      setCheckoutMode("direct");
      const pendingDirect = window.sessionStorage.getItem(
        "potent-direct-checkout",
      );
      if (pendingDirect) {
        try {
          setDirectCheckoutItem(JSON.parse(pendingDirect));
        } catch {
          window.sessionStorage.removeItem("potent-direct-checkout");
        }
      }
      return;
    }

    setCheckoutMode("cart");
  }, []);

  if (!mounted || checkoutMode === "loading") {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#016271] border-t-transparent mx-auto" />
      </div>
    );
  }

  if (checkoutMode === "cart" && cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-xl py-12 text-center">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#016271]/20 bg-white p-8 sm:p-12 shadow-xs">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#E2F4F7] text-[#016271]">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-[#1A150F]">Your bag is empty</h1>
          <p className="mb-6 max-w-sm text-sm text-gray-500">
            You don’t have any items in your bag yet. Please add items to your bag before proceeding to checkout.
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

  if (checkoutMode === "subscription" && !subscriptionCheckout) {
    return (
      <div className="mx-auto max-w-xl py-12 text-center">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#016271]/20 bg-white p-8 sm:p-12 shadow-xs">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#E2F4F7] text-[#016271]">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-[#1A150F]">Your bag is empty</h1>
          <p className="mb-6 max-w-sm text-sm text-gray-500">
            No active subscription item found. Explore our toxin-free period & hygiene care essentials.
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

  if (checkoutMode === "direct" && !directCheckoutItem) {
    return (
      <div className="mx-auto max-w-xl py-12 text-center">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#016271]/20 bg-white p-8 sm:p-12 shadow-xs">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#E2F4F7] text-[#016271]">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-[#1A150F]">Your bag is empty</h1>
          <p className="mb-6 max-w-sm text-sm text-gray-500">
            No item selected for checkout. Explore our toxin-free period &amp; hygiene care essentials.
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
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
      
      <div className="lg:col-span-8">
        <CheckoutForm
          address={addresses}
          selected={selected}
          setSelected={setSelected}
          setAddress={setAddresses}
        />
      </div>

      <div className="lg:col-span-4 lg:sticky lg:top-24">
        <CheckoutSummary
          address={addresses}
          selected={selected}
          checkoutMode={checkoutMode}
          subscriptionCheckout={subscriptionCheckout}
          directCheckoutItem={directCheckoutItem}
        />
      </div>

    </div>
  );
}
