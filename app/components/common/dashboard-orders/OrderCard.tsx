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
  createReturnRequest,
} from "@/helper/order/action";
import { useFileUpload } from "@/helper/useFileUpload";
import { IconDownload, IconEye, IconRefresh, IconX } from "@tabler/icons-react";
import { TrackOrderModal } from "./TrackOrderModal";
import { RaiseSupportModal } from "./RaiseSupportModal";
import { ChangeEvent, useState, useTransition } from "react";
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
  const items = order_details?.order_items;

  const [paying, setPaying] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const router = useRouter();

  const isUnpaid = Boolean(
    order?.isUnpaid ||
    (order?.status === "pending" &&
      order?.paymentStatus !== "success" &&
      order?.payment?.paymentStatus !== "success"),
  );

  const isDelivered = order?.status === "delivered";
  const isCanceled = order?.status === "canceled";
  const canReview =
    !isUnpaid &&
    !isCanceled &&
    ["paid", "processing", "shipped", "delivered", "completed"].includes(
      order?.status,
    );
  const isSubscriptionOnly = Boolean(order?.isSubscriptionOnly);
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
    !isSubscriptionOnly &&
    ["paid", "processing"].includes(order?.status) &&
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
    <Card className="mb-6 overflow-hidden rounded-[20px] border-none bg-white p-0 shadow-sm">
      {/* Header Section: Order ID & Status */}
      <div className="flex items-start justify-between bg-linear-to-r from-[#FFF1F2] to-[#FFFBEB] p-6 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-[16px] font-bold text-[#2D3748]">{order.id}</h3>
            <Badge
              className={`${
                isUnpaid
                  ? "border border-amber-300 bg-amber-100 text-amber-800"
                  : isDelivered
                  ? "bg-[#DCFCE7] text-[#15824D]"
                  : isCanceled
                  ? "bg-red-100 text-red-700"
                  : "bg-[#DCF7FC] text-[#016271]"
              } border-none px-2.5 py-0.5 text-[10px] font-bold uppercase shadow-none`}
            >
              {isUnpaid ? "Payment not completed" : order.status}
            </Badge>
            {isGift && (
              <Badge className="bg-[#9A5B90] text-white border-none px-2.5 py-0.5 text-[10px] font-bold uppercase shadow-none">
                🎁 Gift Order
              </Badge>
            )}
          </div>
          <p className="text-[13px] font-medium text-gray-400">
            Ordered on {new Date(order.createdAt).toLocaleDateString()}
          </p>
          {isGift && giftNote && (
            <p className="mt-1 text-[11px] italic text-[#7E4D77]">
              Gift note: &ldquo;{giftNote}&rdquo;
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-[11px] font-bold tracking-tight text-gray-400 uppercase">
            Total Amount
          </p>
          <p className="text-[18px] font-bold text-[#2D3748]">
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
      <div className="px-6">
        <div className="flex flex-col gap-4">
          {items?.map((item: any, idx: number) => (
            <div
              key={idx}
              className="flex flex-col gap-3 border-b border-gray-100 py-4 last:border-b-0 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-start gap-4">
                <span>{idx + 1}.</span>
                <div className="relative h-20 w-20 overflow-hidden">
                  <Image
                    src={getImageUrl(item.productImage)}
                    alt="product image"
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#2D3748]">
                    {item.productName}
                  </p>
                  <p className="text-[12px] font-medium text-gray-400">
                    Quantity: {item.quantity}
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
                  ₹{item.productPrice}
                </p>
                {isDelivered &&
                  (item.returnRequest ? (
                    <Badge className="border-none bg-orange-100 text-orange-700">
                      Return {item.returnRequest.status ?? "pending"}
                    </Badge>
                  ) : (
                    <ReturnRequestDialog orderItem={item} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tracking Info Section */}
      <div className="flex items-center justify-between px-6">
        <div>
          {/* <p className="text-[11px] text-gray-400 font-bold uppercase">Tracking Number</p>
          <p className="text-[14px] font-bold text-[#2D3748] tracking-wide">{order.trackingNum}</p> */}
        </div>
        <div className="text-right">
          <p className="text-[11px] font-bold text-gray-400 uppercase">
            {isDelivered ? "Delivered At" : "Delivered At"}
          </p>
          <p className="text-[14px] break-all text-[#2D3748]">
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
        <div className="mx-6 mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs font-medium text-amber-900">
          ⚠️ Payment was not completed for this order. Click <strong>Pay now</strong> to complete your order, or cancel if you no longer need it.
        </div>
      )}

      {/* Action Buttons Section */}
      {isUnpaid ? (
        <div className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center">
          <Button
            onClick={handlePayNow}
            disabled={paying || cancelling}
            className="flex flex-1 gap-2 rounded-xl bg-[#016271] py-3 text-sm font-bold text-white hover:bg-[#014d59] md:py-5 cursor-pointer shadow-sm"
          >
            <CreditCard size={18} />
            {paying ? "Opening Payment..." : `Pay now (₹${order.totalAmount})`}
          </Button>

          <Button
            asChild
            variant="outline"
            className="flex flex-1 gap-2 rounded-xl border-gray-200 py-3 font-semibold text-gray-700 hover:bg-gray-50 md:py-5"
          >
            <Link href={`/dashboard/orders/${order.id}`}>
              <IconEye size={18} stroke={2.5} />
              View Details
            </Link>
          </Button>

          <Button
            variant="ghost"
            onClick={handleCancelUnpaid}
            disabled={paying || cancelling}
            className="rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 sm:shrink-0 cursor-pointer"
          >
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 p-6 md:flex-row">
          <Button
            asChild
            className="flex flex-1 gap-2 rounded-xl border border-[#016271] bg-white py-3 font-bold text-[#016271] hover:bg-[#EAF9FC] md:py-5"
          >
            <Link
              href={
                isSubscriptionOnly
                  ? "/dashboard/subscriptions"
                  : `/dashboard/orders/${order.id}`
              }
            >
              <IconEye size={18} stroke={2.5} />
              {isSubscriptionOnly ? "View Subscription" : "View Details"}
            </Link>
          </Button>

          <PackingSlipModal
            order={order}
            items={items}
            paymentMeta={order?.payment?.paymentMeta || order?.paymentMeta}
            triggerButton={
              <Button
                disabled={isSubscriptionOnly}
                className="flex flex-1 gap-2 rounded-xl bg-[#016271] py-3 font-bold hover:bg-[#014d59] md:py-5 cursor-pointer text-white"
              >
                {isGift ? (
                  <Gift className="h-4 w-4" />
                ) : (
                  <IconDownload size={18} stroke={2.5} />
                )}
                {isGift ? "Gift Parcel Slip" : "Download Invoice"}
              </Button>
            }
          />

          {canCancel && <CancelRequestDialog orderId={order.id} />}

          {order?.cancelRequest && !isCanceled && (
            <Button
              disabled
              className="flex-1 rounded-xl bg-orange-100 py-3 font-bold text-orange-700 hover:bg-orange-100 md:py-5"
            >
              Cancel {order.cancelRequest.status ?? "pending"}
            </Button>
          )}

          {canReview && (
            <Button
              onClick={() => reviewHandler()}
              className="flex flex-1 gap-2 rounded-xl bg-[#1D4E4E] py-3 font-bold hover:bg-[#1D4E4E] md:py-5 cursor-pointer"
            >
              Review (+₹50)
            </Button>
          )}

          {/* State ke hisab se sahi Modal call hoga */}
          {!isSubscriptionOnly &&
            (isDelivered ? (
              <RaiseSupportModal order={order} />
            ) : (
              <TrackOrderModal order={order} />
            ))}
        </div>
      )}
    </Card>
  );
};

function CancelRequestDialog({ orderId }: { orderId: string }) {
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
        <Button className="flex flex-1 gap-2 rounded-xl bg-red-50 py-3 font-bold text-red-700 hover:bg-red-100 md:py-5">
          <IconX size={18} stroke={2.5} />
          Cancel Order
        </Button>
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

function ReturnRequestDialog({ orderItem }: { orderItem: any }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const { upload, uploading } = useFileUpload();

  const submit = () => {
    startTransition(async () => {
      const result = await createReturnRequest(orderItem.id, reason, imageUrls);
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  };

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const uploaded = await Promise.all(
      files.map((file) => upload(file, "return-requests")),
    );
    setImageUrls((current) => [
      ...current,
      ...uploaded.map((file) => file.fileKey).filter(Boolean),
    ]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 rounded-xl bg-[#1D4E4E] font-bold hover:bg-[#1D4E4E]">
          <IconRefresh size={16} stroke={2.5} />
          Return
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Return Request</DialogTitle>
          <DialogDescription>
            Share the issue and upload product images for admin review.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Reason for return"
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={onFileChange}
          className="text-sm"
        />
        {imageUrls.length > 0 && (
          <p className="text-muted-foreground text-sm">
            {imageUrls.length} image uploaded
          </p>
        )}
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
            disabled={isPending || uploading || !reason.trim()}
            onClick={submit}
          >
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
