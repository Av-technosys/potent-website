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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { IconPencil, IconStarFilled } from "@tabler/icons-react";
import { toast } from "sonner";

interface WriteReviewModalProps {
  product?: any;
  trigger?: React.ReactNode;
  btnClassName?: string;
  btnStyle?: React.CSSProperties;
}

export const WriteReviewModal = ({
  product,
  trigger,
  btnClassName,
  btnStyle,
}: WriteReviewModalProps) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const productName = product?.name || product?.title || "Product";
  const productId = product?.id || product?.slug || "general";

  const submitReview = async () => {
    if (!comment.trim()) {
      toast.error("Please write your review");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "user_guest",
          name: userName.trim() || "Verified Buyer",
          productName: productName,
          productId: productId,
          rating: rating,
          message: comment.trim(),
        }),
      });

      if (response.ok) {
        toast.success("Review submitted successfully!");
        setComment("");
        setUserName("");
        setOpen(false);
      } else {
        toast.error("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Review Submit Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            style={btnStyle}
            className={
              btnClassName ||
              "flex h-11 gap-2 rounded-xl bg-[#016271] px-6 font-semibold text-white hover:bg-[#2494a8] max-sm:w-full cursor-pointer"
            }
          >
            <IconPencil size={18} />
            Write a review
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="rounded-xl p-5 sm:max-w-[420px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-[18px] font-semibold text-[#2D3748]">
            Write a Review
          </DialogTitle>
        </DialogHeader>

        <div className="my-1 rounded-xl bg-[#E9F7F9] p-3.5 text-xs">
          <p className="font-bold text-[#2D3748]">{productName}</p>
          {product?.orderId && (
            <p className="font-medium text-gray-500 mt-0.5">Order: {product.orderId}</p>
          )}
        </div>

        <div className="space-y-4 text-center">
          {/* Rating */}
          <div className="space-y-1.5">
            <label className="block text-left text-[14px] font-semibold text-[#333333]">
              Your Rating
            </label>

            <div className="flex justify-center gap-2 py-1">
              {[...Array(5)].map((_, i) => (
                <IconStarFilled
                  key={i}
                  size={28}
                  onClick={() => setRating(i + 1)}
                  className={`cursor-pointer transition-transform hover:scale-110 ${
                    rating >= i + 1 ? "text-[#FFD400]" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* User Name */}
          <div className="space-y-1 text-left">
            <label className="text-[14px] font-semibold text-[#333333]">
              Your Name / Nickname
            </label>
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Priya Sharma (optional)"
              className="rounded-xl border-gray-200 focus-visible:ring-[#1B8392]"
            />
          </div>

          {/* Review Text */}
          <div className="space-y-1 text-left">
            <label className="text-[14px] font-semibold text-[#333333]">
              Your Review
            </label>

            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              className="min-h-[100px] rounded-xl border-gray-200 focus-visible:ring-[#1B8392]"
            />

            <p className="text-[10px] font-semibold text-gray-400 uppercase text-right mt-1">
              {comment.length}/500 Characters
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <Button
            onClick={submitReview}
            disabled={loading}
            className="h-11 flex-1 rounded-xl bg-[#1B8392] font-bold text-white hover:bg-[#016271] cursor-pointer"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="h-11 flex-1 rounded-xl border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
