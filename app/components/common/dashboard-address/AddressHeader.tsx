"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export const AddressHeader = () => {
  const router = useRouter();

  return (
    <Card className="mb-6 flex justify-between rounded-[15px] border-none bg-white p-6 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-[18px] font-bold text-[#333333]">Address Book</h2>

        <p className="text-[13px] font-medium text-gray-500">
          Manage your delivery addresses
        </p>
      </div>

      <Button
        onClick={() => router.push("/dashboard/new-address")}
        className="flex h-10 items-center gap-2 rounded-lg bg-[#016271] px-5 py-2 text-[14px] font-semibold text-white hover:bg-[#016271]"
      >
        <IconPlus size={18} />
        Add New Address
      </Button>
    </Card>
  );
};
