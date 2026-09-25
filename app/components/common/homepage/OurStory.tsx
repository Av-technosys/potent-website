/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus, Check } from "lucide-react";
import { addToCart } from "@/store/cartActions";

type Props = {
  badgeText?: string;
  title?: string;
  highlight?: string;
  paragraphs?: string[];
  image?: string;
  primaryColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  bgAccent?: string;
  tickerColor?: string;
  tickerText?: string;
};

export function OurStory(_props: Props) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    if (adding) return;
    setAdding(true);
    await addToCart({
      productId: "ovy-cup",
      productVariantId: "ovy-cup-default",
      slug: "ovy-cup",
      title: "Ovy Reusable Menstrual Cup",
      image: "/products/cup-rbw.jpg",
      price: 459,
      quantity: 1,
      isQuantityChangable: true,
    });
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="w-full overflow-hidden bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* LEFT IMAGE CONTAINER */}
          <div className="flex justify-center lg:col-span-5">
            <div className="group relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2.5rem] border border-gray-100/80 shadow-2xl sm:aspect-[1/1] lg:max-w-lg">
              <Image
                src="/products/cup-rbw.jpg"
                alt="Ovy Menstrual Cup"
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex flex-col text-left lg:col-span-7">
            <span className="mb-3 block text-[11px] font-bold tracking-widest text-[#016271] uppercase sm:text-xs">
              OVY MENSTRUAL CUP
            </span>

            <h2 className="mb-4 font-serif text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              <span className="block text-gray-900">One cup.</span>
              <span className="mt-1 block text-[#016271]">
                Years of freedom.
              </span>
            </h2>

            <p className="mb-6 max-w-xl text-xs leading-relaxed text-gray-600 sm:text-sm">
              Up to 12 hours between changes, even overnight. 100% medical-grade
              silicone, latex-free and BPA-free. The product page has a
              30-second size finder and a 20-second cervix check, so you get the
              size right first time.
            </p>

            {/* 3 Metric Cards (3 Columns on Mobile & Desktop) */}
            <div className="mb-6 grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-3.5">
              <div className="flex flex-col justify-start rounded-2xl border border-[#BDE3EA] bg-[#E6F4F6] p-2.5 sm:p-4">
                <span className="mb-0.5 block font-serif text-sm font-bold text-[#016271] sm:text-xl">
                  12 hrs
                </span>
                <span className="text-[10px] leading-tight text-gray-600 sm:text-xs">
                  between changes, even overnight
                </span>
              </div>

              <div className="flex flex-col justify-start rounded-2xl border border-[#BDE3EA] bg-[#E6F4F6] p-2.5 sm:p-4">
                <span className="mb-0.5 block font-serif text-sm font-bold text-[#016271] sm:text-xl">
                  Years
                </span>
                <span className="text-[10px] leading-tight text-gray-600 sm:text-xs">
                  of use from one cup, replacing thousands of disposables
                </span>
              </div>

              <div className="flex flex-col justify-start rounded-2xl border border-[#BDE3EA] bg-[#E6F4F6] p-2.5 sm:p-4">
                <span className="mb-0.5 block font-serif text-sm font-bold text-[#016271] sm:text-xl">
                  3 sizes
                </span>
                <span className="text-[10px] leading-tight text-gray-600 sm:text-xs">
                  Teen XS, Medium and Large, in four colours
                </span>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="mb-4 flex flex-col gap-2.5 lg:flex-row lg:flex-wrap lg:items-center lg:gap-3">
              {/* Add to Cart Button: Full Width Top on Mobile, 3rd on Desktop */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={adding}
                className={`order-1 lg:order-3 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full py-3 px-5 text-sm font-semibold shadow-md transition-all lg:w-auto lg:px-6 lg:py-3 ${
                  added
                    ? "bg-emerald-600 text-white"
                    : "bg-[#016271] text-white hover:scale-105 hover:bg-[#014e5a]"
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Added, ₹459</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Add, ₹459</span>
                  </>
                )}
              </button>

              {/* Secondary Buttons Row: 2 equal buttons side-by-side on Mobile */}
              <div className="order-2 lg:order-1 flex w-full gap-2.5 lg:w-auto lg:gap-3">
                <Link
                  href="/product-detail/ovy-cup"
                  className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#016271] py-2.5 px-4 text-xs font-semibold text-white shadow-md transition-all hover:scale-105 hover:bg-[#014e5a] lg:flex-none lg:px-6 lg:py-3 lg:text-sm"
                >
                  <span>Shop the cup</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/product-detail/ovy-cup?scroll=size-finder#size-finder"
                  className="flex flex-1 cursor-pointer items-center justify-center rounded-full border border-[#016271] bg-white py-2.5 px-4 text-xs font-semibold text-[#016271] shadow-2xs transition-all hover:bg-[#016271] hover:text-white lg:flex-none lg:px-6 lg:py-3 lg:text-sm"
                >
                  Find my size
                </Link>
              </div>
            </div>

            {/* Sub-note */}
            <p className="text-xs font-normal text-gray-500">
              Ships in plain, unbranded, plastic-free packaging.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
