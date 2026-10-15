import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  IconTruck,
  IconCircle,
  IconCircleCheckFilled,
} from "@tabler/icons-react";
import { formatOrderDate, canTrackOrder } from "@/lib/orderDisplay";

export const TrackOrderModal = ({
  order,
  triggerButton,
}: {
  order: any;
  triggerButton?: React.ReactNode;
}) => {
  if (!canTrackOrder(order)) {
    return null;
  }
  const status = String(order?.status || "").toLowerCase();
  const isPaidOrPlaced = ["paid", "processing", "packed", "shipped", "delivered", "completed"].includes(status);
  const isPacked = ["processing", "packed", "shipped", "delivered", "completed"].includes(status);
  const isShipped = ["shipped", "delivered", "completed"].includes(status);
  const isDelivered = ["delivered", "completed"].includes(status);

  const orderDate = formatOrderDate(order?.createdAt);
  const updatedDate = formatOrderDate(order?.updatedAt);

  const steps = [
    {
      label: orderDate ? `Order placed, ${orderDate}` : "Order placed",
      done: isPaidOrPlaced,
      detail: orderDate ? `Payment confirmed on ${orderDate}` : "Awaiting confirmation",
    },
    {
      label: isPacked
        ? `Packed${updatedDate && updatedDate !== orderDate ? `, ${updatedDate}` : orderDate ? `, ${orderDate}` : ""}`
        : "Packed",
      done: isPacked,
      detail: isPacked ? "Carefully packaged at Potent warehouse" : "Preparing items for packing",
    },
    {
      label: isShipped
        ? `Shipped, ${updatedDate || orderDate}`
        : "Shipped",
      done: isShipped,
      detail: isShipped ? "Handed over to courier partner" : "Waiting for courier pickup",
    },
    {
      label: isDelivered
        ? `Delivered, ${updatedDate || orderDate}`
        : "Delivered",
      done: isDelivered,
      detail: isDelivered
        ? "Package delivered to shipping address"
        : isShipped
          ? "Estimated delivery in 2–4 business days"
          : "Estimated delivery in 3–5 business days",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button
            variant="outline"
            className="flex h-9 sm:h-11 shrink-0 items-center gap-1.5 sm:gap-2 rounded-xl border-[#1B8392] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-[#1B8392] hover:bg-cyan-50 whitespace-nowrap cursor-pointer sm:shrink sm:flex-1"
          >
            <IconTruck size={16} stroke={2.5} />
            Track Order
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="rounded-2xl p-5 sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-[18px] font-bold text-[#2D3748] flex items-center gap-2">
            <IconTruck className="h-5 w-5 text-[#016271]" />
            <span>Track Order</span>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-1 mb-2 rounded-xl bg-[#E2F2F5] p-3.5 space-y-1">
          <p className="text-[13px] font-bold text-[#2D3748]">
            Order #{order.id}
          </p>
          {orderDate && (
            <p className="text-[11px] font-medium text-gray-500">
              Ordered on: {orderDate}
            </p>
          )}
        </div>

        {/* Courier Details Card if Shipped */}
        {isShipped && !isDelivered && (
          <div className="rounded-xl border border-[#016271]/20 bg-[#F0F9FA] p-3 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#016271] uppercase tracking-wide text-[10px]">
                Courier Dispatch Info
              </span>
              <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                In Transit
              </span>
            </div>
            <p className="text-gray-700">
              Courier Partner: <strong>FedEx / Express Logistics</strong>
            </p>
            <p className="text-gray-700">
              Dispatched On: <strong>{updatedDate || orderDate}</strong>
            </p>
            <p className="text-gray-600 text-[11px]">
              Expected Delivery: <strong>Within 2–4 business days</strong>
            </p>
          </div>
        )}

        <div className="relative ml-2 space-y-0 pt-2">
          {/* Vertical Line */}
          <div className="absolute top-3 bottom-4 left-[9px] w-[2px] bg-gray-200" />

          {/* Status Steps */}
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative z-10 flex items-start gap-4 pb-6 last:pb-0"
            >
              {step.done ? (
                <IconCircleCheckFilled
                  size={20}
                  className="bg-white text-[#067D38] shrink-0"
                />
              ) : (
                <IconCircle size={20} className="bg-white text-gray-300 shrink-0" />
              )}
              <div className="space-y-0.5">
                <p
                  className={`text-[13px] font-bold ${
                    step.done ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[11px] text-gray-500">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

