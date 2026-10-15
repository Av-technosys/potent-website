"use client";

import { useState } from "react";
import Image from "next/image";

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
import { Camera, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useFileUpload } from "@/helper/useFileUpload";
import { getImageUrl } from "@/lib/imageUrl";

interface WriteReviewModalProps {
  product?: any;
  trigger?: React.ReactNode;
  btnClassName?: string;
  btnStyle?: React.CSSProperties;
  onSuccess?: () => void;
}

export const WriteReviewModal = ({
  product,
  trigger,
  btnClassName,
  btnStyle,
  onSuccess,
}: WriteReviewModalProps) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoKey, setPhotoKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { upload, uploading } = useFileUpload();
  const router = useRouter();

  const productName =
    product?.name || product?.productName || product?.title || "Potent Product";
  const productId =
    product?.id ||
    product?.productId ||
    product?.slug ||
    product?.productSlug ||
    "general";

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await upload(file, "review");
      const cloudFrontUrl = res?.fileUrl || (res?.fileKey ? getImageUrl(res.fileKey) : res?.preview);
      if (cloudFrontUrl) {
        setPhotoKey(cloudFrontUrl);
        setPhotoPreview(cloudFrontUrl);
        toast.success("Photo uploaded! Eligible for ₹50 reward upon approval.");
      } else {
        toast.error("Failed to upload photo");
      }
    } catch {
      toast.error("Failed to upload photo");
    }
  };

  const removePhoto = () => {
    setPhotoKey(null);
    setPhotoPreview(null);
  };

  const submitReview = async () => {
    if (!comment.trim()) {
      toast.error("Please write your review");
      return;
    }

    if (!photoKey) {
      toast.error("Please attach at least 1 product photo to earn ₹50");
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
          name: userName.trim(),
          productName: productName,
          productId: productId,
          rating: rating,
          message: comment.trim(),
          media: photoKey ? [photoKey] : [],
          imageUrl: photoKey || null,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        toast.success(
          "Review submitted! ₹50 cash credit will be added once approved.",
        );
        setComment("");
        setUserName("");
        setPhotoKey(null);
        setPhotoPreview(null);
        setOpen(false);
        onSuccess?.();
        router.refresh();
      } else {
        toast.error(
          data?.error || "Failed to submit review. Please try again.",
        );
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

      <DialogContent className="rounded-xl p-5 sm:max-w-[440px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[18px] font-semibold text-[#2D3748]">
            Write a Review
          </DialogTitle>
        </DialogHeader>

        <div className="my-1 rounded-xl bg-[#E9F7F9] p-3 text-xs">
          <p className="font-bold text-[#2D3748]">{productName}</p>
          <p className="font-semibold text-[#016271] mt-0.5">
            Earn ₹50 on review (credited on approval) • 1 photo required
          </p>
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

          {/* Photo Upload */}
          <div className="space-y-1.5 text-left">
            <label className="text-[14px] font-semibold text-[#333333] flex items-center justify-between">
              <span>Attach Product Photo <span className="text-red-500">*</span></span>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                1 photo required 
              </span>
            </label>

            {photoPreview ? (
              <div className="relative inline-block mt-2">
                <Image
                  src={photoPreview}
                  alt="Review photo"
                  width={100}
                  height={100}
                  className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-xs"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                {uploading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="animate-spin" size={18} />
                    <span>Uploading photo...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Camera size={18} className="text-[#016271]" />
                    <span>Upload product photo</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <Button
            onClick={submitReview}
            disabled={loading || uploading || !comment.trim() || !photoKey}
            className="h-11 flex-1 rounded-xl bg-[#1B8392] font-bold text-white hover:bg-[#016271] cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
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
