/* eslint-disable @typescript-eslint/no-explicit-any */
// components/common/dashboard/RecentOrders.tsx

import { Badge } from "@/components/ui/badge";

export const RecentOrders = ({ orders }: { orders: any[] }) => {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 mt-6">
      <h2 className="text-[16px] font-semibold text-[#1F2937] mb-5 uppercase tracking-wide">
        Recent Orders
      </h2>

      <div className="flex flex-col gap-3">
        {orders.map((order) => {
          // 🔥 map DB → UI format
          const formatted = {
            id: order.id,
            status: order.status || "Pending",
            items: order.itemsCount || 1, // fallback if not joined
            date: new Date(order.createdAt).toLocaleDateString(),
            amount: `₹${order.totalAmount || 0}`,
          };

          return (
            <div
              key={formatted.id}
              className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-[#374151] text-sm">
                    {formatted.id}
                  </span>

                  <Badge className="bg-[#DCFCE7] text-[#15824D] hover:bg-[#E6F4EA] border-none text-[10px] px-2 py-0 h-5">
                    {formatted.status}
                  </Badge>
                </div>

                <p className="text-[11px] text-gray-400 font-medium">
                  {formatted.items} item(s) | {formatted.date}
                </p>
              </div>

              <span className="font-bold text-[#374151] text-sm">
                {formatted.amount}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};