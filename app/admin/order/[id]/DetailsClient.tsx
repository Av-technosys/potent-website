/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";



import { CheckCircle2, Phone, Mail } from "lucide-react";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { updateOrderStatus } from "@/helper/index";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/imageUrl";
import { Select } from "@/components/select";
import { ORDER_STATUS_ITEMS } from "@/const/globalconst";
import { formatMixBoxRecipe } from "@/lib/mixYourBox";

export default function Details({ id, initialOrderInfo }: { id: string; initialOrderInfo: any }) {
  const [orderInfo, setOrderInfo] = useState<any>(initialOrderInfo);
  const [isPending, startTransition] = useTransition();
  

  const formatCurrency = (amount: number | null | undefined) =>
    `₹${Number(amount ?? 0).toLocaleString("en-IN")}`;

  const formatDate = (date: string | Date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const steps = [
    { label: "Order Confirmed", date: "Aug 16, 2023" },
    { label: "Order Shipped", date: "Aug 22, 2023" },
    { label: "Out for Delivery", date: "Aug 28, 2023" },
    { label: "Delivered", date: "Aug 28, 2023" },
  ];

  const handleStatusChange = (status: string | undefined) => {
    if (!status) return;

    startTransition(async () => {
      const updated = await updateOrderStatus(id, status);
      if (updated) {
        setOrderInfo((current: any) => ({
          ...current,
          order: {
            ...current.order,
            status: updated.status,
            updatedAt: updated.updatedAt,
          },
        }));
      }
    });
  };

  if (!orderInfo) {
    return (
      <div className="flex items-center justify-center h-[70vh] w-full">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">Loading order details...</p>
        </div>
      </div>
    );
  }

  const paymentMeta =
    typeof orderInfo?.payment?.paymentMeta === "object"
      ? orderInfo.payment.paymentMeta
      : null;
  const appliedCoupon = paymentMeta?.coupon;

  return (
    <div className={`w-full max-w-full mx-auto p-1 space-y-5 ${isPending ? "opacity-70" : ""}`}>
      {/* Top Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
        {/* Left Card: Timeline */}
        <Card className="md:col-span-5 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-md font-bold text-slate-900 tracking-tight">
              OrderId : #{orderInfo?.order?.id}
            </CardTitle>
            <p className="text-sm text-slate-500">
              Placed on {formatDate(orderInfo?.order?.createdAt)}
            </p>
            <div className="mt-4 max-w-56">
              <Select
                placeholder="Status"
                label="Order Status"
                value={orderInfo?.order?.status}
                selectItems={ORDER_STATUS_ITEMS}
                onValueChange={handleStatusChange}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-12">
            <div className="relative space-y-10 ml-1">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-4 relative items-start">
                  {/* Vertical Connector */}
                  {idx !== steps.length - 1 && (
                    <div className="absolute left-[11px] top-[24px] w-[2px] h-[calc(100%+12px)] bg-emerald-500" />
                  )}
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 bg-white z-10 shrink-0" />
                  <div className="flex justify-between w-full text-sm">
                    <span className="font-semibold text-slate-700">
                      {step.label}
                    </span>
                    <span className="text-slate-400">{step.date}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                className="flex-1 rounded-full border-slate-200 text-slate-600"
              >
                <Link href={`/admin/order`}>Cancel Order</Link>
              </Button>
              <Button className="flex-1 rounded-full bg-[#2D5A5D] hover:bg-[#234749]">
                Track Order
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Section */}
        <div className="md:col-span-7 space-y-5">
          {/* Customer Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Customer</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-5">
              <Avatar className="h-24 w-24">
                <AvatarFallback>
                  {orderInfo?.users.name?.slice(0, 1).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="font-bold text-lg">{orderInfo?.users?.name}</h3>
                {/* <p className="text-md text-slate-400">12 previous orders</p> */}
                <div className="flex flex-col gap-1 pt-1">
                  <span className="flex items-center gap-2 text-md text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" />{orderInfo?.users?.phone}
                  </span>
                  <span className="flex items-center gap-2 text-md break-all text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />{" "}
                    {orderInfo?.users?.email}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold">
                  {formatCurrency(paymentMeta?.subtotal)}
                </span>
              </div>
              {paymentMeta?.discount > 0 && (
                <>
                  <div className="flex justify-between text-sm text-emerald-700">
                    <span>
                      Coupon Discount
                      {appliedCoupon?.code ? ` (${appliedCoupon.code})` : ""}
                    </span>
                    <span className="font-semibold">
                      -{formatCurrency(paymentMeta.discount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Discounted Subtotal</span>
                    <span className="font-semibold">
                      {formatCurrency(paymentMeta.discountedSubtotal)}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">GST</span>
                <span className="font-semibold">
                  {formatCurrency(paymentMeta?.gst)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span className="font-semibold">
                  {formatCurrency(paymentMeta?.shipping)}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg text-[#D4AF37]">{formatCurrency(orderInfo?.order?.totalAmount)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Table Card */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b text-xs uppercase text-slate-500 font-semibold">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Quantity</th>
                  <th className="px-6 py-4 text-right">Total</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {orderInfo?.items.map((item: any) => {
                  const total = item.productPrice * item.quantity;
                  const product = item.product;

                  return (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-20 w-20 border-2 border-slate-100">
                            <AvatarImage src={getImageUrl(item.productImage)} className="object-contain"/>
                            <AvatarFallback>{item.productName?.slice(0, 1).toUpperCase()}</AvatarFallback>
                          </Avatar>

                          <div>
                            <p className="font-bold text-slate-900">
                              {item.productName}
                            </p>
                            <p className="text-xs text-slate-400">
                              {product?.slug ?? item.productSlug}
                            </p>
                            {item.mixBoxRecipe && (
                              <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                                <p>Mix: {formatMixBoxRecipe(item.mixBoxRecipe)}</p>
                                <p>
                                  {item.totalPads ?? 0} pads, {item.boxCount ?? 0} box
                                  {Number(item.boxCount ?? 0) === 1 ? "" : "es"},{" "}
                                  {item.freeLiners ?? Number(item.boxCount ?? 0) * 4} free liners
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 py-1">
                          {orderInfo?.order.status}
                        </Badge>
                      </td>

                      <td className="px-6 py-5 text-center text-slate-600">
                        {item.quantity}
                      </td>

                      <td className="pr-3 py-5 text-right  font-bold text-slate-900">
                        ₹ {total}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
