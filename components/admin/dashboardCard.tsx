// components/dashboard-cards.tsx
import { ShoppingCart, Package, Users, DollarSign } from "lucide-react"
import { StatCard } from "./statCard"
import { fetchAdminDashboardStats } from "@/helper/adminListing/action"

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value)
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}

export async function DashboardCards() {

  const stats = await fetchAdminDashboardStats()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Orders" 
        value={formatNumber(stats.totalOrders)}
        subtitle={`${formatNumber(stats.pendingOrders)} pending orders`}
        icon={<ShoppingCart className="text-sky-500" size={24} />}
        iconBg="bg-sky-100/50"
      />
      <StatCard 
        title="Total Products" 
        value={formatNumber(stats.totalProducts)}
        subtitle={`${formatNumber(stats.activeProducts)} active products`}
        icon={<Package className="text-purple-500" size={24} />}
        iconBg="bg-purple-100/50"
      />
      <StatCard 
        title="Total Users" 
        value={formatNumber(stats.totalUsers)}
        subtitle={`${formatNumber(stats.verifiedUsers)} verified users`}
        icon={<Users className="text-yellow-500" size={24} />}
        iconBg="bg-yellow-100/50"
      />
      <StatCard 
        title="Total Revenue" 
        value={formatCurrency(stats.totalRevenue)}
        subtitle={`${formatNumber(stats.successfulPayments)} successful payments`}
        icon={<DollarSign className="text-emerald-500" size={24} />}
        iconBg="bg-emerald-100/50"
      />
    </div>
  )
}

export function DashboardCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs animate-pulse"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 w-24 bg-slate-200 rounded" />
            <div className="h-9 w-9 bg-slate-100 rounded-full" />
          </div>
          <div className="h-7 w-28 bg-slate-200 rounded mb-2" />
          <div className="h-3 w-36 bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  );
}
