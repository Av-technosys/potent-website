"use client";

import { AddressNewForm } from "@/app/components/common/dashboard-address/AddressNewForm";
import { useRouter } from "next/navigation";

export default function NewAddressPage() {

  const router = useRouter();

  return (
    <div className="p-6">
      <AddressNewForm onCancel={() => router.push("/dashboard/address")} />
    </div>
  );
}