"use client";

import { useState, useEffect } from "react";
import CheckoutForm from "../../components/common/checkout/CheckoutForm";
import { CheckoutSummary } from "../../components/common/checkout/CheckoutSummary";

export default function CheckoutClient({ address }: any) {
  const [addresses, setAddresses] = useState<any[]>(address ?? []);
  const [selected, setSelected] = useState<string>("");
  const [subscriptionCheckout, setSubscriptionCheckout] = useState<any>(null);
  const [checkoutMode, setCheckoutMode] = useState<
    "loading" | "cart" | "subscription"
  >("loading");

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
    if (params.get("mode") !== "subscription") {
      setCheckoutMode("cart");
      return;
    }

    setCheckoutMode("subscription");

    const pendingCheckout = window.sessionStorage.getItem(
      "potent-subscription-checkout",
    );

    if (!pendingCheckout) return;

    try {
      setSubscriptionCheckout(JSON.parse(pendingCheckout));
    } catch {
      window.sessionStorage.removeItem("potent-subscription-checkout");
    }
  }, []);

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
        />
      </div>

    </div>
  );
}
