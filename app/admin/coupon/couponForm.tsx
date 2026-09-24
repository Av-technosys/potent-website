/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createCoupon, updateCoupon } from "@/helper";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface CouponFormProps {
  couponInfo?: any;
}

const CouponForm = ({ couponInfo }: CouponFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [discountType, setDiscountType] = useState(
    couponInfo?.isDiscountPercentage ? "percentage" : "fixed",
  );
  const [useOnce, setUseOnce] = useState(Boolean(couponInfo?.useOnce));

  const isEdit = Boolean(couponInfo?.id);

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const isDiscountPercentage = discountType === "percentage";
    const couponData = {
      id: couponInfo?.id,
      name: formData.get("name"),
      description: formData.get("description"),
      code: formData.get("code"),
      isDiscountPercentage,
      discountPercentage: isDiscountPercentage
        ? formData.get("discountPercentage")
        : null,
      discountFixedAmount: isDiscountPercentage
        ? null
        : formData.get("discountFixedAmount"),
      minimumOrderValue: formData.get("minimumOrderValue"),
      maximumDiscountAmount: formData.get("maximumDiscountAmount"),
      useOnce,
    };

    startTransition(async () => {
      const response = isEdit
        ? await updateCoupon(couponData)
        : await createCoupon(couponData);

      if (response?.success === true) {
        toast.success(response.message);
        router.push("/admin/coupon");
      } else {
        toast.error(response?.message ?? "Failed to save coupon");
      }
    });
  };

  return (
    <div className="w-full p-1">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-900">
            {isEdit ? "Manage Coupon" : "Add Coupon"}
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Configure discount codes and order limits.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submitHandler}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-slate-600 font-medium">
                    Coupon Name
                  </Label>
                  <Input
                    name="name"
                    defaultValue={couponInfo?.name ?? ""}
                    maxLength={20}
                    placeholder="Enter coupon name"
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-slate-600 font-medium">
                    Coupon Code
                  </Label>
                  <Input
                    name="code"
                    defaultValue={couponInfo?.code ?? ""}
                    maxLength={20}
                    placeholder="SAVE20"
                    className="h-11 uppercase"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-slate-600 font-medium">
                    Description
                  </Label>
                  <Textarea
                    name="description"
                    defaultValue={couponInfo?.description ?? ""}
                    maxLength={100}
                    placeholder="Enter description"
                    className="min-h-[130px] resize-none"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-slate-600 font-medium">
                    Discount Type
                  </Label>
                  <Select value={discountType} onValueChange={setDiscountType}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {discountType === "percentage" ? (
                  <div className="space-y-3">
                    <Label className="text-slate-600 font-medium">
                      Discount Percentage
                    </Label>
                    <Input
                      name="discountPercentage"
                      type="number"
                      min={1}
                      max={100}
                      defaultValue={couponInfo?.discountPercentage ?? ""}
                      placeholder="10"
                      className="h-11"
                      required
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Label className="text-slate-600 font-medium">
                      Fixed Discount Amount
                    </Label>
                    <Input
                      name="discountFixedAmount"
                      type="number"
                      min={1}
                      defaultValue={couponInfo?.discountFixedAmount ?? ""}
                      placeholder="100"
                      className="h-11"
                      required
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-slate-600 font-medium">
                      Minimum Order Value
                    </Label>
                    <Input
                      name="minimumOrderValue"
                      type="number"
                      min={0}
                      defaultValue={couponInfo?.minimumOrderValue ?? 0}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-slate-600 font-medium">
                      Maximum Discount Amount
                    </Label>
                    <Input
                      name="maximumDiscountAmount"
                      type="number"
                      min={0}
                      defaultValue={couponInfo?.maximumDiscountAmount ?? 0}
                      className="h-11"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 rounded-md border p-4">
                  <Checkbox
                    checked={useOnce}
                    onCheckedChange={(checked) => setUseOnce(checked === true)}
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Use once per customer
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4 px-0 pt-10">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/coupon")}
                className="px-12 h-11 rounded-full"
                disabled={isPending}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="px-12 h-11 rounded-full bg-[#2D5A5D] hover:bg-[#234749] text-white"
                disabled={isPending}
              >
                {isPending ? "Saving..." : isEdit ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CouponForm;
