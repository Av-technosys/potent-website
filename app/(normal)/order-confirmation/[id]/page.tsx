/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  MapPin,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";
import { getOrderConfirmationById } from "@/helper/order/action";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatMixBoxRecipe } from "@/lib/mixYourBox";
import { formatYatraKitContents } from "@/lib/yatraKit";
import { isOvyPadItem, getFreeLinersCount } from "@/lib/cartItemDisplay";
import { getImageUrl } from "@/lib/imageUrl";
import {
  formatOrderDate,
  formatPrice,
  formatPaymentMethod,
  getItemDisplayDetails,
} from "@/lib/orderDisplay";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({ params }: any) {
  const { id } = await params;
  let order: any;

  try {
    order = await getOrderConfirmationById(id);
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      redirect(
        `/login?redirect=${encodeURIComponent(`/order-confirmation/${id}`)}`,
      );
    }

    throw error;
  }

  if (!order) notFound();

  const paymentStatus = String(
    (order.gatewayConfirmation?.gatewayPayment as any)?.status ??
      order.payment?.paymentStatus ??
      "pending",
  ).toLowerCase();

  const isConfirmed =
    order.status === "paid" ||
    order.status === "processing" ||
    order.status === "packed" ||
    order.status === "shipped" ||
    order.status === "delivered" ||
    order.status === "completed" ||
    paymentStatus === "success" ||
    paymentStatus === "captured";

  const isFailed = paymentStatus === "failed" || order.status === "failed";

  const paymentMeta: any =
    typeof order.payment?.paymentMeta === "object"
      ? order.payment.paymentMeta
      : {};
  const isGift = Boolean(paymentMeta?.isGift);
  const giftNote = paymentMeta?.giftNote ? String(paymentMeta.giftNote) : null;

  const items = order.items || [];

  return (
    <main className="min-h-screen bg-[#FDFCF9] px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Top Status Card - One clear status */}
        <section className="rounded-2xl bg-white p-8 text-center shadow-sm border border-gray-100">
          <div
            className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${
              isConfirmed
                ? "bg-green-100"
                : isFailed
                  ? "bg-rose-100"
                  : "bg-amber-100"
            }`}
          >
            {isConfirmed ? (
              <CheckCircle2 className="h-9 w-9 text-[#15803D]" />
            ) : isFailed ? (
              <AlertCircle className="h-9 w-9 text-rose-600" />
            ) : (
              <AlertCircle className="h-9 w-9 text-amber-600" />
            )}
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-950 sm:text-3xl">
            {isConfirmed
              ? "Order Confirmed!"
              : isFailed
                ? "Payment Failed"
                : "Payment Processing"}
          </h1>

          <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
            {isConfirmed
              ? "Thank you for your order! We've received your payment and are getting your package ready."
              : isFailed
                ? "Your payment could not be processed. Please check your bank or retry payment from your dashboard."
                : "We are verifying your payment status with the bank. It will update in just a moment."}
          </p>

          <div className="mt-5 flex flex-wrap justify-center items-center gap-2">
            <Badge className="bg-[#016271] text-white px-3 py-1 text-xs">
              Order #{String(order.id).slice(0, 8)}
            </Badge>

            <Badge
              className={`border-none px-3 py-1 text-xs font-semibold ${
                isConfirmed
                  ? "bg-[#DCFCE7] text-[#15803D]"
                  : isFailed
                    ? "bg-rose-100 text-rose-800"
                    : "bg-amber-100 text-amber-800"
              }`}
            >
              {isConfirmed
                ? "Payment Confirmed"
                : isFailed
                  ? "Payment Failed"
                  : "Awaiting Bank Confirmation"}
            </Badge>

            {isGift && (
              <Badge className="bg-[#9A5B90] text-white px-3 py-1 text-xs">
                🎁 Gift Order
              </Badge>
            )}
          </div>

          {isGift && (
            <div className="mt-5 mx-auto max-w-lg rounded-xl border border-[#9A5B90]/30 bg-gradient-to-r from-[#FAF0F6] to-[#F1F8F9] p-3.5 text-left">
              <div className="flex items-center gap-2 text-xs font-bold text-[#7E4D77]">
                <span>🎁</span>
                <span>Gift Mode Active: Prices hidden on parcel &amp; packing slip</span>
              </div>
              {giftNote && (
                <div className="mt-2 rounded-lg bg-white/80 p-2.5 text-xs text-gray-700 border border-[#9A5B90]/15">
                  <span className="text-[10px] font-bold text-[#7E4D77] uppercase tracking-wider block">
                    Your Personal Gift Note:
                  </span>
                  <p className="mt-0.5 italic">“{giftNote}”</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Content Section: Items List + Summary */}
        <section className="grid gap-6 md:grid-cols-[1fr_340px]">
          {/* Items Section */}
          <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2">
              <PackageCheck className="h-5 w-5 text-[#016271]" />
              <h2 className="text-lg font-bold text-gray-950">
                Items in this Order ({items.length})
              </h2>
            </div>

            <div className="space-y-3">
              {items.map((item: any) => {
                const details = getItemDisplayDetails(item);
                const productName = details.productName;
                const size = details.size;
                const productImage = details.productImage;
                const quantity = details.quantity;
                const totalPrice = details.totalPrice;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 aspect-square rounded-lg bg-gray-50 p-1 border border-gray-100 overflow-hidden flex items-center justify-center">
                        <Image
                          src={getImageUrl(productImage)}
                          alt={productName}
                          width={80}
                          height={80}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-950 text-sm sm:text-base">
                          {productName}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          {size && (
                            <span className="rounded bg-teal-50 px-2 py-0.5 font-semibold text-[#016271] border border-[#016271]/20">
                              Size: {size}
                            </span>
                          )}
                          <span className="font-medium text-gray-600">
                            Qty: {quantity}
                          </span>
                          {item.productSKU && (
                            <span className="text-gray-400">SKU: {item.productSKU}</span>
                          )}
                        </div>

                        {Boolean(item.yatraKit || (item.mixBoxRecipe && item.mixBoxRecipe.type === "yatraKit")) ? (
                          <div className="mt-2 rounded-lg bg-[#EAF6F4] px-3 py-2 text-sm text-[#116B66] font-medium space-y-1 border border-[#116B66]/20">
                            <p>{formatYatraKitContents(item.yatraKit || item.mixBoxRecipe)}</p>
                            <p className="text-xs font-bold text-[#15803D]">
                              ✓ Free Intimate Wipes ({(item.yatraKit || item.mixBoxRecipe)?.freeWipesCount || 10} wipes) included
                            </p>
                          </div>
                        ) : item.mixBoxRecipe ? (
                          <div className="mt-2 space-y-1.5">
                            <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-[#7E4D77] font-medium">
                              <p>{formatMixBoxRecipe(item.mixBoxRecipe)}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 rounded bg-[#E6F4EA] px-2 py-0.5 text-xs font-bold text-[#15803D] border border-[#BFE3CA]">
                                🎁 +{getFreeLinersCount(item)} Free Liners
                              </span>
                            </div>
                          </div>
                        ) : isOvyPadItem(item) ? (
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded bg-[#E6F4EA] px-2 py-0.5 text-xs font-bold text-[#15803D] border border-[#BFE3CA]">
                              🎁 +{getFreeLinersCount(item)} Free Liners
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <p className="text-sm sm:text-base font-bold text-gray-950">
                        {formatPrice(totalPrice)}
                      </p>
                      {quantity > 1 && (
                        <p className="text-xs text-gray-400">
                          ({formatPrice(details.unitPrice)} each)
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Aside: Payment Breakdown & Delivery Address */}
          <aside className="space-y-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#016271]" />
                <h2 className="text-lg font-bold text-gray-950">Summary</h2>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Order Date</span>
                  <span className="font-semibold text-gray-950">
                    {formatOrderDate(order.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Payment ID</span>
                  <span className="max-w-40 truncate font-semibold text-gray-950">
                    {order.payment?.gatewayPaymentId ?? "Not available"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-semibold text-gray-950">
                    {formatPaymentMethod(order.payment?.modeOfPayment, order.payment?.paymentMeta)}
                  </span>
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-950">
                      {formatPrice(order.pricingBreakdown?.subtotal ?? order.totalAmount)}
                    </span>
                  </div>
                  {order.pricingBreakdown?.discount > 0 && (
                    <div className="flex justify-between text-[#15803D]">
                      <span>
                        Discount {order.pricingBreakdown.coupon ? `(${order.pricingBreakdown.coupon})` : ""}
                      </span>
                      <span className="font-semibold">
                        -{formatPrice(order.pricingBreakdown.discount)}
                      </span>
                    </div>
                  )}
                  {order.pricingBreakdown?.rewardsUsed > 0 && (
                    <div className="flex justify-between text-[#016271]">
                      <span>Rewards Credit Applied</span>
                      <span className="font-semibold">
                        -{formatPrice(order.pricingBreakdown.rewardsUsed)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className="font-semibold text-gray-950">
                      {order.pricingBreakdown?.shipping > 0
                        ? formatPrice(order.pricingBreakdown.shipping)
                        : "FREE"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between gap-4 border-t border-gray-100 pt-3">
                  <span className="font-bold text-gray-950">Total Paid</span>
                  <span className="font-bold text-gray-950 text-base">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#016271]" />
                <h2 className="text-lg font-bold text-gray-950">Delivery Address</h2>
              </div>
              <div className="mt-4 text-sm leading-6 text-gray-600 space-y-1">
                {order.customerName && (
                  <p className="font-bold text-gray-950">{order.customerName}</p>
                )}
                {order.customerPhone && (
                  <p className="text-gray-700 font-medium">📞 {order.customerPhone}</p>
                )}
                <p className="mt-1">
                  {[order.addressLine1, order.addressLine2]
                    .filter(Boolean)
                    .join(", ") || "Address not available"}
                  <br />
                  {[order.city, order.state, order.pincode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>
          </aside>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            className="h-12 flex-1 rounded-xl bg-[#016271] hover:bg-[#014d59] font-semibold text-white"
          >
            <Link href={`/dashboard/orders/${order.id}`}>
              View Full Order Details
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 flex-1 rounded-xl border-gray-300 font-semibold"
          >
            <Link href="/shop" className="flex items-center justify-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Continue Shopping</span>
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
