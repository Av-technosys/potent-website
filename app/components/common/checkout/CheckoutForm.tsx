/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { createUserAddress, updateUserAddress, deleteUserAddress } from "@/helper";
import { useState } from "react";
import { toast } from "sonner";
import { INDIAN_STATES, validateAddress, AddressFormErrors } from "@/const/address";
import { Trash2, Edit3, Plus, Phone, MapPin, User, AlertCircle } from "lucide-react";

const emptyAddressForm = {
  fullName: "",
  phone: "",
  street: "",
  locality: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  isDefault: true,
};

const CheckoutForm = ({ selected, setSelected, address, setAddress }: any) => {
  const [showAddressForm, setShowAddressForm] = useState(address.length === 0);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyAddressForm);
  const [errors, setErrors] = useState<AddressFormErrors>({});

  const handleInputChange = (field: string, value: string) => {
    let sanitized = value;
    if (field === "phone") {
      sanitized = value.replace(/\D/g, "").slice(0, 10);
    } else if (field === "pincode") {
      sanitized = value.replace(/\D/g, "").slice(0, 6);
    }

    setForm((current) => ({
      ...current,
      [field]: sanitized,
    }));

    if (errors[field as keyof AddressFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleStartAddNew = () => {
    setForm({
      ...emptyAddressForm,
      isDefault: address.length === 0,
    });
    setEditingAddressId(null);
    setErrors({});
    setShowAddressForm(true);
  };

  const handleStartEdit = (item: any) => {
    setForm({
      fullName: item.fullName || "",
      phone: (item.phone || "").replace(/\D/g, "").slice(0, 10),
      street: item.street ?? item.streetAddress1 ?? "",
      locality: item.locality ?? item.streetAddress2 ?? "",
      city: item.city || "",
      state: item.state || "",
      pincode: (item.pincode || "").replace(/\D/g, "").slice(0, 6),
      country: "India",
      isDefault: Boolean(item.isDefault),
    });
    setEditingAddressId(item.id);
    setErrors({});
    setShowAddressForm(true);
  };

  const handleCancelForm = () => {
    setForm(emptyAddressForm);
    setEditingAddressId(null);
    setErrors({});
    if (address.length > 0) {
      setShowAddressForm(false);
    }
  };

  const saveAddress = async () => {
    const validation = validateAddress(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error("Please fill all required address details correctly");
      return;
    }

    setIsSaving(true);
    try {
      if (editingAddressId) {
        // Update existing address
        const res = await updateUserAddress({
          ...form,
          id: editingAddressId,
        });

        if (!res.success) {
          toast.error("Failed to update address");
          return;
        }

        const updatedData = res.data || {
          id: editingAddressId,
          ...form,
          streetAddress1: form.street,
          streetAddress2: form.locality,
        };

        setAddress((current: any[]) => {
          return current.map((item) => {
            if (Number(item.id) === Number(editingAddressId)) {
              return {
                ...item,
                ...updatedData,
                isDefault: form.isDefault,
              };
            }
            if (form.isDefault) {
              return { ...item, isDefault: false };
            }
            return item;
          });
        });

        setSelected(String(editingAddressId));
        toast.success("Address saved");
        setShowAddressForm(false);
        setEditingAddressId(null);
        setForm(emptyAddressForm);
        setErrors({});
      } else {
        // Create new address
        const res = await createUserAddress(form);

        if (!res.success || !res.data) {
          toast.error("Failed to save address");
          return;
        }

        const savedAddress = {
          ...res.data,
          street: res.data.streetAddress1 || form.street,
          locality: res.data.streetAddress2 || form.locality,
          fullName: res.data.fullName || form.fullName,
          phone: res.data.phone || form.phone,
        };

        setAddress((current: any[]) => {
          const normalized = form.isDefault
            ? current.map((item) => ({ ...item, isDefault: false }))
            : current;

          return [...normalized, savedAddress];
        });

        setSelected(String(res.data.id));
        toast.success("Address saved");
        setShowAddressForm(false);
        setEditingAddressId(null);
        setForm(emptyAddressForm);
        setErrors({});
      }
    } catch (error) {
      console.error("Checkout address save failed:", error);
      toast.error("Failed to save address");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    setDeletingId(addressId);
    try {
      await deleteUserAddress(addressId);
      const remaining = address.filter((a: any) => Number(a.id) !== Number(addressId));
      setAddress(remaining);

      // If deleted address was selected, select default or first remaining
      if (String(selected) === String(addressId)) {
        const nextDefault = remaining.find((a: any) => a.isDefault) || remaining[0];
        setSelected(nextDefault ? String(nextDefault.id) : "");
      }

      // If no addresses left, open address form
      if (remaining.length === 0) {
        setShowAddressForm(true);
        setEditingAddressId(null);
      }

      toast.success("Address deleted");
    } catch (error) {
      console.error("Delete address failed:", error);
      toast.error("Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h2 className="text-xl font-bold text-[#1A150F]">Delivery Address</h2>
          <p className="text-xs text-gray-500">Select where you want your order delivered</p>
        </div>

        {address.length > 0 && !showAddressForm && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 rounded-lg border-[#016271] text-[#016271] hover:bg-[#E2F4F7]"
            onClick={handleStartAddNew}
          >
            <Plus className="h-4 w-4" />
            <span>Add New Address</span>
          </Button>
        )}
      </div>

      {/* Address List */}
      {!showAddressForm && address.length > 0 && (
        <RadioGroup
          value={selected ?? ""}
          onValueChange={setSelected}
          className="space-y-3.5"
        >
          {address.map((item: any) => {
            const addressId = String(item.id);
            const isActive = String(selected) === addressId;
            const recipientName = item.fullName || "Customer";
            const recipientPhone = item.phone || "";
            const streetLine = item.street ?? item.streetAddress1 ?? "";
            const localityLine = item.locality ?? item.streetAddress2 ?? "";

            return (
              <Card
                key={addressId}
                onClick={() => setSelected(addressId)}
                className={`cursor-pointer transition-all duration-200 border-2 ${
                  isActive
                    ? "border-[#016271] bg-[#F2F9FA] shadow-xs"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <RadioGroupItem
                        value={addressId}
                        id={addressId}
                        className="mt-1 shrink-0 text-[#016271]"
                      />

                      <Label
                        htmlFor={addressId}
                        className="flex flex-col items-start justify-start gap-1.5 cursor-pointer w-full text-left"
                      >
                        <div className="flex flex-wrap items-center justify-start gap-2 text-left">
                          <span className="flex items-center gap-1.5 font-bold text-gray-900 text-base">
                            <User className="h-4 w-4 text-gray-500" />
                            {recipientName}
                          </span>

                          {item.isDefault && (
                            <span className="rounded-full bg-[#016271]/10 px-2 py-0.5 text-xs font-semibold text-[#016271]">
                              Default
                            </span>
                          )}
                        </div>

                        {recipientPhone && (
                          <div className="flex items-center justify-start gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 text-left">
                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                            <span>Courier Contact: +91 {recipientPhone}</span>
                          </div>
                        )}

                        <div className="flex items-start justify-start gap-1.5 text-xs sm:text-sm text-gray-600 text-left">
                          <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                          <span>
                            {streetLine}
                            {localityLine ? `, ${localityLine}` : ""}, {item.city},{" "}
                            {item.state} - <strong className="font-semibold">{item.pincode}</strong>
                          </span>
                        </div>
                      </Label>
                    </div>

                    {/* Actions: Edit & Delete */}
                    <div className="flex items-center gap-1 shrink-0 pt-0.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(item);
                        }}
                        className="h-8 px-2.5 text-xs text-gray-600 hover:text-[#016271] hover:bg-[#E2F4F7]"
                      >
                        <Edit3 className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={deletingId === Number(item.id)}
                        onClick={(e) => handleDeleteAddress(Number(item.id), e)}
                        className="h-8 px-2 text-xs text-gray-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete Address"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </RadioGroup>
      )}

      {/* Address Add / Edit Form */}
      {(showAddressForm || address.length === 0) && (
        <Card className="border border-gray-200 bg-white shadow-sm rounded-2xl overflow-hidden">
          <div className="bg-[#FAF8F5] px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#1A150F]">
                {editingAddressId ? "Edit Shipping Address" : "Add Shipping Address"}
              </h3>
              <p className="text-xs text-gray-500">
                Please provide accurate details for smooth courier delivery
              </p>
            </div>
            {address.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancelForm}
                className="text-xs text-gray-500 hover:text-gray-900"
              >
                Cancel
              </Button>
            )}
          </div>

          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="checkout-fullName" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="checkout-fullName"
                  name="fullName"
                  value={form.fullName}
                  placeholder="e.g. Priya Sharma"
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className={`h-11 rounded-xl ${errors.fullName ? "border-red-500 focus-visible:ring-red-400" : ""}`}
                />
                {errors.fullName && (
                  <p className="flex items-center gap-1 text-xs text-red-500 font-medium">
                    <AlertCircle className="h-3 w-3" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="checkout-phone" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Mobile Number (10 digits) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500">
                    +91
                  </span>
                  <Input
                    id="checkout-phone"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    name="phone"
                    value={form.phone}
                    placeholder="9876543210"
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`h-11 pl-11 rounded-xl font-medium ${
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
                  <p className="text-[11px] text-gray-400">Required for courier delivery calls &amp; OTP</p>
                )}
              </div>

              {/* Street Address */}
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="checkout-street" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  House / Flat / Street <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="checkout-street"
                  name="street"
                  value={form.street}
                  placeholder="Flat / House No., Apartment, Street address"
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  className={`h-11 rounded-xl ${errors.street ? "border-red-500 focus-visible:ring-red-400" : ""}`}
                />
                {errors.street && (
                  <p className="flex items-center gap-1 text-xs text-red-500 font-medium">
                    <AlertCircle className="h-3 w-3" />
                    {errors.street}
                  </p>
                )}
              </div>

              {/* Locality */}
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="checkout-locality" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Locality / Landmark <span className="text-gray-400 font-normal lowercase">(optional)</span>
                </Label>
                <Input
                  id="checkout-locality"
                  name="locality"
                  value={form.locality}
                  placeholder="Nearby landmark, sector, or colony"
                  onChange={(e) => handleInputChange("locality", e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <Label htmlFor="checkout-city" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="checkout-city"
                  name="city"
                  value={form.city}
                  placeholder="e.g. Mumbai, New Delhi"
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className={`h-11 rounded-xl ${errors.city ? "border-red-500 focus-visible:ring-red-400" : ""}`}
                />
                {errors.city && (
                  <p className="flex items-center gap-1 text-xs text-red-500 font-medium">
                    <AlertCircle className="h-3 w-3" />
                    {errors.city}
                  </p>
                )}
              </div>

              {/* State Dropdown */}
              <div className="space-y-1.5">
                <Label htmlFor="checkout-state" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  State <span className="text-red-500">*</span>
                </Label>
                <select
                  id="checkout-state"
                  name="state"
                  value={form.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className={`h-11 w-full rounded-xl border bg-white px-3 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 ${
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
              <div className="space-y-1.5">
                <Label htmlFor="checkout-pincode" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  PIN Code (6 digits) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="checkout-pincode"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  name="pincode"
                  value={form.pincode}
                  placeholder="e.g. 400001"
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  className={`h-11 rounded-xl font-medium tracking-wide ${
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
              <div className="space-y-1.5">
                <Label htmlFor="checkout-country" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Country
                </Label>
                <Input
                  id="checkout-country"
                  name="country"
                  value="India"
                  disabled
                  readOnly
                  className="h-11 rounded-xl bg-gray-50 font-medium text-gray-500 cursor-not-allowed border-gray-200"
                />
              </div>
            </div>

            {/* Set as Default Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                id="checkout-isDefault"
                checked={form.isDefault}
                onCheckedChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    isDefault: Boolean(value),
                  }))
                }
              />
              <Label
                htmlFor="checkout-isDefault"
                className="text-xs font-medium text-gray-600 cursor-pointer"
              >
                Set as default shipping address
              </Label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-3 sm:flex-row">
              <Button
                type="button"
                onClick={saveAddress}
                disabled={isSaving}
                className="h-12 flex-1 rounded-xl bg-[#016271] font-bold text-white shadow-md hover:bg-[#014d59] active:scale-95 transition-all"
              >
                {isSaving ? "Saving Address..." : editingAddressId ? "Update & Use Address" : "Save & Use Address"}
              </Button>

              {address.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelForm}
                  disabled={isSaving}
                  className="h-12 rounded-xl border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 sm:px-8"
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CheckoutForm;
