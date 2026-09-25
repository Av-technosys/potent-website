/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useWishlistStore } from "@/store/WishlistStore";
import { Search, Heart, User, X, ChevronRight, ArrowRight, Sparkles, Flame, Calendar } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  IconBuildingStore,
  IconHome,
  IconInfoCircle,
  IconMenu2,
  IconNews,
  IconPhone,
  IconShoppingBag,
  IconSquareRoundedX,
  IconUser,
  IconLayoutDashboard,
  IconHistory,
  IconStar,
  IconShieldLock,
  IconAddressBook,
} from "@tabler/icons-react";
import { useCartStore } from "@/store/cartStore";
import { isUserLoggedIn } from "@/helper/auth/action";
import { getImageUrl } from "@/lib/imageUrl";
import { syncWishlistFromDB } from "@/store/WishlistActions";
import { syncCartFromDB } from "@/store/cartActions";

const navLinks = [
  { name: "Home", href: "/", icon: <IconHome size={20} /> },
  { name: "Shop all", href: "/shop", icon: <IconBuildingStore size={20} /> },
  { name: "Ovy", href: "/ovy", icon: <IconInfoCircle size={20} /> },
  { name: "Looway", href: "/looway", icon: <IconInfoCircle size={20} /> },
  {
    name: "Teens",
    href: "/product-detail/ovy-teen",
    icon: <IconInfoCircle size={20} />,
  },
  {
    name: "Yatra Kit",
    href: "/looway-yatra-kit",
    icon: <IconInfoCircle size={20} />,
  },
  { name: "Period Tracker", href: "/period-log", icon: <IconNews size={20} /> },
  { name: "Journal", href: "/blog", icon: <IconPhone size={20} /> },
];

const dashboardLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <IconLayoutDashboard size={20} />,
  },
  {
    name: "Profile Info",
    href: "/dashboard/profile",
    icon: <IconUser size={20} />,
  },
  {
    name: "Address Book",
    href: "/dashboard/address",
    icon: <IconAddressBook size={20} />,
  },
  {
    name: "Order History",
    href: "/dashboard/orders",
    icon: <IconHistory size={20} />,
  },
  {
    name: "Review & Ratings",
    href: "/dashboard/reviews",
    icon: <IconStar size={20} />,
  },
  {
    name: "Rewards & Security",
    href: "/dashboard/rewards",
    icon: <IconShieldLock size={20} />,
  },
];

