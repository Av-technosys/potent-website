/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

import { MyReviewCard } from "@/app/components/common/dashboard-review/MyReviewCard";
import {

  ReviewHeader,
} from "@/app/components/common/dashboard-review/ReviewHeader";
import { getUserAllReviews } from "@/helper";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReviewPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviews_data: any = await getUserAllReviews();
        setReviews(reviews_data || []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

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
                {/* Avatar */}
                <Skeleton className="w-10 h-10 rounded-full bg-gray-300" />

                <div className="flex-1 space-y-2">
                  {/* Name + badge */}
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-32 bg-gray-300" />
                    <Skeleton className="h-4 w-16 rounded-full bg-gray-200" />
                  </div>

                  {/* Stars + date */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24 bg-gray-200" />
                  </div>

                  {/* Message */}
                  <Skeleton className="h-4 w-full bg-gray-200" />
                  <Skeleton className="h-4 w-3/4 bg-gray-200" />

                  {/* Images */}
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="w-20 h-20 rounded-md bg-gray-200" />
                    <Skeleton className="w-20 h-20 rounded-md bg-gray-200" />
                  </div>
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
      <ReviewHeader />
      <div className="bg-white p-6 rounded-[20px] shadow-sm space-y-4">
        <h3 className="text-[16px] font-bold text-[#2D3748]">Your Review</h3>

        {reviews?.map((review) => (
          <MyReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
