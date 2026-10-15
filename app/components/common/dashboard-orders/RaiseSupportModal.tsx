"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { Textarea } from "@/components/ui/textarea";
import { formatOrderDate } from "@/lib/orderDisplay";
import { submitOrderIssue } from "@/helper/order/action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const RaiseSupportModal = ({
  order,
  triggerButton,
}: {
  order: any;
  triggerButton?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [issueText, setIssueText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const orderDate = formatOrderDate(order?.createdAt);
  const words = issueText.trim() ? issueText.trim().split(/\s+/).length : 0;
  const isOverLimit = words > 500;

  const handleSubmit = async () => {
    if (!issueText.trim()) {
      toast.error("Please describe your issue before submitting");
      return;
    }
    if (isOverLimit) {
      toast.error("Please keep your description within 500 words");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await submitOrderIssue(order.id, issueText);
      if (res.success) {
        setSubmitted(true);
        toast.success("We've got your message");
      } else {
        toast.error(res.message || "Failed to submit issue");
      }
    } catch {
      toast.error("An error occurred while submitting your issue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(() => {
        setIssueText("");
        setSubmitted(false);
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button
            variant="outline"
            className="flex h-9 sm:h-11 shrink-0 items-center gap-1.5 sm:gap-2 rounded-xl border-[#016271] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-[#016271] hover:bg-cyan-50 whitespace-nowrap cursor-pointer sm:shrink sm:flex-1"
          >
            <IconAlertCircle size={16} stroke={2.5} />
            Raise Issue
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="rounded-2xl p-6 sm:max-w-[420px]">
        {submitted ? (
          <div className="py-6 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <IconCheck className="h-7 w-7 text-emerald-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900">
              We&apos;ve got your message
            </DialogTitle>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
              Our customer care team has received your message regarding Order #{order.id} and will assist you shortly.
            </p>
            <Button
              onClick={() => handleOpenChange(false)}
              className="mt-4 rounded-xl bg-[#016271] px-6 text-sm font-semibold text-white hover:bg-[#014d59]"
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-[18px] font-bold text-[#2D3748] flex items-center gap-2">
                <IconAlertCircle className="h-5 w-5 text-[#016271]" />
                <span>Raise Support</span>
              </DialogTitle>
            </DialogHeader>

            <div className="mt-2 mb-2 rounded-xl bg-[#E2F2F5] p-3.5 space-y-1">
              <p className="text-[13px] font-bold text-[#2D3748]">
                Order #{order.id}
              </p>
              {orderDate && (
                <p className="text-[12px] font-medium text-gray-500">
                  Ordered on: {orderDate}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#2D3748]">
                Describe your issue
              </label>
              <Textarea
                value={issueText}
                onChange={(e) => setIssueText(e.target.value)}
                placeholder="Please describe the issue you are facing with this order..."
                className="min-h-[120px] rounded-xl border-gray-300 focus-visible:ring-[#1B8392] text-sm"
              />
              <div className="flex justify-between items-center">
                <p
                  className={`text-[11px] font-bold uppercase ${
                    isOverLimit ? "text-red-600 font-extrabold" : "text-gray-400"
                  }`}
                >
                  {words}/500 Words
                </p>
                {isOverLimit && (
                  <span className="text-[11px] text-red-600 font-semibold">
                    Word limit exceeded
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="flex-1 rounded-xl border-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !issueText.trim() || isOverLimit}
                className="h-11 flex-1 rounded-xl bg-[#016271] font-bold hover:bg-[#014d59] text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Submit Issue"
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
