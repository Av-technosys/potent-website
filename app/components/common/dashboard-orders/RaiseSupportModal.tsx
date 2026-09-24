import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconAlertCircle } from "@tabler/icons-react";
import { Textarea } from "@/components/ui/textarea";

export const RaiseSupportModal = ({ order }: { order: any }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button
        variant="outline"
        className="flex flex-1 gap-2 rounded-xl border-[#016271] py-3 font-bold text-[#016271] hover:bg-cyan-50 md:py-5"
      >
        <IconAlertCircle size={18} stroke={2.5} />
        Raise Issue
      </Button>
    </DialogTrigger>
    <DialogContent className="rounded-xl p-4 sm:max-w-[400px]">
      <DialogHeader>
        <DialogTitle className="text-[18px] font-bold text-[#2D3748]">
          Raise Support
        </DialogTitle>
      </DialogHeader>

      <div className="mt-2 mb-2 rounded-xl bg-[#E2F2F5] p-4">
        <p className="text-[14px] font-bold text-[#2D3748]">
          Order: {order.id}
        </p>
        <p className="text-[12px] font-medium text-gray-500">
          Date: 23/05/2025
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-[14px] font-semibold text-[#2D3748]">
          Describe your issue
        </label>
        <Textarea
          placeholder="Please describe your issue which you are facing with this order..."
          className="min-h-[100px] rounded-md border-gray-300 focus-visible:ring-[#1B8392]"
        />
        <p className="text-[11px] font-bold text-gray-400 uppercase">
          0/500 Words
        </p>
      </div>

      <div className="mt-6 flex gap-4">
        <Button className="h-12 flex-1 rounded-xl bg-[#016271] font-bold hover:bg-[#016271]">
          Submit Issue
        </Button>
        <Button
          variant="outline"
          className="h-12 flex-1 rounded-xl border-[#016271] font-bold text-[#016271] uppercase"
        >
          Cancel
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);
