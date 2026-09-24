import { Card } from "@/components/ui/card";

export const OrderHistoryHeader = () => (
  <Card className="p-6 border-none shadow-sm bg-white rounded-[15px] mb-6">
    <div className="space-y-1">
      <h2 className="text-[18px] font-bold text-[#2D3748]">Order History</h2>
      <p className="text-[13px] text-gray-500 font-medium">Track and manage your orders</p>
    </div>
  </Card>
);