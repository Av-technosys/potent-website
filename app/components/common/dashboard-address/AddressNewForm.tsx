/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createUserAddress } from "@/helper";
import { useRouter } from "next/navigation";

export const AddressNewForm = ({ onCancel }: { onCancel: () => void }) => {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    locality: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    userId: "",
    isDefault: false,
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveAddress = async () => {
    try {
      setIsSaving(true);

      const res = await createUserAddress(form);

      if (!res.success) {
        console.error("Failed:", res.error);
        return;
      }

      router.push("/dashboard/address");
      router.refresh();
    } catch (error) {
      console.error("Error saving address:", error);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <Card className="rounded-[20px] border-gray-200 bg-white p-8 shadow-sm">
      <h3 className="mb-8 text-[14px] font-bold tracking-widest text-[#2D3748] uppercase">
        Add Address
      </h3>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-[12px] font-bold text-gray-400 uppercase">
            Full Name
          </Label>
          <Input
            name="fullName"
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
            onChange={handleChange}
            className="h-12 rounded-xl border-gray-200"
          />
        </div>
      </div>

      <div className="mb-8 flex items-center space-x-2">
        <Checkbox
          onCheckedChange={(v) => setForm({ ...form, isDefault: Boolean(v) })}
        />

        <label className="text-[13px] font-medium text-gray-500">
          Set as default shipping address
        </label>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={saveAddress}
          disabled={isSaving}
          className="h-14 flex-1 rounded-xl bg-[#016271] text-lg font-bold"
        >
          {isSaving ? "Saving..." : "Save Address"}
        </Button>

        <Button
          variant="outline"
          onClick={onCancel}
          className="h-14 flex-1 rounded-xl border-[#016271] text-lg font-bold text-[#016271]"
        >
          Cancel
        </Button>
      </div>
    </Card>
  );
};
