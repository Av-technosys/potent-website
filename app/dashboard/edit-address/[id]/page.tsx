/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AddressEditForm } from "@/app/components/common/dashboard-address/AddressEditForm";
import { getUserAddressById } from "@/helper";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function EditAddressPage() {
  const params = useParams();
  const addressId = Number(params.id);

  const [address, setAddress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const data = await getUserAddressById(addressId);
        setAddress(data);
      } catch (error) {
        console.error("Failed to fetch address:", error);
        setAddress(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (addressId) fetchAddress();
  }, [addressId]);

  if (isLoading) {
    return (
      <div className="p-6">
        <Card className="p-8 border-gray-200 shadow-sm bg-white rounded-[20px] space-y-6">
          {/* Title */}
          <Skeleton className="h-4 w-40 bg-gray-300" />

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 bg-gray-300" />
              <Skeleton className="h-12 w-full rounded-xl bg-gray-200" />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 bg-gray-300" />
              <Skeleton className="h-12 w-full rounded-xl bg-gray-200" />
            </div>

            {/* Street */}
            <div className="md:col-span-2 space-y-2">
              <Skeleton className="h-3 w-32 bg-gray-300" />
              <Skeleton className="h-12 w-full rounded-xl bg-gray-200" />
            </div>

            {/* Locality */}
            <div className="md:col-span-2 space-y-2">
              <Skeleton className="h-3 w-32 bg-gray-300" />
              <Skeleton className="h-12 w-full rounded-xl bg-gray-200" />
            </div>

            {/* City */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-20 bg-gray-300" />
              <Skeleton className="h-12 w-full rounded-xl bg-gray-200" />
            </div>

            {/* State + Pincode */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16 bg-gray-300" />
                <Skeleton className="h-12 w-full rounded-xl bg-gray-200" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-20 bg-gray-300" />
                <Skeleton className="h-12 w-full rounded-xl bg-gray-200" />
              </div>
            </div>

            {/* Country */}
            <div className="md:col-span-2 space-y-2">
              <Skeleton className="h-3 w-24 bg-gray-300" />
              <Skeleton className="h-12 w-full rounded-xl bg-gray-200" />
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded bg-gray-300" />
            <Skeleton className="h-4 w-48 bg-gray-200" />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Skeleton className="h-14 w-full rounded-xl bg-gray-300" />
            <Skeleton className="h-14 w-full rounded-xl bg-gray-200" />
          </div>
        </Card>
      </div>
    );
  }

  if (!address) {
    return <div className="p-6">Address Not Found 🚫</div>;
  }

  return (
    <div className="p-6">
      <AddressEditForm address={address} />
    </div>
  );
}
