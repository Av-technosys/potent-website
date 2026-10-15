/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  PackageCheck,
  AlertTriangle,
  Download,
  Gift,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOrderConfirmationById } from "@/helper/order/action";
import { getImageUrl } from "@/lib/imageUrl";
import { formatMixBoxRecipe } from "@/lib/mixYourBox";
import { formatYatraKitContents } from "@/lib/yatraKit";
import { PackingSlipModal } from "@/app/components/common/orders/PackingSlipModal";
import { TrackOrderModal } from "@/app/components/common/dashboard-orders/TrackOrderModal";
import { RaiseSupportModal } from "@/app/components/common/dashboard-orders/RaiseSupportModal";
import { CancelRequestDialog } from "@/app/components/common/dashboard-orders/OrderCard";
import { isOvyPadItem, getFreeLinersCount } from "@/lib/cartItemDisplay";
import {
  formatOrderStage,
  getOrderStageBadgeClasses,
  formatOrderDate,
  getDeliveryHeader,
  canTrackOrder,
  formatPrice,
  formatPaymentMethod,
  getItemDisplayDetails,
  getOrderRefundInfo,
} from "@/lib/orderDisplay";

export const dynamic = "force-dynamic";

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

  const isDelivered = order.status === "delivered" || order.status === "completed";
  const isCanceled = order.status === "canceled" || order.status === "cancelled";

  const paymentMeta: any =
    typeof order.payment?.paymentMeta === "object"
      ? order.payment.paymentMeta
      : {};
  const isGift = Boolean(paymentMeta?.isGift);
  const giftNote = paymentMeta?.giftNote ? String(paymentMeta.giftNote) : null;

  const refundInfo = getOrderRefundInfo(order);

  const canCancel =
    !isCanceled &&
    !isDelivered &&
    order.status !== "shipped" &&
    order.status !== "packed" &&
    ["paid", "processing"].includes(String(order.status || "").toLowerCase()) &&
    !order.cancelRequest &&
    !isUnpaid &&
    !order.isSubscriptionOnly;

  const canTrack = canTrackOrder(order);

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

      {refundInfo.isCancelled && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 space-y-1">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>Order Cancelled &bull; {refundInfo.refundStatus}</span>
          </div>
          <p className="text-xs text-red-800 leading-relaxed">
            {refundInfo.refundDescription}
          </p>
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
              Ordered on {formatOrderDate(order.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <Badge
              className={`${getOrderStageBadgeClasses(
                order.status,
                isUnpaid,
              )} border-none text-xs font-semibold px-2.5 py-0.5 shadow-none`}
            >
              {formatOrderStage(order.status, isUnpaid)}
            </Badge>

            <Badge variant="outline" className="text-xs">
              {isCanceled
                ? `Refund: ${refundInfo.refundStatus}`
                : isUnpaid
                  ? "Payment: Not completed"
                  : `Payment: ${paymentStatus}`}
            </Badge>

            {isGift && (
              <Badge className="bg-[#9A5B90] text-white text-xs">
                🎁 Gift Order
              </Badge>
            )}

            <PackingSlipModal
              order={order}
              items={order.items}
              paymentMeta={paymentMeta}
              triggerButton={
                <Button
                  disabled={order.isSubscriptionOnly}
                  className="flex h-9 items-center gap-1.5 rounded-xl bg-[#016271] px-3.5 text-xs font-semibold text-white hover:bg-[#014d59] cursor-pointer"
                >
                  {isGift ? (
                    <Gift className="h-3.5 w-3.5" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  <span>{isGift ? "Gift Slip" : "Invoice"}</span>
                </Button>
              }
            />

            {canTrack && <TrackOrderModal order={order} />}

            {canCancel && <CancelRequestDialog orderId={order.id} />}

            {order.cancelRequest && !isCanceled && (
              <Button
                disabled
                className="h-9 rounded-xl bg-orange-100 text-orange-700 text-xs font-semibold"
              >
                Cancel {order.cancelRequest.status ?? "pending"}
              </Button>
            )}

            {isDelivered && <RaiseSupportModal order={order} />}
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

      <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-[#016271]" />
            <h2 className="text-lg font-bold text-gray-950">Items ({order.items?.length || 0})</h2>
          </div>

          <div className="space-y-3">
            {order.items.map((item: any) => {
              const details = getItemDisplayDetails(item);
              const productName = details.productName;
              const size = details.size;
              const productImage = details.productImage;
              const quantity = details.quantity;
              const totalPrice = details.totalPrice;

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between hover:border-gray-200 transition-colors"
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

        <aside className="space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#016271]" />
              <h2 className="text-lg font-bold text-gray-950">Payment &amp; Summary</h2>
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
                <span className="font-semibold text-gray-950">
                  {formatPaymentMethod(order.payment?.modeOfPayment, order.payment?.paymentMeta)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Payment Status</span>
                <span className="font-semibold capitalize text-gray-950">
                  {isCanceled
                    ? refundInfo.refundStatus
                    : isUnpaid
                      ? "Not completed"
                      : (paymentStatus || "Completed")}
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
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="font-semibold text-gray-950">
                    {order.pricingBreakdown?.shipping > 0
                      ? formatPrice(order.pricingBreakdown.shipping)
                      : "FREE"}
                  </span>
                </div>
              </div>

              <div className="flex justify-between gap-4 border-t pt-3">
                <span className="font-bold text-gray-950">Total</span>
                <span className="font-bold text-gray-950 text-base">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#016271]" />
              <h2 className="text-lg font-bold text-gray-950">
                {getDeliveryHeader(isDelivered)}
              </h2>
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
    </div>
  );
}
