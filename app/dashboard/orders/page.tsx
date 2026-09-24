/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import { getOrdersByUserId } from "@/helper/order/action";
import { OrdersClient } from "./OrdersClient";

export const dynamic = "force-dynamic";

export default async function OrderHistoryPage() {
  let ordersData: any[] = [];

  try {
    ordersData = (await getOrdersByUserId()) || [];
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      redirect(
        `/login?redirect=${encodeURIComponent("/dashboard/orders")}`,
      );
    }

    throw error;
  }

  return <OrdersClient initialOrders={ordersData} />;
}
