import {
  DashboardMobileSidebar,
  DashboardSidebar,
} from "../components/common/dashboard/DashboardSidebar";
import { Navbar } from "../components/common/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      <div className="bg-[#F8F6F1] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="mb-5 lg:hidden">
            <DashboardMobileSidebar />
          </div>

          <div className="flex gap-8">
            <div className="w-[280px] hidden lg:block shrink-0">
              <DashboardSidebar />
            </div>

            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
