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
import { toast } from "sonner";
import { INDIAN_STATES, validateAddress, AddressFormErrors } from "@/const/address";
import { AlertCircle } from "lucide-react";

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
    country: "India",
    isDefault: false,
  });
  const [errors, setErrors] = useState<AddressFormErrors>({});

  const handleInputChange = (field: string, value: string) => {
    let sanitized = value;
    if (field === "phone") {
      sanitized = value.replace(/\D/g, "").slice(0, 10);
    } else if (field === "pincode") {
      sanitized = value.replace(/\D/g, "").slice(0, 6);
    }

    setForm((prev) => ({
      ...prev,
      [field]: sanitized,
    }));

    if (errors[field as keyof AddressFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const saveAddress = async () => {
    const validation = validateAddress(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error("Please fill all required address details correctly");
      return;
    }

    try {
      setIsSaving(true);
      const res = await createUserAddress(form);

      if (!res.success) {
        toast.error("Failed to save address");
        console.error("Failed:", res.error);
        return;
      }

      toast.success("Address saved");
      router.push("/dashboard/address");
      router.refresh();
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="rounded-[20px] border-gray-200 bg-white p-6 sm:p-8 shadow-sm max-w-3xl mx-auto">
      <div className="mb-8 border-b border-gray-100 pb-4">
        <h3 className="text-lg font-bold text-[#2D3748]">
          Add New Address
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Provide your full delivery details for courier shipping
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="new-fullName" className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="new-fullName"
            name="fullName"
            value={form.fullName}
            placeholder="e.g. Priya Sharma"
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            className={`h-12 rounded-xl border-gray-200 ${
              errors.fullName ? "border-red-500 focus-visible:ring-red-400" : ""
            }`}
          />
          {errors.fullName && (
            <p className="flex items-center gap-1 text-xs text-red-500 font-medium">
              <AlertCircle className="h-3 w-3" />
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="new-phone" className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            Mobile Phone (10 digits) <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500">
              +91
            </span>
            <Input
              id="new-phone"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              name="phone"
              value={form.phone}
              placeholder="9876543210"
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={`h-12 pl-12 rounded-xl border-gray-200 font-medium ${
                errors.phone ? "border-red-500 focus-visible:ring-red-400" : ""
              }`}
            />
          </div>
          {errors.phone ? (
            <p className="flex items-center gap-1 text-xs text-red-500 font-medium">
              <AlertCircle className="h-3 w-3" />
              {errors.phone}
            </p>
          ) : (
            <p className="text-[11px] text-gray-400">Courier delivery contact number</p>
          )}
        </div>

        {/* Address / Street */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="new-street" className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            House / Flat No. &amp; Street <span className="text-red-500">*</span>
          </Label>
          <Input
            id="new-street"
            name="street"
            value={form.street}
            placeholder="Flat / House No., Building Name, Street address"
            onChange={(e) => handleInputChange("street", e.target.value)}
            className={`h-12 rounded-xl border-gray-200 ${
              errors.street ? "border-red-500 focus-visible:ring-red-400" : ""
            }`}
          />
          {errors.street && (
            <p className="flex items-center gap-1 text-xs text-red-500 font-medium">
              <AlertCircle className="h-3 w-3" />
              {errors.street}
            </p>
          )}
        </div>

        {/* Locality */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="new-locality" className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            Locality / Area / Landmark <span className="text-gray-400 font-normal lowercase">(optional)</span>
          </Label>
          <Input
            id="new-locality"
            name="locality"
            value={form.locality}
            placeholder="Sector, Landmark, or Colony"
            onChange={(e) => handleInputChange("locality", e.target.value)}
            className="h-12 rounded-xl border-gray-200"
          />
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="new-city" className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            City <span className="text-red-500">*</span>
          </Label>
          <Input
            id="new-city"
            name="city"
            value={form.city}
            placeholder="e.g. Bengaluru, Mumbai"
            onChange={(e) => handleInputChange("city", e.target.value)}
            className={`h-12 rounded-xl border-gray-200 ${
              errors.city ? "border-red-500 focus-visible:ring-red-400" : ""
            }`}
          />
          {errors.city && (
            <p className="flex items-center gap-1 text-xs text-red-500 font-medium">
              <AlertCircle className="h-3 w-3" />
              {errors.city}
            </p>
          )}
        </div>

        {/* State Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="new-state" className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            State <span className="text-red-500">*</span>
          </Label>
          <select
            id="new-state"
            name="state"
            value={form.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
            className={`h-12 w-full rounded-xl border bg-white px-3.5 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 ${
              errors.state
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-200 focus:border-[#016271] focus:ring-[#016271]/20"
            }`}
          >
            <option value="">Select State / UT</option>
            {INDIAN_STATES.map((stateName) => (
              <option key={stateName} value={stateName}>
                {stateName}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="flex items-center gap-1 text-xs text-red-500 font-medium">
              <AlertCircle className="h-3 w-3" />
              {errors.state}
            </p>
          )}
        </div>

        {/* PIN Code */}
        <div className="space-y-2">
          <Label htmlFor="new-pincode" className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            PIN Code (6 digits) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="new-pincode"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            name="pincode"
            value={form.pincode}
            placeholder="e.g. 560001"
            onChange={(e) => handleInputChange("pincode", e.target.value)}
            className={`h-12 rounded-xl border-gray-200 font-medium tracking-wide ${
              errors.pincode ? "border-red-500 focus-visible:ring-red-400" : ""
            }`}
          />
          {errors.pincode && (
            <p className="flex items-center gap-1 text-xs text-red-500 font-medium">
              <AlertCircle className="h-3 w-3" />
              {errors.pincode}
            </p>
          )}
        </div>

        {/* Country (Fixed to India) */}
        <div className="space-y-2">
          <Label htmlFor="new-country" className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            Country
          </Label>
          <Input
            id="new-country"
            name="country"
            value="India"
            disabled
            readOnly
            className="h-12 rounded-xl bg-gray-50 border-gray-200 font-medium text-gray-500 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="mb-8 flex items-center space-x-2.5">
        <Checkbox
          id="new-isDefault"
          checked={form.isDefault}
          onCheckedChange={(v) => setForm({ ...form, isDefault: Boolean(v) })}
        />
        <label htmlFor="new-isDefault" className="text-sm font-medium text-gray-600 cursor-pointer">
          Set as default shipping address
        </label>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={saveAddress}
          disabled={isSaving}
          className="h-14 flex-1 rounded-xl bg-[#016271] text-base font-bold text-white shadow-md hover:bg-[#014d59] active:scale-95 transition-all"
        >
          {isSaving ? "Saving Address..." : "Save Address"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
          className="h-14 flex-1 rounded-xl border-gray-300 text-base font-bold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Button>
      </div>
    </Card>
  );
};
