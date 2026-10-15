/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Printer, Gift, FileText, Download } from "lucide-react";
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
import { formatOrderDate, getItemDisplayDetails } from "@/lib/orderDisplay";

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
  const [isPrinting, setIsPrinting] = useState(false);

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
      : Array.isArray(order?.items) && order.items.length > 0
        ? order.items
        : Array.isArray(order?.order_items) && order.order_items.length > 0
          ? order.order_items
          : [
              {
                id: `fallback-${order?.id || "item"}`,
                productName: "Potent Hygiene Care Essentials",
                productVarientName: "Standard Box",
                quantity: 1,
                productPrice: Number(order?.totalAmount || meta?.subtotal || 0),
                price: Number(order?.totalAmount || meta?.subtotal || 0),
                productSKU: "POTENT-CARE",
              },
            ];

  const uniqueSlipId = `printable-parcel-slip-${order?.id || "modal"}`;

  const handlePrint = () => {
    const slipElement = document.getElementById(uniqueSlipId);
    if (!slipElement) return;

    setIsPrinting(true);

    // Remove any leftover print iframe from previous prints
    const oldIframe = document.getElementById("invoice-isolated-print-frame");
    if (oldIframe) {
      oldIframe.remove();
    }

    // Create an isolated hidden iframe with real viewport dimensions to prevent blank page collapse
    const iframe = document.createElement("iframe");
    iframe.id = "invoice-isolated-print-frame";
    iframe.style.position = "fixed";
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.zIndex = "-99999";
    iframe.style.opacity = "0";
    iframe.style.pointerEvents = "none";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      setIsPrinting(false);
      return;
    }

    // Collect all stylesheets from main document
    const styleTags = Array.from(
      document.querySelectorAll("style, link[rel='stylesheet']"),
    )
      .map((tag) => tag.outerHTML)
      .join("\n");

    const shortId = String(order?.id || "order").slice(0, 16);
    const invoiceTitle = isGift ? `Gift-Slip-${shortId}` : `Invoice-${shortId}`;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>${invoiceTitle}</title>
          ${styleTags}
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 15mm;
            }
            * {
              box-sizing: border-box !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            html, body {
              display: block !important;
              visibility: visible !important;
              opacity: 1 !important;
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              color: #111827 !important;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
              font-size: 12px !important;
              line-height: 1.5 !important;
            }
            body * {
              visibility: visible !important;
            }
            .isolated-slip-wrapper {
              display: block !important;
              visibility: visible !important;
              opacity: 1 !important;
              width: 100% !important;
              max-width: 800px !important;
              margin: 0 auto !important;
              padding: 24px !important;
              background: #ffffff !important;
              box-sizing: border-box !important;
            }
            .flex { display: flex !important; }
            .justify-between { justify-content: space-between !important; }
            .items-start { align-items: flex-start !important; }
            .items-center { align-items: center !important; }
            .flex-col { flex-direction: column !important; }
            .flex-row { flex-direction: row !important; }
            .gap-1 { gap: 4px !important; }
            .gap-2 { gap: 8px !important; }
            .gap-3 { gap: 12px !important; }
            .gap-4 { gap: 16px !important; }
            .gap-6 { gap: 24px !important; }
            .grid { display: grid !important; }
            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
            .text-2xl { font-size: 24px !important; line-height: 28px !important; }
            .text-lg { font-size: 18px !important; line-height: 24px !important; }
            .text-sm { font-size: 14px !important; line-height: 20px !important; }
            .text-xs { font-size: 12px !important; line-height: 16px !important; }
            .font-black { font-weight: 900 !important; }
            .font-bold { font-weight: 700 !important; }
            .font-semibold { font-weight: 600 !important; }
            .font-medium { font-weight: 500 !important; }
            .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important; }
            .text-center { text-align: center !important; }
            .text-right { text-align: right !important; }
            .text-left { text-align: left !important; }
            .uppercase { text-transform: uppercase !important; }
            .italic { font-style: italic !important; }
            .text-gray-900 { color: #111827 !important; }
            .text-gray-800 { color: #1f2937 !important; }
            .text-gray-700 { color: #374151 !important; }
            .text-gray-600 { color: #4b5563 !important; }
            .text-gray-500 { color: #6b7280 !important; }
            .text-gray-400 { color: #9ca3af !important; }
            .text-emerald-700 { color: #047857 !important; }
            .border { border: 1px solid #e5e7eb !important; }
            .border-b { border-bottom: 1px solid #e5e7eb !important; }
            .border-t { border-top: 1px solid #e5e7eb !important; }
            .rounded-lg { border-radius: 8px !important; }
            .rounded-xl { border-radius: 12px !important; }
            .rounded-md { border-radius: 6px !important; }
            .bg-white { background-color: #ffffff !important; }
            .bg-gray-50 { background-color: #f9fafb !important; }
            .bg-gray-100 { background-color: #f3f4f6 !important; }
            .bg-slate-100 { background-color: #f1f5f9 !important; }
            table {
              width: 100% !important;
              border-collapse: collapse !important;
              margin-top: 4px !important;
            }
            th, td {
              padding: 8px 12px !important;
              border-bottom: 1px solid #f3f4f6 !important;
            }
            th {
              background-color: #f8fafc !important;
              font-weight: 600 !important;
              color: #475569 !important;
            }
            button, .print\\:hidden, .no-print {
              display: none !important;
            }
          </style>
        </head>
        <body>
          <div class="isolated-slip-wrapper">
            ${slipElement.innerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    requestAnimationFrame(() => {
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (err) {
          console.error("Isolated print failed, falling back to window.print:", err);
          window.print();
        } finally {
          setIsPrinting(false);
          setTimeout(() => {
            try {
              iframe.remove();
            } catch {}
          }, 2000);
        }
      }, 350);
    });
  };

  const formatDate = (date: any) => {
    return formatOrderDate(date) || "Recently";
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
                <span>Order Invoice &amp; Slip</span>
              </>
            )}
          </DialogTitle>
          <div className="flex items-center gap-2 mr-6 print:hidden">
            <Button
              onClick={handlePrint}
              disabled={isPrinting}
              size="sm"
              className="flex items-center gap-1.5 bg-[#016271] hover:bg-[#014d59] text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isPrinting ? "Preparing..." : "Download Invoice (PDF)"}</span>
            </Button>
            <Button
              onClick={handlePrint}
              disabled={isPrinting}
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-1.5 border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </Button>
          </div>
        </DialogHeader>

        {/* 🖨️ Printable Slip Container (Unique ID per order to prevent cross-order bleed) */}
        <div
          id={uniqueSlipId}
          data-printable-slip={order?.id || "modal"}
          className="p-6 sm:p-8 bg-white font-sans text-gray-900 border sm:border-slate-200 rounded-xl print:border-0 print:p-0"
        >
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
                {isGift ? "🎁 GIFT PARCEL SLIP" : "INVOICE / PACKING SLIP"}
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

          {/* Package Contents Table (ONLY items belonging to this specific order) */}
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
                    const details = getItemDisplayDetails(item);
                    const title = details.productName;
                    const size = details.size;
                    const qty = Number(item.quantity || details.quantity || 1);
                    const price = Number(
                      item.productPrice ||
                        item.price ||
                        item.productVarientPrice ||
                        details.unitPrice ||
                        0,
                    );

                    return (
                      <tr key={item.id ?? idx}>
                        <td className="py-3 px-3 text-center text-gray-400 font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-gray-900">{title}</p>
                          {size && (
                            <p className="text-[10px] text-gray-500 font-medium">
                              Size: {size}
                            </p>
                          )}
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
