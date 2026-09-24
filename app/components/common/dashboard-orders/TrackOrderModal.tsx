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

export const TrackOrderModal = ({ order }: { order: any }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button
        variant="outline"
        className="flex flex-1 gap-2 rounded-xl border-[#1B8392] py-3 font-bold text-[#1B8392] hover:bg-cyan-50 md:py-5"
      >
        <IconTruck size={18} stroke={2.5} />
        Track Order
      </Button>
    </DialogTrigger>
    <DialogContent className="rounded-xl p-4 sm:max-w-[400px]">
      <DialogHeader>
        <DialogTitle className="text-[18px] font-bold text-[#2D3748]">
          Track Order
        </DialogTitle>
      </DialogHeader>

      <div className="mt-1 mb-3 rounded-xl bg-[#E2F2F5] p-4">
        <p className="text-[14px] font-bold text-[#2D3748]">
          Order: {order.id}
        </p>
        <p className="text-[12px] font-medium text-gray-500">
          Date: 23/05/2025
        </p>
      </div>

      <div className="relative ml-2 space-y-0">
        {/* Vertical Line */}
        <div className="absolute top-2 bottom-2 left-[9px] w-[2px] bg-gray-100" />

        {/* Status Steps */}
        {[
          { label: "Order Confirmed, 23/05/2025", done: true },
          { label: "Order Shipped, 23/05/2025", done: true },
          { label: "Out for Delivery", done: false },
          { label: "Delivered", done: false },
        ].map((step, idx) => (
          <div
            key={idx}
            className="relative z-10 flex items-start gap-4 pb-8 last:pb-0"
          >
            {step.done ? (
              <IconCircleCheckFilled
                size={20}
                className="bg-white text-[#067D38]"
              />
            ) : (
              <IconCircle size={20} className="bg-white text-gray-300" />
            )}
            <p
              className={`text-[14px] font-bold ${step.done ? "text-gray-500" : "text-gray-300"}`}
            >
              {step.label}
            </p>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        className="mt-6 h-12 w-full rounded-xl border-[#016271] font-bold tracking-wider text-[#016271] uppercase"
      >
        Cancel
      </Button>
    </DialogContent>
  </Dialog>
);
