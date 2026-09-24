/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddressCard } from "@/app/components/common/dashboard-address/AddressCard";
import { AddressHeader } from "@/app/components/common/dashboard-address/AddressHeader";
import { getAddresses } from "@/helper/";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AddressPage() {
  let addresses: any[] = [];

  try {
    const data = await getAddresses();
    addresses = data || [];
  } catch (error) {
    console.error("Failed to fetch addresses:", error);
    addresses = [];
  }

  if (addresses.length === 0) {
    return (
      <div className="space-y-4 p-6 text-center">
        <p>No addresses found 📭</p>

        <Link href="/dashboard/new-address">
          <Button className="bg-[#016271] text-white">+ Add Address</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <AddressHeader />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {addresses.map((item: any) => (
          <AddressCard key={item.id} address={item} />
        ))}
      </div>
    </div>
  );
}
