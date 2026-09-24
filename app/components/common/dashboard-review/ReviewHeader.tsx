
export const ReviewHeader = () => (
  <div className="bg-white p-6 rounded-[15px] shadow-sm mb-6">
    <h2 className="text-[18px] font-bold text-[#2D3748]">Reviews & Ratings</h2>
    <p className="text-[13px] text-gray-500 font-medium">Share your experience with our products</p>
  </div>
);

import { WriteReviewModal } from "./WriteReviewModal";

export const ReviewCard = ({ product }: { product: any }) => (
  <div className="flex md:flex-row flex-col gap-8 justify-between items-center p-4 border border-gray-200 rounded-xl transition-all hover:none">
    <div className="space-y-1">
      <p className="text-[14px] font-bold text-[#2D3748]">{product.name}</p>
      <p className="text-[12px] text-gray-400 font-medium">Order: {product.orderId} • Delivered: {product.deliveredDate}</p>
    </div>
    <WriteReviewModal product={product} />
  </div>
);