/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  cancelUnpaidOrder,
  createCancelRequest,
} from "@/helper/order/action";
import { IconDownload, IconEye, IconX } from "@tabler/icons-react";
import { TrackOrderModal } from "./TrackOrderModal";
import { RaiseSupportModal } from "./RaiseSupportModal";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, Gift } from "lucide-react";
import { PackingSlipModal } from "@/app/components/common/orders/PackingSlipModal";
import { loadRazorpayScript } from "@/lib/razorpay";
import { getImageUrl } from "@/lib/imageUrl";
import { formatMixBoxRecipe } from "@/lib/mixYourBox";
import { formatYatraKitContents } from "@/lib/yatraKit";
import { isOvyPadItem, getFreeLinersCount } from "@/lib/cartItemDisplay";
import {
  formatOrderStage,
  getOrderStageBadgeClasses,
  formatOrderDate,
  getDeliveryHeader,
  canTrackOrder,
  getItemDisplayDetails,
} from "@/lib/orderDisplay";

export const OrderCard = ({
  order_details,
  setorderReview,
  setSingleOrderData,
}: {
  order_details: any;
  setorderReview: any;
  setSingleOrderData: any;
}) => {
  // Variable ko yahan define kiya hai taaki niche logic mein issue na aaye

  const order = order_details;
  const items =
    order_details?.order_items && order_details.order_items.length > 0
      ? order_details.order_items
      : order_details?.items && order_details.items.length > 0
        ? order_details.items
        : [];

  const [paying, setPaying] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const router = useRouter();

  const statusLower = String(order?.status || "").toLowerCase().trim();

  const isUnpaid = Boolean(
    order?.isUnpaid ||
    (statusLower === "pending" &&
      order?.paymentStatus !== "success" &&
      order?.payment?.paymentStatus !== "success"),
  );

  const isCanceled =
    statusLower === "canceled" ||
    statusLower === "cancelled" ||
    statusLower === "failed" ||
    order?.cancelRequest?.status === "approved" ||
    order?.cancelRequest?.status === "refunded";

  const isDelivered = statusLower === "delivered" || statusLower === "completed";

  const isSubscriptionOnly = Boolean(order?.isSubscriptionOnly);

  const canTrack = canTrackOrder({
    ...order,
    status: statusLower,
    isCanceled,
    isDelivered,
    isSubscriptionOnly,
    isUnpaid,
  });

  const canReview =
    !isUnpaid &&
    !isCanceled &&
    ["paid", "processing", "shipped", "delivered", "completed"].includes(
      statusLower,
    );
  const isGift = Boolean(
    order?.payment?.paymentMeta?.isGift ||
    order?.paymentMeta?.isGift ||
    order?.isGift,
  );
  const giftNote =
    order?.payment?.paymentMeta?.giftNote ||
    order?.paymentMeta?.giftNote ||
    order?.giftNote ||
    null;
  const canCancel =
    !isUnpaid &&
    !isCanceled &&
    !isDelivered &&
    !isSubscriptionOnly &&
    ["paid", "processing"].includes(statusLower) &&
    !order?.cancelRequest;

  const reviewHandler = () => {
    setorderReview(true);
    setSingleOrderData(order_details);
  };

  const handleCancelUnpaid = async () => {
    if (!confirm("Are you sure you want to cancel this unpaid order?")) return;
    try {
      setCancelling(true);
      const res = await cancelUnpaidOrder(order.id);
      if (res.success) {
        toast.success("Unpaid order cancelled");
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const handlePayNow = async () => {
    try {
      setPaying(true);
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Payment gateway failed to load");
        return;
      }

      const res = await fetch("/api/razorpay/retry-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });

      const data = await res.json();
      if (!res.ok || !data?.razorpayOrderId) {
        toast.error(data?.error || "Failed to initiate payment");
        return;
      }

      const options: any = {
        key: data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "POTENT HYGIENE",
        description: `Order Payment #${order.id}`,
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              toast.success("Payment completed successfully! 🎉");
              router.refresh();
            } else {
              toast.error("Payment verification failed");
            }
          } catch {
            toast.error("Error verifying payment");
          }
        },
        theme: {
          color: "#016271",
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment not completed");
          },
        },
      };

      const razor = new (window as any).Razorpay(options);
      razor.on("payment.failed", function (response: any) {
        toast.error(response?.error?.description || "Payment not completed");
      });
      razor.open();
    } catch (err: any) {
      console.error("Pay now error:", err);
      toast.error("Could not open payment window");
    } finally {
      setPaying(false);
    }
  };

  return (
    <Card className="mb-6 overflow-hidden rounded-[20px] border border-gray-100 bg-white p-0 shadow-xs">
      {/* Header Section: Order ID & Status */}
      <div className="flex items-start justify-between bg-gradient-to-r from-[#FFF1F2] to-[#FFFBEB] p-4 sm:p-6 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h3 className="text-sm sm:text-[16px] font-bold text-[#2D3748] break-all">{order.id}</h3>
            <Badge
              className={`${getOrderStageBadgeClasses(
                order.status,
                isUnpaid,
              )} border-none px-2.5 py-0.5 text-[11px] font-bold shadow-none`}
            >
              {formatOrderStage(order.status, isUnpaid)}
            </Badge>
            {isGift && (
              <Badge className="bg-[#9A5B90] text-white border-none px-2.5 py-0.5 text-[10px] font-bold shadow-none">
                🎁 Gift Order
              </Badge>
            )}
          </div>
          <p className="text-[12px] sm:text-[13px] font-medium text-gray-500">
            Ordered on {formatOrderDate(order.createdAt)}
          </p>
          {isGift && giftNote && (
            <p className="mt-1 text-[11px] italic text-[#7E4D77]">
              Gift note: &ldquo;{giftNote}&rdquo;
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] sm:text-[11px] font-bold tracking-tight text-gray-400 uppercase">
            Total Amount
          </p>
          <p className="text-[16px] sm:text-[18px] font-bold text-[#2D3748]">
            ₹{order.totalAmount}
          </p>
          {isSubscriptionOnly && (
            <p className="mt-1 text-[11px] font-semibold text-[#016271] uppercase">
              Subscription
            </p>
          )}
        </div>
      </div>

      {/* Items Section */}
      <div className="px-4 sm:px-6">
        <div className="flex flex-col gap-4">
          {items && items.length > 0 ? (
            items.map((item: any, idx: number) => {
              const details = getItemDisplayDetails(item);
              const productName = details.productName;
              const productImage = details.productImage;
              const size = details.size;

              return (
                <div
                  key={idx}
                  className="flex flex-col gap-3 border-b border-gray-100 py-4 last:border-b-0 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <span className="text-xs sm:text-sm text-gray-400 mt-1">{idx + 1}.</span>
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 aspect-square rounded-lg bg-gray-50 p-1 border border-gray-100 overflow-hidden flex items-center justify-center">
                      <Image
                        src={getImageUrl(productImage)}
                        alt={productName}
                        width={80}
                        height={80}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[13px] sm:text-[14px] font-bold text-[#2D3748]">
                          {productName}
                        </p>
                        {size && (
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-700 uppercase">
                            {size}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] sm:text-[12px] font-medium text-gray-400">
                        Quantity: {item.quantity || 1}
                      </p>
                      {Boolean(item.yatraKit || (item.mixBoxRecipe && item.mixBoxRecipe.type === "yatraKit")) ? (
                        <div className="mt-2 rounded-lg bg-[#EAF6F4] px-3 py-2 text-[12px] font-semibold text-[#116B66] space-y-0.5 border border-[#116B66]/20">
                          <p>{formatYatraKitContents(item.yatraKit || item.mixBoxRecipe)}</p>
                          <p className="text-[11px] font-bold text-[#15803D]">
                            ✓ Free Intimate Wipes ({(item.yatraKit || item.mixBoxRecipe)?.freeWipesCount || 10} wipes) included
                          </p>
                        </div>
                      ) : item.mixBoxRecipe ? (
                        <div className="mt-2 space-y-1.5">
                          <div className="rounded-lg bg-gray-50 px-3 py-2 text-[12px] font-semibold text-[#7E4D77]">
                            <p>{formatMixBoxRecipe(item.mixBoxRecipe)}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded bg-[#E6F4EA] px-2 py-0.5 text-[11px] font-bold text-[#15803D] border border-[#BFE3CA]">
                              🎁 +{getFreeLinersCount(item)} Free Liners
                            </span>
                          </div>
                        </div>
                      ) : isOvyPadItem(item) ? (
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded bg-[#E6F4EA] px-2 py-0.5 text-[11px] font-bold text-[#15803D] border border-[#BFE3CA]">
                            🎁 +{getFreeLinersCount(item)} Free Liners
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <p className="text-[14px] font-bold text-[#2D3748]">
                      ₹{item.productPrice || details.unitPrice || 0}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            (() => {
              const details = getItemDisplayDetails({
                productName: order.productName,
                productVarientName: order.productVarientName,
                productSKU: order.productSKU,
                productImage: order.productImage,
                quantity: 1,
                productPrice: order.totalAmount,
              });
              return (
                <div className="flex items-center gap-3 py-4">
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 aspect-square rounded-lg bg-gray-50 p-1 border border-gray-100 overflow-hidden flex items-center justify-center">
                    <Image
                      src={getImageUrl(details.productImage)}
                      alt={details.productName}
                      width={80}
                      height={80}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#2D3748]">
                      {details.productName}
                    </p>
                    <p className="text-[12px] font-medium text-gray-400">
                      Order #{order.id}
                    </p>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      </div>

      {/* Tracking / Delivery Address Section */}
      <div className="flex items-center justify-between px-4 sm:px-6 pt-2">
        <div />
        <div className="text-right">
          <p className="text-[11px] font-bold text-gray-400 uppercase">
            {getDeliveryHeader(isDelivered)}
          </p>
          <p className="text-[13px] sm:text-[14px] break-all text-[#2D3748]">
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

      {/* Unpaid Order Banner */}
      {isUnpaid && (
        <div className="mx-4 sm:mx-6 mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs font-medium text-amber-900">
          ⚠️ Payment was not completed for this order. Click <strong>Pay now</strong> to complete your order, or cancel if you no longer need it.
        </div>
      )}

      {/* Action Buttons Section - One row of buttons on phone */}
      {isUnpaid ? (
        <div className="flex flex-row items-center gap-2 overflow-x-auto p-4 sm:p-6 no-scrollbar">
          <Button
            onClick={handlePayNow}
            disabled={paying || cancelling}
            className="flex h-9 sm:h-11 shrink-0 items-center gap-1.5 sm:gap-2 rounded-xl bg-[#016271] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold text-white hover:bg-[#014d59] whitespace-nowrap cursor-pointer shadow-sm sm:shrink sm:flex-1"
          >
            <CreditCard size={16} />
            <span>{paying ? "Opening Payment..." : `Pay now (₹${order.totalAmount})`}</span>
          </Button>

          <Button
            asChild
            variant="outline"
            className="flex h-9 sm:h-11 shrink-0 items-center gap-1.5 sm:gap-2 rounded-xl border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 whitespace-nowrap cursor-pointer sm:shrink sm:flex-1"
          >
            <Link href={`/dashboard/orders/${order.id}`}>
              <IconEye size={16} stroke={2.5} />
              <span>View Details</span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            onClick={handleCancelUnpaid}
            disabled={paying || cancelling}
            className="flex h-9 sm:h-11 shrink-0 items-center gap-1.5 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 whitespace-nowrap cursor-pointer"
          >
            <span>{cancelling ? "Cancelling..." : "Cancel Order"}</span>
          </Button>
        </div>
      ) : (
        <div className="flex flex-row items-center gap-2 overflow-x-auto p-4 sm:p-6 no-scrollbar">
          <Button
            asChild
            variant="outline"
            className="flex h-9 sm:h-11 shrink-0 items-center gap-1.5 sm:gap-2 rounded-xl border border-[#016271] bg-white px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-[#016271] hover:bg-[#EAF9FC] whitespace-nowrap cursor-pointer sm:shrink sm:flex-1"
          >
            <Link
              href={
                isSubscriptionOnly
                  ? "/dashboard/subscriptions"
                  : `/dashboard/orders/${order.id}`
              }
            >
              <IconEye size={16} stroke={2.5} />
              <span>{isSubscriptionOnly ? "Subscription" : "View Details"}</span>
            </Link>
          </Button>

          <PackingSlipModal
            order={order}
            items={items}
            paymentMeta={order?.payment?.paymentMeta || order?.paymentMeta}
            triggerButton={
              <Button
                disabled={isSubscriptionOnly}
                className="flex h-9 sm:h-11 shrink-0 items-center gap-1.5 sm:gap-2 rounded-xl bg-[#016271] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-[#014d59] whitespace-nowrap cursor-pointer sm:shrink sm:flex-1"
              >
                {isGift ? (
                  <Gift className="h-4 w-4" />
                ) : (
                  <IconDownload size={16} stroke={2.5} />
                )}
                <span>{isGift ? "Gift Slip" : "Invoice"}</span>
              </Button>
            }
          />

          {canCancel && <CancelRequestDialog orderId={order.id} />}

          {order?.cancelRequest && !isCanceled && (
            <Button
              disabled
              className="flex h-9 sm:h-11 shrink-0 items-center rounded-xl bg-orange-100 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-orange-700 whitespace-nowrap sm:shrink sm:flex-1"
            >
              Cancel {order.cancelRequest.status ?? "pending"}
            </Button>
          )}

          {canReview && (
            <Button
              onClick={() => reviewHandler()}
              className="flex h-9 sm:h-11 shrink-0 items-center gap-1.5 rounded-xl bg-[#1D4E4E] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-[#153939] whitespace-nowrap cursor-pointer sm:shrink sm:flex-1"
            >
              Review (+₹50)
            </Button>
          )}

          {/* No tracking on cancelled orders */}
          {canTrack && <TrackOrderModal order={order} />}
          {isDelivered && !isCanceled && <RaiseSupportModal order={order} />}
        </div>
      )}
    </Card>
  );
};

export function CancelRequestDialog({
  orderId,
  triggerButton,
}: {
  orderId: string;
  triggerButton?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const submit = () => {
    startTransition(async () => {
      const result = await createCancelRequest(orderId, reason);
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="flex h-9 sm:h-11 shrink-0 items-center gap-1.5 sm:gap-2 rounded-xl bg-red-50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-red-700 hover:bg-red-100 whitespace-nowrap cursor-pointer sm:shrink sm:flex-1">
            <IconX size={16} stroke={2.5} />
            Cancel Order
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Order</DialogTitle>
          <DialogDescription>
            Tell us why you want to cancel this order.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Reason for cancellation"
        />
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
          <Button
            type="button"
            disabled={isPending || !reason.trim()}
            onClick={submit}
          >
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


