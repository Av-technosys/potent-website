/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { createUserAddress } from "@/helper";
import { useState } from "react";
import { toast } from "sonner";

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
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState(emptyAddressForm);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const saveAddress = async () => {
    const requiredFields = ["street", "city", "state", "pincode", "country"];
    const missingField = requiredFields.find(
      (field) => !String((form as any)[field] || "").trim(),
    );

    if (missingField) {
      toast.error("Please complete the shipping address");
      return;
    }

    setIsSaving(true);
    try {
      const res = await createUserAddress(form);

      if (!res.success || !res.data) {
        toast.error("Failed to save address");
        return;
      }

      const savedAddress = {
        ...res.data,
        street: res.data.streetAddress1,
        locality: res.data.streetAddress2,
      };

      setAddress((current: any[]) => {
        const normalized = form.isDefault
          ? current.map((item) => ({ ...item, isDefault: false }))
          : current;

        return [...normalized, savedAddress];
      });
      setSelected(String(res.data.id));
      setForm(emptyAddressForm);
      setShowAddressForm(false);
      toast.success("Address saved");
    } catch (error) {
      console.error("Checkout address save failed:", error);
      toast.error("Failed to save address");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="col-span-3 space-y-4 md:col-span-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Checkout</h2>

          {address.length > 0 && (
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-sm"
              onClick={() => setShowAddressForm(true)}
            >
              + Add New Address
            </Button>
          )}
        </div>

        <h3 className="text-sm font-semibold text-gray-700">
          Shipping Address
        </h3>

        <RadioGroup
          value={selected ?? ""}
          onValueChange={setSelected}
          className="space-y-3"
        >
          {address.length > 0 &&
            address.map((item: any) => {
              const addressId = String(item.id);
              const isActive = String(selected) === addressId;

              return (
                <Card
                  key={addressId}
                  className={`cursor-pointer border transition ${isActive ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                >
                  <CardContent className="flex items-start justify-between gap-3 p-4">
                    <div className="flex w-full items-start gap-3">
                      <RadioGroupItem
                        value={addressId}
                        id={addressId}
                        className="mt-1"
                      />

                      <Label
                        htmlFor={addressId}
                        className="flex w-full cursor-pointer flex-col items-start gap-1"
                      >
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">
                            {item.street ?? item.streetAddress1}
                          </p>

                          {item.isDefault && (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                              Default
                            </span>
                          )}

                          {!item.isDefault && (
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                              Saved
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600">
                          {item.locality ?? item.streetAddress2}
                        </p>

                        <p className="text-sm text-gray-500">
                          {item.city}, {item.state},{item.pincode}
                        </p>
                      </Label>
                    </div>

                    <Button variant="link" size="sm">
                      Edit
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
        </RadioGroup>

        {(showAddressForm || address.length === 0) && (
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardContent className="space-y-5 p-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Add Shipping Address
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  This address will be saved to your account for this purchase.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-500">
                    Full Name
                  </Label>
                  <Input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-500">
                    Phone
                  </Label>
                  <Input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-semibold text-gray-500">
                    Address / Street
                  </Label>
                  <Input
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-semibold text-gray-500">
                    Locality
                  </Label>
                  <Input
                    name="locality"
                    value={form.locality}
                    onChange={handleChange}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-500">
                    City
                  </Label>
                  <Input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-500">
                    State
                  </Label>
                  <Input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-500">
                    Pincode
                  </Label>
                  <Input
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-500">
                    Country
                  </Label>
                  <Input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={form.isDefault}
                  onCheckedChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      isDefault: Boolean(value),
                    }))
                  }
                />
                <span className="text-sm text-gray-600">
                  Set as default shipping address
                </span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  onClick={saveAddress}
                  disabled={isSaving}
                  className="h-12 flex-1 rounded-xl bg-[#016271] font-bold"
                >
                  {isSaving ? "Saving..." : "Save & Use Address"}
                </Button>

                {address.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddressForm(false)}
                    disabled={isSaving}
                    className="h-12 flex-1 rounded-xl"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default CheckoutForm;
