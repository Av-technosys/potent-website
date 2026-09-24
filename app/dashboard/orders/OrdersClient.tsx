/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OrderCard } from "@/app/components/common/dashboard-orders/OrderCard";
import { OrderHistoryHeader } from "@/app/components/common/dashboard-orders/OrderHistoryHeader";
import { OrderReview } from "./OrderReview";

export function OrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const [ordersData] = useState<any[]>(initialOrders || []);
  const [orderReview, setOrderReview] = useState(false);
  const [singleOrderData, setSingleOrderData] = useState<any>(null);
  const router = useRouter();

  if (orderReview) {
    return (
      <OrderReview
        orderDetails={singleOrderData}
        setOrderReview={setOrderReview}
        onClick={() => router.back()}
      />
    );
  }

  if (!ordersData.length) {
    return (
      <div className="space-y-6">
        <OrderHistoryHeader />
        <div className="rounded-2xl bg-white p-8 text-center text-sm font-medium text-gray-500 shadow-sm">
          No orders found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OrderHistoryHeader />

      <div className="flex flex-col">
        {ordersData.map((item: any) => (
          <OrderCard
            key={item.id}
            order_details={item}
            setorderReview={setOrderReview}
            setSingleOrderData={setSingleOrderData}
          />
        ))}
      </div>
    </div>
  );
}
