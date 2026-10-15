"use client";

import { Star, ThumbsUp, User } from "lucide-react";
import { WriteReviewModal } from "../dashboard-review/WriteReviewModal";

export default function ProductReviews({ reviews, product, themeColor }: any) {
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  const darkColor = themeColor?.darkColor || "#016271";
  const lightColor = themeColor?.lightColor || "#E6F4F6";
  const textColor = themeColor?.textColor || "#016271";

  const reviewCounts = [1, 2, 3, 4, 5].reduce(
    (acc: Record<number, number>, stars) => ({
      ...acc,
      [stars]: safeReviews.filter((review: any) => Number(review.rating) === stars)
        .length,
    }),
    {},
  );

  const ratings = [
    { stars: 5, count: reviewCounts[5] || 0 },
    { stars: 4, count: reviewCounts[4] || 0 },
    { stars: 3, count: reviewCounts[3] || 0 },
    { stars: 2, count: reviewCounts[2] || 0 },
    { stars: 1, count: reviewCounts[1] || 0 },
  ];

  const totalReviews = ratings.reduce((sum, r) => sum + r.count, 0);

  // Avoid divide by 0
  const averageRating =
    totalReviews === 0
      ? "0.0"
      : (
          ratings.reduce((sum, r) => sum + r.stars * r.count, 0) / totalReviews
        ).toFixed(1);

  // Convert to percentage
  const ratingBreakdown = ratings.map((r) => ({
    stars: r.stars,
    percent:
      totalReviews === 0 ? 0 : Math.round((r.count / totalReviews) * 100),
  }));

  return (
    <div className="py-10">
      {/* TOP SUMMARY CARD */}
      <div className="bg-gray-100 border border-gray-200 rounded-xl p-8 flex flex-col md:flex-row justify-between gap-10">
        {/* LEFT */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-4">Customer Reviews</h2>

          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold">{averageRating}</span>

            <div>
              <div className="flex text-yellow-400">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400" />
                  ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {totalReviews} {totalReviews === 1 ? "Review" : "Reviews"}
              </p>
            </div>
          </div>

          <WriteReviewModal
            product={product}
            btnStyle={{
              borderColor: darkColor,
              color: darkColor,
            }}
            btnClassName="mt-6 px-5 py-2 text-sm border rounded-full hover:bg-teal-50 transition bg-transparent font-medium cursor-pointer inline-flex items-center gap-2"
          />
        </div>

        {/* RIGHT - Breakdown */}
        <div className="flex-1 space-y-3">
          {ratingBreakdown.map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <span className="text-sm w-6">{item.stars}</span>
              <Star className="w-4 h-4 -ml-5 text-yellow-400 fill-yellow-400" />

              <div className="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="h-full "
                  style={{ width: `${item.percent}%`, backgroundColor: darkColor }}
                />
              </div>

              <span className="text-xs text-gray-600 w-10 text-right">
                {item.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* REVIEW LIST */}
      <div className="mt-10 space-y-8">
        {safeReviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <p className="text-sm font-medium">No reviews yet.</p>
            <p className="text-xs text-gray-400 mt-1">Be the first to share your experience!</p>
          </div>
        ) : (
          safeReviews.map((review: any, index: number) => {
            const formattedDate = review.createdAt
              ? new Date(review.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "";

            const mediaList = Array.isArray(review.media) && review.media.length > 0
              ? review.media
              : review.imageUrl
                ? [{ mediaURL: review.imageUrl }]
                : [];

            return (
              <div key={review.id || index} className="border-b border-gray-200 pb-8">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div
                    style={{ backgroundColor: lightColor }}
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  >
                    <User style={{ color: textColor }} className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Name + Badge */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-medium">{review.name || "Verified Buyer"}</p>
                      <span
                        style={{ backgroundColor: lightColor, color: textColor }}
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                      >
                        Verified Purchase
                      </span>
                    </div>

                    {/* Stars + Time */}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex text-yellow-400">
                        {Array(Math.max(1, Math.min(5, Number(review.rating) || 5)))
                          .fill(0)
                          .map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400" />
                          ))}
                      </div>
                      {formattedDate && (
                        <span className="text-xs text-gray-500">
                          ({formattedDate})
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    {review.message && (
                      <p className="text-sm text-gray-700 mt-2 leading-relaxed whitespace-pre-line">
                        {review.message}
                      </p>
                    )}

                    {/* Review Photos */}
                    {mediaList.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {mediaList.map((m: any, mIdx: number) => {
                          const url = m?.mediaURL || (typeof m === "string" ? m : null);
                          if (!url) return null;
                          return (
                            <a
                              key={mIdx}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 hover:opacity-90 transition shadow-2xs block shrink-0"
                              title="Click to view full image"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={url}
                                alt={`Review photo ${mIdx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </a>
                          );
                        })}
                      </div>
                    )}

                    {/* Helpful */}
                    <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-xs">Helpful</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
