/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CreditCard, MapPin, PackageCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOrderConfirmationById } from "@/helper/order/action";
import { getImageUrl } from "@/lib/imageUrl";
import { formatMixBoxRecipe } from "@/lib/mixYourBox";
import { PackingSlipModal } from "@/app/components/common/orders/PackingSlipModal";

export const dynamic = "force-dynamic";

function formatMoney(amount?: number | null) {
  return `Rs. ${Number(amount || 0).toFixed(2)}`;
}

function formatDate(date?: string | Date | null) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function DashboardOrderDetailsPage({ params }: any) {
  const { id } = await params;
  let order: any;

  try {
    order = await getOrderConfirmationById(id);
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      redirect(
        `/login?redirect=${encodeURIComponent(`/dashboard/orders/${id}`)}`,
      );
    }

    throw error;
  }

  if (!order) notFound();

  const paymentStatus =
    (order.gatewayConfirmation?.gatewayPayment as any)?.status ??
    order.payment?.paymentStatus ??
    "pending";

  const isUnpaid =
    order.status === "pending" && paymentStatus !== "success";

  const paymentMeta: any =
    typeof order.payment?.paymentMeta === "object"
      ? order.payment.paymentMeta
      : {};
  const isGift = Boolean(paymentMeta?.isGift);
  const giftNote = paymentMeta?.giftNote ? String(paymentMeta.giftNote) : null;

  return (
    <div className="space-y-6">
      <Button
        asChild
        variant="ghost"
        className="px-0 text-[#016271] hover:bg-transparent hover:text-[#126f80]"
      >
        <Link href="/dashboard/orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to orders
        </Link>
      </Button>

      {isUnpaid && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900">
          ⚠️ <strong>Payment not completed:</strong> Payment was not completed for this order. You can return to your orders list and click <strong>Pay now</strong> to complete it.
        </div>
      )}

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-bold tracking-wide text-gray-400 uppercase">
              Order Details
            </p>
            <h1 className="mt-1 text-xl font-bold break-all text-gray-950">
              #{order.id}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Ordered on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            <Badge
              className={
                isUnpaid
                  ? "border border-amber-300 bg-amber-100 text-amber-800"
                  : "bg-[#016271] text-white"
              }
            >
              {isUnpaid ? "Payment not completed" : order.status}
            </Badge>
            <Badge variant="outline">
              Payment: {isUnpaid ? "not completed" : paymentStatus}
            </Badge>
            {isGift && (
              <Badge className="bg-[#9A5B90] text-white">
                🎁 Gift Order
              </Badge>
            )}
            <PackingSlipModal
              order={order}
              items={order.items}
              paymentMeta={paymentMeta}
            />
          </div>
        </div>

        {isGift && (
          <div className="mt-5 rounded-xl border border-[#9A5B90]/30 bg-gradient-to-r from-[#FAF0F6] to-[#F1F8F9] p-4 text-left">
            <div className="flex items-center gap-2 text-sm font-bold text-[#7E4D77]">
              <span>🎁</span>
              <span>Gift Mode Active: Prices hidden on parcel &amp; packing slip</span>
            </div>
            {giftNote && (
              <div className="mt-2.5 rounded-lg bg-white/90 p-3 text-xs text-gray-700 border border-[#9A5B90]/15">
                <span className="text-[10px] font-bold text-[#7E4D77] uppercase tracking-wider block">
                  Included Gift Note for recipient:
                </span>
                <p className="mt-1 italic text-gray-900">“{giftNote}”</p>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-[#016271]" />
            <h2 className="text-lg font-bold text-gray-950">Items</h2>
          </div>

          <div className="space-y-3">
            {order.items.map((item: any) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={getImageUrl(item.productImage)}
                      alt={item.productName || "Product image"}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-950">
                      {item.productName}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.productSKU
                        ? `SKU: ${item.productSKU}`
                        : "SKU not available"}
                    </p>
                    {item.mixBoxRecipe && (
                      <div className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
                        <p>Mix: {formatMixBoxRecipe(item.mixBoxRecipe)}</p>
                        <p>
                          {item.totalPads ?? 0} pads, {item.boxCount ?? 0} box
                          {Number(item.boxCount ?? 0) === 1 ? "" : "es"},{" "}
                          {item.freeLiners ?? Number(item.boxCount ?? 0) * 4}{" "}
                          free liners
                        </p>
                      </div>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Quantity: {item.quantity || 1}
                    </p>
                  </div>
                </div>

                <p className="text-sm font-bold text-gray-950">
                  {formatMoney(
                    Number(item.productPrice || 0) * Number(item.quantity || 1),
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#016271]" />
              <h2 className="text-lg font-bold text-gray-950">Payment</h2>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Payment ID</span>
                <span className="max-w-36 truncate font-medium text-gray-950">
                  {order.payment?.gatewayPaymentId ?? "Not available"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Method</span>
                <span className="font-medium text-gray-950">
                  {order.payment?.modeOfPayment ?? "Razorpay"}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-t pt-3">
                <span className="font-semibold text-gray-950">Total</span>
                <span className="font-bold text-gray-950">
                  {formatMoney(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#016271]" />
              <h2 className="text-lg font-bold text-gray-950">Shipping</h2>
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              {[order.addressLine1, order.addressLine2]
                .filter(Boolean)
                .join(", ")}
              <br />
              {[order.city, order.state, order.pincode]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
