/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { deleteUserAddress, setDefaultAddress } from "@/helper";

export const AddressCard = ({ address }: { address: any }) => {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleDefault = async () => {
    setLoadingId(address.id);
    await setDefaultAddress(address.id);
    router.refresh();
    setLoadingId(null);
  };

  const handleDelete = async () => {
    setLoadingId(address.id);
    await deleteUserAddress(address.id);
    router.refresh();
    setLoadingId(null);
  };
  return (
    <Card className="rounded-md border border-transparent bg-white p-6 shadow-sm transition-all hover:border-pink-100">
      {/* Default Badge only */}
      {address.isDefault && (
        <Badge className="mb-4 bg-[#016271] text-white">Default Address</Badge>
      )}

      <div className="mb-6 space-y-1">
        <h3 className="text-[18px] font-bold text-[#2D3748]">
          {address.fullName}
        </h3>

        <p className="text-[14px] font-medium text-gray-400">{address.phone}</p>

        <p className="text-[14px] text-gray-400">
          {address.street}, {address.locality}, {address.city}, {address.state},{" "}
          {address.pincode}
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/edit-address/${address.id}`)}
          className="flex-1"
        >
          Edit
        </Button>

        {!address.isDefault && (
          <>
            <Button
              variant="outline"
              onClick={handleDefault}
              disabled={loadingId === address.id}
            >
              {loadingId === address.id ? "Setting..." : "Set Default"}
            </Button>

            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={loadingId === address.id}
            >
              <IconTrash size={20} />
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};
