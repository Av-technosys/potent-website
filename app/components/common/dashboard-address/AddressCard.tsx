/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { deleteUserAddress, setDefaultAddress } from "@/helper";
import { Phone, MapPin, User, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export const AddressCard = ({ address }: { address: any }) => {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleDefault = async () => {
    setLoadingId(address.id);
    try {
      await setDefaultAddress(address.id);
      toast.success("Default address updated");
      router.refresh();
    } catch (err) {
      console.error("Failed to set default address:", err);
      toast.error("Failed to set default address");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }
    setLoadingId(address.id);
    try {
      await deleteUserAddress(address.id);
      toast.success("Address deleted");
      router.refresh();
    } catch (err) {
      console.error("Failed to delete address:", err);
      toast.error("Failed to delete address");
    } finally {
      setLoadingId(null);
    }
  };

  const recipientName = address.fullName || "Customer";
  const recipientPhone = address.phone || "";
  const streetLine = address.street ?? address.streetAddress1 ?? "";
  const localityLine = address.locality ?? address.streetAddress2 ?? "";

  return (
    <Card className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-[#016271]/40 hover:shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          {address.isDefault ? (
            <Badge className="bg-[#016271] text-white hover:bg-[#016271] px-3 py-1 text-xs flex items-center gap-1.5 font-semibold">
              <CheckCircle className="h-3.5 w-3.5" />
              Default Address
            </Badge>
          ) : (
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Saved Address
            </span>
          )}
        </div>

        <div className="mb-6 space-y-2.5">
          <h3 className="text-lg font-bold text-[#2D3748] flex items-center gap-2">
            <User className="h-4 w-4 text-[#016271]" />
            {recipientName}
          </h3>

          {recipientPhone && (
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>Courier Contact: +91 {recipientPhone}</span>
            </p>
          )}

          <p className="text-sm text-gray-600 flex items-start gap-2 leading-relaxed">
            <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
            <span>
              {streetLine}
              {localityLine ? `, ${localityLine}` : ""}, {address.city},{" "}
              {address.state} - <strong className="font-semibold text-gray-800">{address.pincode}</strong>, India
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/edit-address/${address.id}`)}
          className="flex-1 rounded-xl border-gray-300 font-semibold text-gray-700 hover:border-[#016271] hover:text-[#016271]"
        >
          Edit
        </Button>

        {!address.isDefault && (
          <>
            <Button
              variant="outline"
              onClick={handleDefault}
              disabled={loadingId === address.id}
              className="rounded-xl border-gray-300 text-xs font-semibold text-gray-600 hover:border-[#016271] hover:text-[#016271]"
            >
              {loadingId === address.id ? "Setting..." : "Set Default"}
            </Button>

            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={loadingId === address.id}
              className="rounded-xl border-gray-300 text-gray-400 hover:border-red-500 hover:text-red-600 hover:bg-red-50"
              title="Delete Address"
            >
              <IconTrash size={18} />
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};
