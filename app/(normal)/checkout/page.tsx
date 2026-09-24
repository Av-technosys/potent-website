/* eslint-disable @typescript-eslint/no-explicit-any */


import { getAddresses } from "@/helper";
import { redirect } from "next/navigation";
import CheckoutClient from "./checkoutClient";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({ searchParams }: any) {
  const query = await searchParams;
  const redirectPath =
    query?.mode === "subscription" ? "/checkout?mode=subscription" : "/checkout";
  let address: any[] = [];

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
        
        {/* ✅ Client wrapper handles state */}
        <CheckoutClient address={address} />

      </main>
    </div>
  );
}
