
import { WriteReviewModal } from "./WriteReviewModal";

export const ReviewHeader = ({ onReviewSuccess }: { onReviewSuccess?: () => void }) => (
  <div className="bg-white p-6 rounded-[15px] shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h2 className="text-[18px] font-bold text-[#2D3748]">Reviews & Ratings</h2>
      <p className="text-[13px] text-gray-500 font-medium">
        Share your experience with our products and earn ₹50 cash credit per review
      </p>
    </div>
    <WriteReviewModal onSuccess={onReviewSuccess} />
  </div>
);

export const ReviewCard = ({
  product,
  onSuccess,
}: {
  product: any;
  onSuccess?: () => void;
}) => (
  <div className="flex md:flex-row flex-col gap-4 justify-between items-start md:items-center p-4 border border-gray-200 rounded-xl transition-all">
    <div className="space-y-1">
      <p className="text-[14px] font-bold text-[#2D3748]">{product.name}</p>
      <p className="text-[12px] text-gray-400 font-medium">
        Order: {product.orderId}
        {product.deliveredDate ? ` • Ordered: ${product.deliveredDate}` : ""}
      </p>
    </div>
    <WriteReviewModal product={product} onSuccess={onSuccess} />
  </div>
);