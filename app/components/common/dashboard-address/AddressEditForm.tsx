/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { updateUserAddress } from "@/helper";

export const AddressEditForm = ({ address }: any) => {
  const router = useRouter();

  const [form, setForm] = useState(address);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateAddress = async () => {
    try {
      setIsSaving(true);

      await updateUserAddress(form);

      router.push("/dashboard/address");
      router.refresh();
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="rounded-[20px] border-gray-200 bg-white p-8 shadow-sm">
      <h3 className="mb-8 text-[14px] font-bold tracking-widest text-[#2D3748] uppercase">
        Edit Address
      </h3>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-[12px] font-bold text-gray-400 uppercase">
            Full Name
          </Label>
          <Input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="h-12 rounded-xl border-gray-200"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[12px] font-bold text-gray-400 uppercase">
            Phone
          </Label>
          <Input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="h-12 rounded-xl border-gray-200"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-[12px] font-bold text-gray-400 uppercase">
            Address / Street
          </Label>
          <Input
            name="street"
            value={form.street}
            onChange={handleChange}
            className="h-12 rounded-xl border-gray-200"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-[12px] font-bold text-gray-400 uppercase">
            Locality
          </Label>
          <Input
            name="locality"
            value={form.locality}
            onChange={handleChange}
            className="h-12 rounded-xl border-gray-200"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[12px] font-bold text-gray-400 uppercase">
            City
          </Label>
          <Input
            name="city"
            value={form.city}
            onChange={handleChange}
            className="h-12 rounded-xl border-gray-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[12px] font-bold text-gray-400 uppercase">
              State
            </Label>
            <Input
              name="state"
              value={form.state}
              onChange={handleChange}
              className="h-12 rounded-xl border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[12px] font-bold text-gray-400 uppercase">
              Pincode
            </Label>
            <Input
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              className="h-12 rounded-xl border-gray-200"
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-[12px] font-bold text-gray-400 uppercase">
            Country
          </Label>
          <Input
            name="country"
            value={form.country}
            onChange={handleChange}
            className="h-12 rounded-xl border-gray-200"
          />
        </div>
      </div>

      <div className="mb-8 flex items-center space-x-2">
        <Checkbox
          checked={form.isDefault}
          onCheckedChange={(v) => setForm({ ...form, isDefault: Boolean(v) })}
        />

        {/* <label className="text-[13px] text-gray-500 font-medium">
Set as default shipping address
</label> */}
      </div>

      <div className="flex gap-4">
        <Button
          onClick={updateAddress}
          disabled={isSaving}
          className="h-14 flex-1 rounded-xl bg-[#016271] text-lg font-bold"
        >
          {isSaving ? "Updating..." : "Update Address"}
        </Button>

        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/address")}
          className="h-14 flex-1 rounded-xl border-[#016271] text-lg font-bold text-[#016271]"
        >
          Cancel
        </Button>
      </div>
    </Card>
  );
};
