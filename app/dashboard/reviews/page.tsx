/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";

import { MyReviewCard } from "@/app/components/common/dashboard-review/MyReviewCard";
import {
  ReviewCard,
  ReviewHeader,
} from "@/app/components/common/dashboard-review/ReviewHeader";
import { getReviewableProducts, getUserAllReviews } from "@/helper";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReviewPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewableProducts, setReviewableProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      const [reviewsData, reviewableData]: any = await Promise.all([
        getUserAllReviews(),
        getReviewableProducts(),
      ]);
      setReviews(reviewsData || []);
      setReviewableProducts(reviewableData || []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* 🔹 Header Skeleton */}
        <div className="bg-white p-6 rounded-[15px] shadow-sm">
          <Skeleton className="h-5 w-48 bg-gray-300" />
          <Skeleton className="h-4 w-64 mt-2 bg-gray-200" />
        </div>

        {/* 🔹 Reviews Card Skeleton */}
        <div className="bg-white p-6 rounded-[20px] shadow-sm space-y-6">
          <Skeleton className="h-5 w-32 bg-gray-300" />

          {[...Array(3)].map((_, i) => (
            <div key={i} className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-4">
                <Skeleton className="w-10 h-10 rounded-full bg-gray-300" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-32 bg-gray-300" />
                    <Skeleton className="h-4 w-16 rounded-full bg-gray-200" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24 bg-gray-200" />
                  </div>
                  <Skeleton className="h-4 w-full bg-gray-200" />
                  <Skeleton className="h-4 w-3/4 bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReviewHeader onReviewSuccess={fetchReviews} />

      {reviewableProducts.length > 0 && (
        <div className="bg-white p-6 rounded-[20px] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-bold text-[#2D3748]">
              Write a Review
            </h3>
            <span className="text-xs font-semibold text-[#1B8392] bg-[#E9F7F9] px-3 py-1 rounded-full">
              Earn ₹25 (text) • ₹50 (photo)
            </span>
          </div>
          <div className="space-y-3">
            {reviewableProducts.map((product) => (
              <ReviewCard
                key={`${product.id}-${product.orderId}`}
                product={product}
                onSuccess={fetchReviews}
              />
            ))}
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-[20px] shadow-sm space-y-4">
        <h3 className="text-[16px] font-bold text-[#2D3748]">Your Reviews</h3>

        {reviews?.length > 0 ? (
          reviews.map((review) => (
            <MyReviewCard key={review.id} review={review} />
          ))
        ) : (
          <p className="text-sm text-gray-500 py-4">
            You haven&apos;t submitted any reviews yet. Write a review to earn ₹50 in your Rewards balance!
          </p>
        )}
      </div>
    </div>
  );
}

