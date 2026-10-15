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
import { Badge } from "@/components/ui/badge";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { Textarea } from "@/components/ui/textarea";
import { formatOrderDate } from "@/lib/orderDisplay";
import { submitOrderIssue } from "@/helper/order/action";
import { useFileUpload } from "@/helper/useFileUpload";
import { getImageUrl } from "@/lib/imageUrl";
import { toast } from "sonner";
import { Loader2, UploadCloud, X, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface UploadedPhoto {
  fileUrl: string;
  fileKey: string;
  preview: string;
}

export const RaiseSupportModal = ({
  order,
  triggerButton,
}: {
  order: any;
  triggerButton?: React.ReactNode;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [issueText, setIssueText] = useState("");
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { upload, uploading } = useFileUpload();

  // Extract items list from order
  const rawItems: any[] =
    order?.items && Array.isArray(order.items) && order.items.length > 0
      ? order.items
      : order?.order_items && Array.isArray(order.order_items) && order.order_items.length > 0
        ? order.order_items
        : [];

  const items = rawItems.map((item, index) => {
    const name =
      item.productName ||
      item.productVarientName ||
      item.product?.name ||
      item.name ||
      `Product ${index + 1}`;
    return {
      id: item.id || String(index),
      name,
    };
  });

  // Extract all existing issue/return requests for this order (including closed/rejected ones)
  const existingRequests: any[] = Array.isArray(order?.returnRequests)
    ? order.returnRequests.filter(Boolean)
    : order?.returnRequest
      ? [order.returnRequest]
      : [];

  const isAnyPending = existingRequests.some((r) => r && r.status === "pending");

  const isProductActive = (prodName: string) => {
    if (existingRequests.length === 0) return false;
    return existingRequests.some((r) => {
      if (!r.userReason) return true;
      if (r.userReason.includes(`[Product: ${prodName}]`)) return true;
      if (items.length === 1) return true;
      if (r.userReason.includes("All products in order")) return true;
      return false;
    });
  };

  const availableProducts = items.filter((it) => !isProductActive(it.name));
  const allProductsHaveIssues =
    items.length > 0 ? availableProducts.length === 0 : existingRequests.length > 0;

  const defaultSelection =
    availableProducts.length > 0
      ? availableProducts[0].name
      : items[0]?.name || "Entire Order";

  const [selectedProduct, setSelectedProduct] = useState<string>(defaultSelection);

  const orderDate = formatOrderDate(order?.createdAt);
  const words = issueText.trim() ? issueText.trim().split(/\s+/).length : 0;
  const isOverLimit = words > 500;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 5 - photos.length;
    if (remainingSlots <= 0) {
      toast.error("You can upload a maximum of 5 photos");
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      toast.info(`Only ${remainingSlots} more photo(s) can be added (max 5)`);
    }

    for (const file of filesToUpload) {
      try {
        const res = await upload(file, "order-issues");
        if (res?.fileUrl || res?.fileKey) {
          const url = res.fileUrl || res.fileKey;
          setPhotos((prev) => [
            ...prev,
            {
              fileUrl: url,
              fileKey: res.fileKey,
              preview: res.preview || url,
            },
          ]);
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

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
      const chosenProduct =
        selectedProduct ||
        (availableProducts.length > 0 ? availableProducts[0].name : "Entire Order");

      const res = await submitOrderIssue({
        orderId: order.id,
        issueText: issueText.trim(),
        productName: chosenProduct,
        imageUrls: photos.map((p) => p.fileUrl),
      });

      if (res.success) {
        setSubmitted(true);
        toast.success(res.message || "We've got your message");
        router.refresh();
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
        setPhotos([]);
        setSubmitted(false);
        setSelectedProduct(
          availableProducts.length > 0
            ? availableProducts[0].name
            : items[0]?.name || "Entire Order",
        );
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button
            variant="outline"
            className={`flex h-9 sm:h-11 shrink-0 items-center gap-1.5 sm:gap-2 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer sm:shrink sm:flex-1 ${
              allProductsHaveIssues
                ? isAnyPending
                  ? "border-amber-300 bg-amber-50/70 text-amber-800 hover:bg-amber-100"
                  : "border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "border-[#016271] text-[#016271] hover:bg-cyan-50"
            }`}
          >
            <IconAlertCircle size={16} stroke={2.5} />
            {allProductsHaveIssues
              ? isAnyPending
                ? "Issue Under Review"
                : "Issue Closed"
              : "Raise Issue"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="rounded-2xl p-6 sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="py-6 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <IconCheck className="h-7 w-7 text-emerald-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900">
              We&apos;ve got your message
            </DialogTitle>
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
              Our customer care team has received your issue request regarding Order #{order.id} and will assist you shortly.
            </p>
            <Button
              onClick={() => handleOpenChange(false)}
              className="mt-4 rounded-xl bg-[#016271] px-6 text-sm font-semibold text-white hover:bg-[#014d59]"
            >
              Done
            </Button>
          </div>
        ) : allProductsHaveIssues ? (
          <div className="py-2 space-y-4">
            <DialogHeader>
              <DialogTitle className="text-[18px] font-bold text-[#2D3748] flex items-center gap-2">
                <IconAlertCircle className={`h-5 w-5 ${isAnyPending ? "text-amber-600" : "text-gray-600"}`} />
                <span>{isAnyPending ? "Issue Under Review" : "Issue Closed"}</span>
              </DialogTitle>
            </DialogHeader>

            <div className={`rounded-xl border p-4 space-y-3 ${isAnyPending ? "border-amber-200 bg-amber-50/90" : "border-gray-200 bg-gray-50/90"}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900">
                  Order #{order.id}
                </span>
                <Badge className={`${
                  existingRequests[0]?.status === "pending"
                    ? "bg-amber-200 text-amber-900 border-amber-300"
                    : existingRequests[0]?.status === "cancelled" || existingRequests[0]?.status === "rejected"
                      ? "bg-red-100 text-red-800 border-red-200"
                      : "bg-emerald-100 text-emerald-800 border-emerald-200"
                } capitalize text-xs`}>
                  {existingRequests[0]?.status === "cancelled" ? "Closed / Rejected" : existingRequests[0]?.status || "pending"}
                </Badge>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {isAnyPending
                  ? "An issue has already been raised for this order/product. Our care team is actively reviewing it."
                  : "An issue for this order/product has already been processed and closed by our care team. Under company policy, an issue can only be submitted once per product."}
              </p>

              {existingRequests.map((req, idx) => (
                <div
                  key={req.id || idx}
                  className="rounded-lg bg-white p-3 border border-gray-200 text-xs text-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-500 block text-[11px]">
                      Submitted Details:
                    </span>
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {req.status === "cancelled" ? "Closed" : req.status}
                    </Badge>
                  </div>
                  <p className="font-medium whitespace-pre-wrap">
                    {req.userReason || "Issue raised by customer"}
                  </p>
                  {req.adminReason && (
                    <div className="mt-1.5 pt-1.5 border-t border-gray-100 text-[11px] text-gray-600">
                      <span className="font-semibold text-gray-700">Team Note: </span>
                      <span>{req.adminReason}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={() => handleOpenChange(false)}
              className="w-full rounded-xl bg-[#016271] h-10 font-bold hover:bg-[#014d59] text-white"
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-[18px] font-bold text-[#2D3748] flex items-center gap-2">
                <IconAlertCircle className="h-5 w-5 text-[#016271]" />
                <span>Raise Support / Issue</span>
              </DialogTitle>
            </DialogHeader>

            {/* Order info badge */}
            <div className="mt-2 rounded-xl bg-[#E2F2F5] p-3 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-bold text-[#2D3748]">
                  Order #{order.id}
                </p>
                {orderDate && (
                  <p className="text-[11px] font-medium text-gray-500">
                    {orderDate}
                  </p>
                )}
              </div>
            </div>

            {/* Product Selector if multi-item */}
            {items.length > 1 ? (
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-[#2D3748]">
                  Select Affected Product
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-800 shadow-xs focus:border-[#016271] focus:outline-hidden focus:ring-1 focus:ring-[#016271]"
                >
                  {items.map((it) => {
                    const isRaised = isProductActive(it.name);
                    return (
                      <option key={it.id} value={it.name} disabled={isRaised}>
                        {it.name} {isRaised ? "(Issue already raised)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            ) : items.length === 1 ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50/70 px-3 py-2 text-xs text-gray-700">
                <span className="font-semibold text-gray-500">Product: </span>
                <span className="font-bold text-gray-900">{items[0].name}</span>
              </div>
            ) : null}

            {/* Issue Description */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#2D3748]">
                Describe your issue <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={issueText}
                onChange={(e) => setIssueText(e.target.value)}
                placeholder="Please describe the issue you are facing with this product/order (e.g., damaged packaging, missing item, wrong variant)..."
                className="min-h-[105px] rounded-xl border-gray-300 focus-visible:ring-[#1B8392] text-xs leading-relaxed"
              />
              <div className="flex justify-between items-center text-[11px]">
                <p
                  className={`font-bold uppercase ${
                    isOverLimit ? "text-red-600 font-extrabold" : "text-gray-400"
                  }`}
                >
                  {words}/500 Words
                </p>
                {isOverLimit && (
                  <span className="text-red-600 font-semibold">
                    Word limit exceeded
                  </span>
                )}
              </div>
            </div>

            {/* Photo Upload Section (Min 0, Max 5, 1 recommended) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-semibold text-[#2D3748] flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4 text-[#016271]" />
                  <span>Attach Photos</span>
                  <span className="text-xs text-gray-500 font-normal">(Optional)</span>
                </label>
                <span className="text-[11px] font-medium text-gray-500">
                  {photos.length}/5 photos
                </span>
              </div>

              {/* Upload Drop Zone / Button */}
              {photos.length < 5 && (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#016271] rounded-xl p-3 cursor-pointer bg-gray-50/60 hover:bg-cyan-50/30 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploading || isSubmitting}
                    className="hidden"
                  />
                  {uploading ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#016271]">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading photo...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                      <UploadCloud className="h-4 w-4 text-[#016271]" />
                      <span>
                        {photos.length === 0
                          ? "Attach photo of product / package (Recommended)"
                          : "Upload another photo"}
                      </span>
                    </div>
                  )}
                </label>
              )}

              {/* Uploaded Thumbnails Preview */}
              {photos.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {photos.map((photo, idx) => (
                    <div
                      key={idx}
                      className="relative h-16 w-16 rounded-lg border border-gray-200 overflow-hidden group bg-gray-100 shadow-xs"
                    >
                      <img
                        src={getImageUrl(photo.preview)}
                        alt={`Photo ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        disabled={isSubmitting}
                        className="absolute top-0.5 right-0.5 rounded-full bg-red-600 text-white p-0.5 shadow-sm hover:bg-red-700 transition cursor-pointer"
                        title="Remove photo"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-3">
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
                className="flex-1 rounded-xl border-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  uploading ||
                  !issueText.trim() ||
                  isOverLimit
                }
                className="h-11 flex-1 rounded-xl bg-[#016271] font-bold hover:bg-[#014d59] text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
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
