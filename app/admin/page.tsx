
import { DashboardCards } from "@/components/admin/dashboardCard"

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // const data = await db.select().from(productTable)
  return (
    <div className="space-y-6 p-3">
      {/* Page Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Dashboard Overview
        </h1>
        <p className="text-slate-500">
          Welcome back! Here's what's happening with your store today
        </p>
      </header>

      <DashboardCards />

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* <OrderStatusBoxes /> */}
        </div>
        {/* <QuickActions /> */}
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* <RecentOrdersTable /> */}
        </div>
        {/* <OrderStatusChart /> */}
      </div>
    </div>
  )
}
