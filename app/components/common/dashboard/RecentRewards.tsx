import { IconShoppingCart, IconUserPlus } from "@tabler/icons-react";
import Link from "next/link";

const rewards = [
  {
    id: 1,
    title: "Order ORD-2024-1234",
    date: "3/15/2024",
    icon: IconShoppingCart,
    amount: "+68 Coins",
    color: "bg-[#FFDFDF] text-[#FF0000]",
  },
  {
    id: 2,
    title: "Friend Emma Joined",
    date: "3/15/2024",
    icon: IconUserPlus,
    amount: "+68 Coins",
    color: "bg-[#FEF3C7] text-[#D97706]",
  },
  {
    id: 3,
    title: "Order ORD-2024-1234",
    date: "3/15/2024",
    icon: IconShoppingCart,
    amount: "+68 Coins",
    color: "bg-[#FFDFDF] text-[#FF0000]",
  },
];

export const RecentRewards = () => (
  <section className="mt-6 rounded-2xl border border-gray-50 bg-white p-6 shadow-sm">
    <div className="mb-5 flex items-center justify-between">
      <h2 className="text-[16px] font-bold tracking-wide text-[#333333] uppercase">
        Recent Rewards
      </h2>
      <Link
        href="/rewards"
        className="text-[12px] font-bold text-[#016271] hover:underline"
      >
        View All
      </Link>
    </div>
    <div className="flex flex-col gap-3">
      {rewards.map((reward) => (
        <div
          key={reward.id}
          className="flex items-center justify-between rounded-xl border border-gray-100 p-4"
        >
          <div className="flex items-center gap-4">
            <div className={`${reward.color} rounded-2xl p-2.5`}>
              <reward.icon size={20} stroke={2} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#666666]">{reward.title}</p>
              <p className="text-[11px] font-medium text-[#666666]">
                {reward.date}
              </p>
            </div>
          </div>
          <span className="ml-5 text-sm font-bold text-[#DD7706]">
            {reward.amount}
          </span>
        </div>
      ))}
    </div>
  </section>
);
