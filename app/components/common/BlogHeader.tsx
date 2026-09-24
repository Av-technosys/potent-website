"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  IconSquareRoundedX,
  IconUser,
} from "@tabler/icons-react";

const navLinks = [
  { name: "Home", href: "/", icon: <IconHome size={20} /> },
  { name: "Shop", href: "/shop", icon: <IconBuildingStore size={20} /> },
  { name: "About", href: "/about", icon: <IconInfoCircle size={20} /> },
  { name: "Blog", href: "/blog", icon: <IconNews size={20} />, active: true },
  { name: "FAQs", href: "/faq", icon: <IconPhone size={20} /> },
];

const BlogHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative w-full border-b bg-white">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-16">

        
        <div className="flex items-center">

          
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button className="p-1 text-[#1A8D91]">
                  <IconMenu2 size={28} />
                </button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-72 border-r-0 bg-white p-0 [&>button]:hidden"
              >
                <SheetTitle className="sr-only">
                  Navigation Menu
                </SheetTitle>

                <div className="flex h-full flex-col">
                  <div className="px-7 pb-6 pt-6">
                    <button
                      onClick={() => setOpen(false)}
                      className="text-[#1A8D91]"
                    >
                      <IconSquareRoundedX size={35} />
                    </button>
                  </div>

                  <div className="flex-1 space-y-1 px-3">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center space-x-4 rounded-r-xl px-4 py-4 transition-all ${
                          link.active
                            ? "border-l-8 border-[#1A8D91] bg-[#D1E9EC] font-semibold text-[#1A8D91]"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <span>{link.icon}</span>
                        <span className="text-base">{link.name}</span>
                      </Link>
                    ))}
                  </div>

                  <div className="mb-6 px-3">
                    <Link
                      href="/account"
                      onClick={() => setOpen(false)}
                      className="flex items-center space-x-4 rounded-r-xl border-l-8 border-[#1A8D91] bg-[#D1E9EC] px-4 py-4 font-semibold text-[#1A8D91]"
                    >
                      <IconUser size={20} />
                      <span className="text-base">Account</span>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          
          <Link href="/" className="hidden flex-shrink-0 md:block">
            <Image
              src="/logo.png"
              alt="Potent Logo"
              width={120}
              height={40}
              className="h-36 w-auto"
            />
          </Link>
        </div>

        
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Potent Logo"
              width={110}
              height={35}
              className="h-28 w-auto"
            />
          </Link>
        </div>

        
        <div className="hidden space-x-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                link.active
                  ? "text-[#1A8D91]"
                  : "text-[#1A8D91] hover:text-[#146e71]"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        
        <div className="flex items-center space-x-3 text-[#1A8D91] md:space-x-5">
          <button className="hover:opacity-70">
            <ShoppingBag className="h-5 w-5" />
          </button>

          <button className="hover:opacity-70">
            <Search className="h-6 w-6 md:h-5 md:w-5" />
          </button>

          <button className="hidden hover:opacity-70 md:block">
            <Heart className="h-6 w-6 md:h-5 md:w-5" />
          </button>

          <Link href="/login">
            <Button
              variant="ghost"
              className="hidden rounded-full bg-[#D1E9EC] px-6 text-[#1A8D91] hover:bg-[#b8dce1] md:flex"
            >
              <User className="mr-2 h-4 w-4" />
              Login
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default BlogHeader;