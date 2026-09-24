import { Sidebar } from "@/components/admin/sidebar";
import { MobileSidebar } from "@/components/admin/mobileSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted/40 flex h-screen overflow-hidden">
      <div className="sticky top-0 hidden h-screen lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-background flex items-center gap-2 border-b p-3 lg:hidden">
          <MobileSidebar />
          <span className="text-lg font-semibold">Admin</span>
        </div>

        <div className="">{children}</div>
      </div>
    </div>
  );
}
