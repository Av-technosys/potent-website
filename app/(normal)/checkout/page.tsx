/* eslint-disable @typescript-eslint/no-explicit-any */


import { getAddresses } from "@/helper";
import { getCart } from "@/helper/cart/action";
import { redirect } from "next/navigation";
import CheckoutClient from "./checkoutClient";
import { CartInitializer } from "../cart/CartInitializer";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({ searchParams }: any) {
  const query = await searchParams;
  const redirectPath =
    query?.mode === "subscription"
      ? "/checkout?mode=subscription"
      : query?.mode === "direct"
        ? "/checkout?mode=direct"
        : "/checkout";
  let address: any[] = [];
  const cartRes = await getCart();

  try {
    address = await getAddresses();
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      redirect(`/login?redirect=${encodeURIComponent(redirectPath)}`);
    }

    throw error;
  }

  return (
    <div className="min-h-screen bg-[#FDFCF9]">
      <main className="container mx-auto px-4 py-10 md:px-16 lg:px-24">
        {/* Initialize store with server data */}
        <CartInitializer initialItems={cartRes.success && cartRes.items ? cartRes.items : []} />
        
        {/* ✅ Client wrapper handles state */}
        <CheckoutClient address={address} />

      </main>
    </div>
  );
}
