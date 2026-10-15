// components/common/dashboard/StatsCards.tsx

import { IconShoppingBag, IconWallet, IconGift } from "@tabler/icons-react";

export const StatsCards = ({
  stats,
}: {
  stats: {
    totalOrders: number;
    totalSpent: number;
    rewardBalance?: number;
  };
}) => {
  const items = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: IconShoppingBag,
    },
    {
      label: "Total Spent",
      value: `₹${Number(stats.totalSpent || 0).toLocaleString("en-IN")}`,
      icon: IconWallet,
    },
    {
      label: "Rewards Balance",
      value: `₹${Number(stats.rewardBalance ?? 0).toLocaleString("en-IN")}`,
      icon: IconGift,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-white p-6 rounded-4xl shadow-sm border border-gray-50 flex flex-col justify-between"
        >
          <item.icon className="mb-2" />

          <h3 className="text-xl font-bold">{item.value}</h3>

          <p className="text-gray-500 text-sm">{item.label}</p>
        </div>
      ))}
    </div>
  );
};