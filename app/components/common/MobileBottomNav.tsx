"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Droplet, Compass, Package, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export function MobileBottomNav() {
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.totalItems());

  const navItems = [
    {
      name: "Shop",
      href: "/shop",
      isCustomLogo: true,
    },
    {
      name: "Ovy",
      href: "/ovy",
      icon: Droplet,
    },
    {
      name: "Looway",
      href: "/looway",
      icon: Compass,
    },
    {
      name: "Yatra Kit",
      href: "/looway-yatra-kit",
      icon: Package,
    },
    {
      name: "Bag",
      href: "/cart",
      icon: ShoppingBag,
      badge: totalItems,
    },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-[99999] bg-white border-t border-gray-200/90 md:hidden py-1.5 px-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] select-none">
      <div className="flex items-center justify-between max-w-md mx-auto px-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          const IconComponent = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center min-w-[56px] py-0.5 group transition-all cursor-pointer"
            >
              {/* ICON AREA */}
              <div className="relative flex items-center justify-center h-7 w-7">
                {item.isCustomLogo ? (
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center transition-transform ${
                      isActive
                        ? "bg-[#004851] text-white scale-105"
                        : "bg-[#2D3832] text-white hover:bg-[#004851]"
                    }`}
                  >
                    <span className="font-serif font-bold text-xs leading-none">
                      N
                    </span>
                  </div>
                ) : (
                  IconComponent && (
                    <IconComponent
                      className={`w-5 h-5 transition-all ${
                        isActive
                          ? "text-[#004851] stroke-[2.5]"
                          : "text-gray-700 stroke-[1.8] group-hover:text-[#004851]"
                      }`}
                    />
                  )
                )}

                {/* BADGE COUNT FOR BAG */}
                {item.badge !== undefined && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#004851] text-[9px] font-bold text-white shadow-xs">
                    {item.badge}
                  </span>
                ) : null}
              </div>

              {/* LABEL */}
              <span
                className={`text-[10px] font-medium leading-none mt-1 transition-colors ${
                  isActive ? "text-[#004851] font-semibold" : "text-gray-700 group-hover:text-[#004851]"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
