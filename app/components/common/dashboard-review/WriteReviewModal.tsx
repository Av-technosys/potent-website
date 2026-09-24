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

import { IconPencil, IconStarFilled } from "@tabler/icons-react";
import { apiFetch } from "@/lib/apiFetch";
import { toast } from "sonner";

export const WriteReviewModal = ({ product }: { product: any }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    if (!comment.trim()) {
      alert("Please write your review");
      return;
    }

    try {
      setLoading(true);

      const res = await apiFetch("/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: 1,
          productName: product.name,
          orderId: product.orderId,
          rating: rating,
          comment: comment,
          deliveredDate: product.deliveredDate,
        }),
      });

      if (res.status === 200) {
        toast.success("✅ Review submitted successfully");

        // better than reload (optional)
        // update state instead of reload
        window.location.reload();
      } else {
        toast.error(res.data?.error || "❌ Failed to submit review");
      }
    } catch (error) {
      console.error(" Review Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex h-11 gap-2 rounded-xl bg-[#016271] px-6 font-semibold hover:bg-[#2494a8] max-sm:w-full">
          <IconPencil size={18} />
          Write a review
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-xl p-4 sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-[18px] font-semibold text-[#2D3748]">
            Write a Review
          </DialogTitle>
        </DialogHeader>

        <div className="my-1 rounded-xl bg-[#E9F7F9] p-4">
          <p className="text-[14px] font-bold text-[#2D3748]">
            Order: {product.orderId}
          </p>

          <p className="text-[12px] font-medium text-gray-500">
            Date: {product.deliveredDate}
          </p>
        </div>

        <div className="space-y-2 text-center">
          <div className="space-y-1">
            <label className="block text-left text-[14px] font-semibold text-[#333333]">
              Your Rating
            </label>

            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <IconStarFilled
                  key={i}
                  size={26}
                  onClick={() => setRating(i + 1)}
                  className={`cursor-pointer transition-transform hover:scale-110 ${
                    rating >= i + 1 ? "text-[#FFD400]" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2 text-left">
            <label className="text-[14px] font-semibold text-[#333333]">
              Your Review
            </label>

            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              className="min-h-[80px] rounded-xl border-gray-100 focus-visible:ring-[#1B8392]"
            />

            <p className="text-[10px] font-semibold text-gray-400 uppercase">
              {comment.length}/500 Words
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Button
            onClick={submitReview}
            disabled={loading}
            className="h-12 flex-1 rounded-md bg-[#1B8392] font-bold hover:bg-[#016271]"
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>

          <Button
            variant="outline"
            className="h-12 flex-1 rounded-md border-[#1B8392] font-bold text-[#1B8392]"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