export function Navbar() {
  const totalItems = useCartStore((state) => state.totalItems());
  const [open, setOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  const isDashboard = useMemo(
    () => pathname.startsWith("/dashboard"),
    [pathname],
  );

  const wishlistCount = useWishlistStore((state) => state.totalItems());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const showAccount = isDashboard || isLoggedIn === true;

  useEffect(() => {
    const checkSession = async () => {
      const isAuth = await isUserLoggedIn();
      setIsLoggedIn(isAuth);

      if (isAuth) {
        await Promise.all([syncWishlistFromDB(), syncCartFromDB()]);
      } else {
        useWishlistStore.getState().setWishlist([]);
        useCartStore.getState().clearCart();
      }
    };

    checkSession();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm">
      {/* TOP ANNOUNCEMENT BANNER STRAP */}
      {showBanner && (
        <div className="relative flex w-full items-center justify-center border-b border-[#004851]/10 bg-[#E2F4F7] px-4 py-2 text-xs font-medium text-[#004851] sm:text-sm">
          <p className="pr-6 text-center font-medium tracking-tight">
            Subscribe to pads, liners, seat covers and bags. Pause, skip or
            cancel in two clicks.
          </p>
          <button
            type="button"
            onClick={() => setShowBanner(false)}
            aria-label="Close banner"
            className="absolute right-3 cursor-pointer p-1 text-[#004851] transition-opacity hover:opacity-75 sm:right-6"
          >
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      )}

      {/* MAIN DARK TEAL NAVIGATION BAR */}
      <nav className="w-full bg-[#075965] px-4 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 h-16 sm:h-20">
          {/* LEFT SIDE LOGOS */}
          <div className="flex shrink-0 items-center gap-2.5 sm:gap-3.5">
            {/* Main Potent Hygiene White Logo */}
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/logo-white.png"
                alt="Potent Hygiene"
                width={160}
                height={50}
                className="h-9 sm:h-12 w-auto object-contain"
                priority
              />
            </Link>

            {/* Vertical Separator (Desktop) */}
            <div className="mx-3 hidden h-10 w-px bg-white/30 lg:block" />

            {/* Ovy & Looway Sub-logos (Desktop) */}
            <div className="hidden items-center gap-3.5 lg:flex">
              <Link href="/ovy" className="transition-opacity hover:opacity-90">
                <Image
                  src="/brand/ovy-white.png"
                  alt="Ovy"
                  width={110}
                  height={42}
                  className="h-8.5 sm:h-10.5 w-auto object-contain"
                />
              </Link>

              <Link
                href="/looway"
                className="transition-opacity hover:opacity-90"
              >
                <Image
                  src="/brand/looway-white.png"
                  alt="Looway"
                  width={130}
                  height={42}
                  className="h-8.5 sm:h-10.5 w-auto object-contain"
                />
              </Link>
            </div>
          </div>

          {/* CENTER NAVIGATION LINKS (Desktop) */}
          <div className="hidden items-center gap-5 sm:gap-6 text-xs sm:text-sm font-medium tracking-normal text-white/95 lg:flex">
            <Link
              href="/shop"
              className={`transition-colors hover:text-white ${
                pathname === "/shop"
                  ? "font-bold text-white underline underline-offset-4"
                  : ""
              }`}
            >
              Shop all
            </Link>

            <Link
              href="/ovy"
              className={`transition-colors hover:text-white ${
                pathname === "/ovy"
                  ? "font-bold text-white underline underline-offset-4"
                  : ""
              }`}
            >
              Ovy
            </Link>

            <Link
              href="/looway"
              className={`transition-colors hover:text-white ${
                pathname === "/looway"
                  ? "font-bold text-white underline underline-offset-4"
                  : ""
              }`}
            >
              Looway
            </Link>

            <Link
              href="/product-detail/ovy-teen"
              className={`transition-colors hover:text-white ${
                pathname.includes("teen")
                  ? "font-bold text-white underline underline-offset-4"
                  : ""
              }`}
            >
              Teens
            </Link>

            <Link
              href="/looway-yatra-kit"
              className={`transition-colors hover:text-white ${
                pathname === "/looway-yatra-kit"
                  ? "font-bold text-white underline underline-offset-4"
                  : ""
              }`}
            >
              Yatra Kit
            </Link>

            <Link
              href="/period-log"
              className={`transition-colors hover:text-white ${
                pathname === "/period-log"
                  ? "font-bold text-white underline underline-offset-4"
                  : ""
              }`}
            >
              Period Tracker
            </Link>

            <Link
              href="/blog"
              className={`transition-colors hover:text-white ${
                pathname === "/blog"
                  ? "font-bold text-white underline underline-offset-4"
                  : ""
              }`}
            >
              Journal
            </Link>
          </div>

          {/* RIGHT ACTION ICONS, SEARCH & MOBILE MENU */}
          <div className="flex items-center gap-3.5 text-white sm:gap-4.5">
            {/* Live Search Trigger & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSearchOpen((prev) => !prev)}
                aria-label="Search"
                className="cursor-pointer p-1 transition-colors hover:text-white/80"
              >
                <Search className="h-5 w-5" />
              </button>

              {searchOpen && (
                <div className="absolute top-full right-0 z-50 mt-3">
                  <ProductSearch onClose={() => setSearchOpen(false)} />
                </div>
              )}
            </div>

            {/* Wishlist Heart Icon with Count Badge */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative cursor-pointer p-1 transition-colors hover:text-white/80"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Profile / Dashboard Link */}
            <Link
              href={showAccount ? "/dashboard" : "/login"}
              aria-label={showAccount ? "Dashboard" : "Login"}
              className="cursor-pointer p-1 transition-colors hover:text-white/80"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Shopping Cart Icon with Count Badge */}
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative cursor-pointer p-1 transition-colors hover:text-white/80"
            >
              <IconShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-xs">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Sheet Trigger (At the VERY END on Mobile Right) */}
            <div className="lg:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <button className="cursor-pointer p-1.5 text-white transition-colors hover:text-white/80">
                    <IconMenu2 size={24} />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[85vw] max-w-[340px] border-l-0 border-r-0 bg-[#004851] p-5 sm:p-6 text-white [&>button]:hidden flex flex-col justify-between h-full shadow-2xl select-none"
                >
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                  {/* TOP HEADER ROW: "Menu" + Close (X) */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
                    <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
                      Menu
                    </h2>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="p-1 text-white hover:text-white/80 transition-colors cursor-pointer"
                      aria-label="Close menu"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* SCROLLABLE CONTENT */}
                  <div className="flex-1 overflow-y-auto space-y-6 pt-4 pr-1 no-scrollbar">
                    
                    {/* 2 SIDE-BY-SIDE BRAND CARDS */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Ovy Card */}
                      <Link
                        href="/ovy"
                        onClick={() => setOpen(false)}
                        className="group bg-white/10 hover:bg-white/15 rounded-2xl p-3.5 flex flex-col justify-between h-28 border border-white/10 transition-all cursor-pointer"
                      >
                        <div>
                          <Image
                            src="/brand/ovy-white.png"
                            alt="Ovy"
                            width={85}
                            height={32}
                            className="h-7 w-auto object-contain"
                          />
                        </div>
                        <p className="text-[11px] sm:text-xs text-white/80 font-normal leading-tight">
                          Period and intimate care
                        </p>
                      </Link>

                      {/* Looway Card */}
                      <Link
                        href="/looway"
                        onClick={() => setOpen(false)}
                        className="group bg-white/10 hover:bg-white/15 rounded-2xl p-3.5 flex flex-col justify-between h-28 border border-white/10 transition-all cursor-pointer"
                      >
                        <div>
                          <Image
                            src="/brand/looway-white.png"
                            alt="Looway"
                            width={95}
                            height={32}
                            className="h-7 w-auto object-contain"
                          />
                        </div>
                        <p className="text-[11px] sm:text-xs text-white/80 font-normal leading-tight">
                          Travel and everyday hygiene
                        </p>
                      </Link>
                    </div>

                    {/* NAV LINKS LIST WITH SUBTLE DIVIDER LINES */}
                    <div className="flex flex-col space-y-0 text-left pt-1">
                      <Link
                        href="/shop"
                        onClick={() => setOpen(false)}
                        className="py-3.5 border-b border-white/15 text-sm sm:text-base font-bold text-white hover:text-white/80 transition-colors"
                      >
                        Shop all
                      </Link>

                      <Link
                        href="/ovy"
                        onClick={() => setOpen(false)}
                        className="py-3.5 border-b border-white/15 text-sm sm:text-base font-bold text-white hover:text-white/80 transition-colors"
                      >
                        Ovy
                      </Link>

                      <Link
                        href="/looway"
                        onClick={() => setOpen(false)}
                        className="py-3.5 border-b border-white/15 text-sm sm:text-base font-bold text-white hover:text-white/80 transition-colors"
                      >
                        Looway
                      </Link>

                      <Link
                        href="/product-detail/ovy-teen"
                        onClick={() => setOpen(false)}
                        className="py-3.5 border-b border-white/15 text-sm sm:text-base font-bold text-white hover:text-white/80 transition-colors"
                      >
                        Teens
                      </Link>

                      <Link
                        href="/looway-yatra-kit"
                        onClick={() => setOpen(false)}
                        className="py-3.5 border-b border-white/15 text-sm sm:text-base font-bold text-white hover:text-white/80 transition-colors"
                      >
                        Yatra Kit
                      </Link>

                      <Link
                        href="/period-log"
                        onClick={() => setOpen(false)}
                        className="py-3.5 border-b border-white/15 text-sm sm:text-base font-bold text-white hover:text-white/80 transition-colors"
                      >
                        Period Tracker
                      </Link>

                      <Link
                        href="/blog"
                        onClick={() => setOpen(false)}
                        className="py-3.5 border-b border-white/15 text-sm sm:text-base font-bold text-white hover:text-white/80 transition-colors"
                      >
                        Journal
                      </Link>
                    </div>

                  </div>

                  {/* BOTTOM ACTION BUTTONS ROW (Wishlist & Account - Shifted up to clear mobile bottom bar) */}
                  <div className="pt-4 pb-16 md:pb-2 mt-auto flex items-center gap-3 shrink-0 border-t border-white/10">
                    <Link
                      href="/wishlist"
                      onClick={() => setOpen(false)}
                      className="flex-1 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs sm:text-sm py-3 px-3 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                    >
                      <Heart className="w-4 h-4 text-white fill-white/20" />
                      <span>Wishlist</span>
                    </Link>

                    <Link
                      href={showAccount ? "/dashboard" : "/login"}
                      onClick={() => setOpen(false)}
                      className="flex-1 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs sm:text-sm py-3 px-3 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                    >
                      <User className="w-4 h-4 text-white" />
                      <span>Account</span>
                    </Link>
                  </div>

                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

function ProductSearch({ onClose }: { onClose?: () => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<
    { id: string; name: string; slug: string; bannerImage: string }[]
  >([]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(searchTerm)}`,
        );
        const data = await res.json();
        setResults(data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="animate-fadeIn w-72 rounded-2xl border border-gray-100 bg-white p-3 text-gray-900 shadow-2xl sm:w-80">
      <div className="relative flex items-center">
        <input
          type="text"
          autoFocus
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-gray-200 py-2 pr-8 pl-3 text-xs focus:border-[#004851] focus:outline-hidden sm:text-sm"
        />
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-2 cursor-pointer p-1 text-gray-400 hover:text-gray-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {searchTerm.trim() !== "" && (
        <div className="mt-2.5 max-h-64 space-y-1 overflow-y-auto border-t border-gray-100 pt-2">
          {loading ? (
            <div className="p-3 text-center text-xs text-gray-500">
              Searching...
            </div>
          ) : results.length > 0 ? (
            results.map((product) => (
              <Link
                key={product.id}
                href={`/product-detail/${product.slug}`}
                className="flex items-center gap-2.5 rounded-lg p-2 transition-colors hover:bg-gray-50"
                onClick={onClose}
              >
                {product.bannerImage ? (
                  <Image
                    src={getImageUrl(product.bannerImage)}
                    alt={product.name || "Product"}
                    width={36}
                    height={36}
                    className="h-9 w-9 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <div className="h-9 w-9 shrink-0 rounded-md bg-gray-100" />
                )}
                <span className="line-clamp-2 text-xs font-medium text-gray-800">
                  {product.name}
                </span>
              </Link>
            ))
          ) : (
            <div className="p-3 text-center text-xs text-gray-500">
              No products found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
