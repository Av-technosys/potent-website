/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/page.tsx

import { getUserProfile } from "@/helper";
import { redirect } from "next/navigation";

import { StatsCards } from "../components/common/dashboard/StatsCards";
import { RecentOrders } from "../components/common/dashboard/RecentOrders";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let data;

  try {
    data = await getUserProfile();
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      redirect("/login");
    }
    throw err;
  }

  return (
    <div className="mx-auto flex max-w-325 items-start gap-8">
      <div className="w-full flex-1">
        {/* HEADER */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-linear-to-r from-[#016271] to-[#AFE7F1] p-10 text-white shadow-sm">
          <div className="relative z-10">
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight">
              Welcome back, {data.user.fullName || "User"}
            </h1>

            <p className="text-[15px] font-medium text-white/80">
              Manage your account, track orders
            </p>
          </div>
        </div>

        {/* STATS */}
        <StatsCards stats={data.stats} />

        {/* ORDERS */}
        <RecentOrders orders={data.orders} />

        {/* <RecentRewards/> */}
      </div>
    </div>
  );
}
