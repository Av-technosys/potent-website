/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Printer, Gift, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatMixBoxRecipe } from "@/lib/mixYourBox";
import { formatYatraKitContents } from "@/lib/yatraKit";

interface PackingSlipModalProps {
  order: any;
  items?: any[];
  paymentMeta?: any;
  customer?: any;
  triggerButton?: React.ReactNode;
}

export function PackingSlipModal({
  order,
  items = [],
  paymentMeta,
  customer,
  triggerButton,
}: PackingSlipModalProps) {
  const [open, setOpen] = useState(false);

  const meta =
    paymentMeta ??
    (typeof order?.payment?.paymentMeta === "object"
      ? order.payment.paymentMeta
      : typeof order?.paymentMeta === "object"
        ? order.paymentMeta
        : {});

  const isGift = Boolean(meta?.isGift);
  const giftNote = meta?.giftNote ? String(meta.giftNote) : null;

  const orderItems =
    items.length > 0
      ? items
      : Array.isArray(order?.items)
        ? order.items
        : Array.isArray(order?.order_items)
          ? order.order_items
          : [];

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (date: any) => {
    if (!date) return new Date().toLocaleDateString("en-IN");
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton ? (
          triggerButton
        ) : (
          <Button
            variant="outline"
            className="flex items-center gap-2 rounded-xl text-xs sm:text-sm font-semibold border-slate-300 hover:bg-slate-50 cursor-pointer"
          >
            {isGift ? (
              <Gift className="h-4 w-4 text-[#9A5B90]" />
            ) : (
              <FileText className="h-4 w-4 text-[#016271]" />
            )}
            <span>{isGift ? "Print Gift Slip" : "Print Packing Slip"}</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 sm:p-6 print:max-w-none print:max-h-none print:p-0 print:border-none print:shadow-none">
        <DialogHeader className="p-4 sm:p-0 border-b sm:border-0 flex flex-row items-center justify-between print:hidden">
          <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
            {isGift ? (
              <>
                <Gift className="h-5 w-5 text-[#9A5B90]" />
                <span>Gift Parcel Slip</span>
                <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-full">
                  Price Hidden
                </span>
              </>
            ) : (
              <>
                <FileText className="h-5 w-5 text-[#016271]" />
                <span>Order Packing Slip</span>
              </>
            )}
          </DialogTitle>
          <Button
            onClick={handlePrint}
            size="sm"
            className="flex items-center gap-1.5 bg-[#016271] hover:bg-[#014d59] text-white rounded-lg text-xs font-semibold mr-6"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Slip
          </Button>
        </DialogHeader>

        {/* 🖨️ Printable Slip Container */}
        <div id="printable-parcel-slip" className="p-6 sm:p-8 bg-white font-sans text-gray-900 border sm:border-slate-200 rounded-xl print:border-0 print:p-0">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-5">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[#016271]">
                POTENT HYGIENE
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Care, Comfort &amp; Wellness
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
                {isGift ? "🎁 GIFT PARCEL SLIP" : "PACKING SLIP"}
              </span>
              <p className="text-xs font-mono font-bold mt-1.5 text-gray-900">
                Order #{String(order?.id || "").slice(0, 16)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Date: {formatDate(order?.createdAt)}
              </p>
            </div>
          </div>

          {/* 🎁 Prominent Gift Notice & Gift Note */}
          {isGift && (
            <div className="my-5 rounded-xl border-2 border-[#9A5B90]/40 bg-[#FAF0F6] p-4 text-left">
              <div className="flex items-center gap-2 text-xs font-bold text-[#7E4D77] uppercase tracking-wide">
                <span>🎁</span>
                <span>Special Instructions: Gift Parcel — No Price Included</span>
              </div>
              <p className="text-[11px] text-gray-600 mt-1">
                Prices and payment totals have been intentionally hidden from this slip and parcel at the sender&apos;s request.
              </p>

              {giftNote && (
                <div className="mt-3 rounded-lg border border-[#9A5B90]/30 bg-white p-3.5 shadow-xs">
                  <span className="text-[10px] font-bold text-[#7E4D77] uppercase tracking-wider block">
                    Message For Recipient:
                  </span>
                  <p className="mt-1 text-sm italic font-serif text-gray-800 leading-relaxed">
                    &ldquo;{giftNote}&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Recipient & Sender Addresses */}
          <div className="grid grid-cols-2 gap-6 my-5 text-xs">
            <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-3.5">
              <span className="font-bold uppercase tracking-wider text-gray-500 text-[10px] block mb-1">
                Deliver To (Recipient)
              </span>
              <p className="font-bold text-sm text-gray-900">
                {customer?.name || order?.users?.name || "Recipient"}
              </p>
              <p className="text-gray-700 mt-1 leading-relaxed">
                {[order?.addressLine1, order?.addressLine2]
                  .filter(Boolean)
                  .join(", ")}
                <br />
                {[order?.city, order?.state, order?.pincode]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              {(customer?.phone || order?.users?.phone) && (
                <p className="text-gray-500 mt-1">
                  Phone: {customer?.phone || order?.users?.phone}
                </p>
              )}
            </div>

            <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-3.5">
              <span className="font-bold uppercase tracking-wider text-gray-500 text-[10px] block mb-1">
                Fulfilled By
              </span>
              <p className="font-bold text-sm text-gray-900">
                Potent Hygiene Private Limited
              </p>
              <p className="text-gray-600 mt-1 leading-relaxed">
                Potent Warehouse &amp; Fulfillment
                <br />
                Support: care@potenthygiene.com
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                Status: {order?.status ?? "Confirmed"}
              </p>
            </div>
          </div>

          {/* Package Contents Table */}
          <div className="my-5">
            <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Package Contents
            </h2>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100/80 border-b border-gray-200 text-gray-600 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">#</th>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3 text-center w-24">Quantity</th>
                    {!isGift && (
                      <th className="py-2.5 px-3 text-right w-28">Amount</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orderItems.map((item: any, idx: number) => {
                    const title =
                      item.productName ||
                      item.title ||
                      item.productVarientName ||
                      "Potent Care Product";
                    const qty = Number(item.quantity || 1);
                    const price = Number(
                      item.productPrice ||
                        item.price ||
                        item.productVarientPrice ||
                        0,
                    );

                    return (
                      <tr key={item.id ?? idx}>
                        <td className="py-3 px-3 text-center text-gray-400 font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-gray-900">{title}</p>
                          {item.productSKU && (
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                              SKU: {item.productSKU}
                            </p>
                          )}
                          {Boolean(item.yatraKit || (item.mixBoxRecipe && item.mixBoxRecipe.type === "yatraKit")) ? (
                            <div className="mt-1 space-y-0.5">
                              <p className="text-[11px] font-medium text-[#116B66]">
                                {formatYatraKitContents(item.yatraKit || item.mixBoxRecipe)}
                              </p>
                              <p className="text-[10px] font-bold text-[#15803D]">
                                ✓ Free Intimate Wipes ({(item.yatraKit || item.mixBoxRecipe)?.freeWipesCount || 10} wipes) included
                              </p>
                            </div>
                          ) : item.mixBoxRecipe ? (
                            <p className="text-[11px] font-semibold text-[#7E4D77] mt-0.5">
                              {formatMixBoxRecipe(item.mixBoxRecipe, (item.boxCount || item.quantity || qty || 1) * 4)}
                            </p>
                          ) : null}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-gray-900">
                          {qty} {qty === 1 ? "unit" : "units"}
                        </td>
                        {!isGift && (
                          <td className="py-3 px-3 text-right font-bold text-gray-900">
                            ₹{(price * qty).toFixed(2)}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Summary: NO PRICE IF GIFT */}
          {isGift ? (
            <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
              <span className="italic font-medium">
                🎁 Gift mode verified: No prices displayed on parcel or packing slip.
              </span>
              <span className="font-bold text-gray-800">
                Total Items:{" "}
                {orderItems.reduce(
                  (acc: number, it: any) => acc + Number(it.quantity || 1),
                  0,
                )}{" "}
                units
              </span>
            </div>
          ) : (
            <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col items-end gap-1.5 text-xs">
              {meta?.discount > 0 && (
                <div className="flex justify-between w-48 text-emerald-700">
                  <span>Discount:</span>
                  <span className="font-bold">-₹{Number(meta.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between w-48 text-gray-600">
                <span>Shipping:</span>
                <span className="font-bold">
                  {meta?.shipping === 0 ? "Free" : `₹${Number(meta?.shipping || 0).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between w-48 text-sm font-bold text-gray-900 pt-1.5 border-t border-gray-200">
                <span>Total:</span>
                <span>₹{Number(order?.totalAmount || meta?.subtotal || 0).toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="mt-8 text-center text-[10px] text-gray-400 border-t border-gray-100 pt-3">
            Thank you for choosing Potent Hygiene · For any assistance, visit potenthygiene.com or email care@potenthygiene.com
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

