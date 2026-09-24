"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getImageUrl } from "@/lib/imageUrl";
import { useCatalogStore } from "@/store/catalogStore";

const MOMENTS = [
  {
    label: "Her first period",
    body: "A kit that explains itself, with a wrapper that stays silent at school.",
    href: "/menstrual-cup",
    image: "/products/teen.jpg",
  },
  {
    label: "Heavy nights",
    body: "A 320mm pad with a widened back, because night leaks travel backwards.",
    href: "/shop",
    image: "/products/pads-xlplus.jpg",
  },
  {
    label: "The seven-hour train",
    body: "Stand, go, touch nothing. The funnel that ends the dirty-toilet dread.",
    href: "/looway-toilet-seat-covers",
    image: "/products/funnel.jpg",
  },
  {
    label: "Car sick. Morning sick.",
    body: "A sealable bag for motion sickness on the road and nausea in pregnancy. Open, seal, bin.",
    href: "/product-detail/looway-pee-puke",
    image: "/looway/scen-bags-preg.jpg",
  },
  {
    label: "A yatra or road trip",
    body: "Every toilet a journey throws at you, or none at all, covered in one box.",
    href: "/looway-yatra-kit",
    image: "/looway/yatra.jpg",
  },
  {
    label: "Travelling light",
    body: "One cup, up to 12 hours, nothing to carry and nothing to throw away.",
    href: "/menstrual-cup",
    image: "/products/cup.jpg",
  },
];

const LOOWAY_TICKERS = [
  "Squat toilet? Stand up.",
  "Filthy seat? Sit down.",
  "No toilet? Looway.",
  "Motion sickness? Bag it.",
  "Safe through every trimester",
  "Seat covers and bags: unisex",
  "Fits in a handbag",
  "Eleven Yatra Kits",
];

type Props = {
  title?: string;
  description?: string;
};

export function CategoryGrid({
  title = "Tell us the moment. We will do the rest.",
  description = "Browse by what you need it for, or by what it is.",
}: Props) {
  const [activeTab, setActiveTab] = useState<"moment" | "category">("moment");
  const allCategories = useCatalogStore((state) => state.categories);

  return (
    <section
      className="w-full border-b border-gray-100 bg-white pt-14 pb-0 sm:pt-20"
      id="shop-by"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16">
        {/* Section Header */}
        <div className="mb-8 space-y-3 text-center md:mb-12">
          <span className="text-[11px] font-bold tracking-widest text-[#016271] uppercase sm:text-xs">
            FIND YOURS
          </span>
          <h2 className="font-serif text-3xl leading-tight font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed font-normal text-gray-600 sm:text-base md:text-lg">
            {description}
          </p>
        </div>

        {/* Tab Toggle Bar */}
        <div className="mb-10 flex justify-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gray-200/80 bg-[#FAF7F2] p-1.5 shadow-2xs">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "moment"}
              onClick={() => setActiveTab("moment")}
              className={`cursor-pointer rounded-full px-5 py-2.5 text-xs font-semibold transition-all duration-300 sm:text-sm ${
                activeTab === "moment"
                  ? "bg-[#016271] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Shop by moment
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "category"}
              onClick={() => setActiveTab("category")}
              className={`cursor-pointer rounded-full px-5 py-2.5 text-xs font-semibold transition-all duration-300 sm:text-sm ${
                activeTab === "category"
                  ? "bg-[#016271] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Shop by category
            </button>
          </div>
        </div>

        {/* Tab Panel 1: Shop by Moment */}
        {activeTab === "moment" && (
          <div className="animate-fadeIn grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {MOMENTS.map((m) => (
              <Link
                key={m.label}
                href={m.href}
                className="group border-gray-150 flex items-center gap-4 rounded-2xl border bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-lg"
              >
                <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-[#E6F4F6] sm:h-26 sm:w-22">
                  <Image
                    src={m.image}
                    alt={m.label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="100px"
                  />
                </div>
                <div className="flex min-w-0 flex-col justify-center pr-1">
                  <h3 className="mb-1 font-serif text-base font-bold text-gray-900 transition-colors group-hover:text-[#016271] sm:text-lg">
                    {m.label}
                  </h3>
                  <p className="line-clamp-3 text-xs leading-snug text-gray-600 sm:text-sm">
                    {m.body}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Tab Panel 2: Shop by Category (Dynamic DB Categories + Extra Coming Soon Tile) */}
        {activeTab === "category" && (
          <div className="animate-fadeIn grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {allCategories.map((category) => (
              <Link
                key={category.id}
                href={category.redirectSlug}
                className="group border-gray-150 flex flex-col justify-between overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F5EEF0]">
                  <Image
                    unoptimized
                    src={getImageUrl(
                      category.bannerImage || "/placeholder.jpg",
                    )}
                    alt={category.name || "Category"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 300px"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-gray-50 p-3.5 sm:p-4">
                  <h3 className="truncate pr-2 text-sm font-semibold text-gray-900 capitalize transition-colors group-hover:text-[#016271] sm:text-base">
                    {category.name}
                  </h3>
                  <ArrowRight className="h-4 w-4 shrink-0 transform text-[#016271] transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}

            {/* Extra Coming Soon Category Card */}
            <div className="group border-gray-150 flex cursor-default flex-col justify-between overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div
                className="relative flex aspect-[4/5] items-center justify-center overflow-hidden p-4 text-center"
                style={{
                  background:
                    "repeating-linear-gradient(-45deg, #FBF4F8, #FBF4F8 14px, #F3E5F0 14px, #F3E5F0 28px)",
                }}
              >
                <span className="-rotate-3 transform font-serif text-2xl font-medium tracking-wide text-[#864A76] italic sm:text-3xl">
                  Coming soon
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 bg-white p-3.5 sm:p-4">
                <h3 className="truncate text-sm font-semibold text-gray-400 capitalize sm:text-base">
                  Period panties
                </h3>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mauve / Pink Ticker Strip */}
      <div className="mt-14 w-full overflow-hidden bg-[#965A7C] py-3 text-white shadow-inner sm:mt-18">
        <div className="animate-marquee flex items-center space-x-8 font-serif text-sm tracking-wide whitespace-nowrap sm:text-base">
          {LOOWAY_TICKERS.concat(LOOWAY_TICKERS, LOOWAY_TICKERS).map(
            (item, idx) => (
              <div key={idx} className="flex shrink-0 items-center space-x-3">
                <span className="font-semibold">{item}</span>
                <span className="text-pink-200">✦</span>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
