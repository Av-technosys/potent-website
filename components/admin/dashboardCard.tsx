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
