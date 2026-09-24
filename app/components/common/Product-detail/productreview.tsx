"use client";

import { Star, ThumbsUp, User } from "lucide-react";
import Link from "next/link";

export default function ProductReviews({ reviews, product, themeColor }: any) {
  const reviewCounts = [1, 2, 3, 4, 5].reduce(
    (acc: Record<number, number>, stars) => ({
      ...acc,
      [stars]: reviews.filter((review: any) => Number(review.rating) === stars)
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
      ? 0
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
                {totalReviews} Reviews
              </p>
            </div>
          </div>

          <button style={{borderColor:themeColor.darkColor, color:themeColor.darkColor}} className="mt-6 px-5 py-2 text-sm border rounded-full hover:bg-teal-50 transition">
           <Link href={`/dashboard/reviews`}>
            Write a Review
           </Link>
          </button>
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
                  style={{ width: `${item.percent}%`, backgroundColor: themeColor.darkColor }}
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
        {reviews.map((review: any, index: number) => (
          <div key={index} className="border-b border-gray-200 pb-8">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div style={{backgroundColor:themeColor.lightColor}} className="w-10 h-10 rounded-full  flex items-center justify-center">
                <User style={{color:themeColor.textColor}} className="w-5 h-5" />
              </div>

              <div className="flex-1">
                {/* Name + Badge */}
                <div className="flex items-center gap-3">
                  <p className="font-medium">{review.name}</p>
                  <span style={{backgroundColor:themeColor.lightColor, color:themeColor.textColor }} className="text-xs  px-2 py-1 rounded-full">
                    Verified Purchase
                  </span>
                </div>

                {/* Stars + Time */}
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex text-yellow-400">
                    {Array(review.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400" />
                      ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    ({review.createdAt.toDateString()})
                  </span>
                </div>

                {/* Title */}
                {/* <p className="mt-3 font-medium text-sm">
                                    {review.title}
                                </p> */}

                {/* Content */}
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {review.message}
                </p>

                {/* Helpful */}
                <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Helpful</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
