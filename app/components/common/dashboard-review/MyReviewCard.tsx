import { Star, User } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/imageUrl";

function formatRewardDate(dateInput?: Date | string | null): string {
  if (!dateInput) return "";
  const parsed = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const MyReviewCard = ({ review }: { review: any }) => (
  <div className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
    <div className="flex items-start gap-4">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
        <User className="w-5 h-5 text-teal-600" />
      </div>

      <div className="flex-1">
        {/* Name + Badge */}
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-[#2D3748]">{review.name}</p>
          {review.productName && (
            <span className="text-xs bg-[#E9F7F9] text-[#016271] font-medium px-2.5 py-0.5 rounded-full">
              {review.productName}
            </span>
          )}
          <span
            className={`text-xs ${
              review.isAdminApproved
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-amber-700"
            } px-2 py-0.5 rounded-full font-medium`}
          >
            {review.isAdminApproved ? "Approved" : "Pending Approval"}
          </span>
          {review.isAdminApproved ? (
            <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
              +{review?.media?.length > 0 ? "₹50" : "₹25"} Reward Earned
            </span>
          ) : (
            <span className="text-xs bg-amber-50 text-amber-700 font-medium px-2 py-0.5 rounded-full">
              Reward Pending Approval
            </span>
          )}
        </div>

        {/* Stars + Time */}
        <div className="flex items-center gap-2 mt-1">
          <div className="flex text-yellow-400">
            {Array(Number(review.rating) || 0)
              .fill(0)
              .map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400" />
              ))}
          </div>
          <span className="text-xs text-gray-500">
            ({formatRewardDate(review.createdAt)})
          </span>
        </div>

        {/* Content */}
        <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
          {review.message}
        </p>

        {review?.media?.length > 0 && (
          <div className="w-full mt-3 flex items-center gap-2">
            {review.media.map((media: any, index: number) => (
              <Image
                key={index}
                src={getImageUrl(media.mediaURL)}
                alt="reviewImage"
                width={80}
                height={80}
                className="w-20 h-20 rounded-md object-cover"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

