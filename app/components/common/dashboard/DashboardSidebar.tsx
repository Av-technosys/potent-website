"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  IconChevronDown,
  IconLayoutDashboard,
  IconUser,
  IconAddressBook,
  IconHistory,
  IconStar,
  IconGift,
  IconUsers,
  IconRepeat,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { LogoutButton } from "../LogoutButton";

const menuItems = [
  { icon: IconLayoutDashboard, label: "Dashboard", href: "/dashboard" },
  {
    icon: IconUser,
    label: "Profile Information",
    href: "/dashboard/profile",
  },
  {
    icon: IconAddressBook,
    label: "Address Book",
    href: "/dashboard/address",
  },
  { icon: IconHistory, label: "Order History", href: "/dashboard/orders" },
  {
    icon: IconRepeat,
    label: "Subscriptions",
    href: "/dashboard/subscriptions",
  },
  { icon: IconStar, label: "Review & Rating", href: "/dashboard/reviews" },
  {
    icon: IconGift,
    label: "Rewards & Security",
    href: "/dashboard/security",
  },
  { icon: IconUsers, label: "Referral Program", href: "/dashboard/referral" },
];

function DashboardSidebarMenu({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
              isActive
                ? "bg-[#C9E6EA] font-semibold text-[#333333]"
                : "text-[#333333] hover:bg-gray-50"
            }`}
          >
            {isActive && (
              <div className="absolute top-0 bottom-0 left-0 w-3 rounded-l-md bg-[#016271]" />
            )}
            <item.icon
              size={20}
              stroke={1.5}
              className={isActive ? "text-[#016271]" : "group-hover:scale-110"}
            />
            <span className="text-[14px]">{item.label}</span>
          </Link>
        );
      })}
      <div className="mt-4 border-t border-gray-100 pt-2">
        <LogoutButton />
      </div>
    </nav>
  );
}

export const DashboardSidebar = () => {
  return (
    <aside className="sticky top-8 h-fit w-72 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <DashboardSidebarMenu />
    </aside>
  );
};

export const DashboardMobileSidebar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const activeItem =
    menuItems.find((item) => item.href === pathname) || menuItems[0];
  const ActiveIcon = activeItem.icon;

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
    >
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="group h-12 w-full justify-between rounded-xl px-4 text-[#333333] hover:bg-[#F8F6F1]"
        >
          <span className="flex min-w-0 items-center gap-3">
            <ActiveIcon
              size={20}
              stroke={1.5}
              className="shrink-0 text-[#016271]"
            />
            <span className="truncate text-sm font-semibold">
              {activeItem.label}
            </span>
          </span>
          <IconChevronDown
            size={18}
            stroke={1.5}
            className="shrink-0 text-[#016271] transition-transform duration-200 group-data-[state=open]:rotate-180"
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3">
        <DashboardSidebarMenu onNavigate={() => setOpen(false)} />
      </CollapsibleContent>
    </Collapsible>
  );
};
