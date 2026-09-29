"use client";

import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";

export function OvyComingNext() {
  const scrollToNewsletter = () => {
    const newsletterEl = document.getElementById("newsletter-section");
    if (newsletterEl) {
      newsletterEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hidden md:block w-full bg-[#e1d5e8] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Period Panty Magazine / Newspaper Cover Image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-square transform -rotate-1.5 transition-transform">
              <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-xl border border-purple-200/60 bg-white">
                <Image
                  src="/ovy/panty-box.jpg"
                  alt="Super Slim Period Panties"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 450px"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right Column: Title, Subtitle, Checkmarks & Scroll Button */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
            
            {/* Kicker & Title */}
            <div>
              <span className="text-[11px] font-bold tracking-widest text-[#602E55] uppercase block mb-1.5">
                COMING NEXT
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1915] leading-tight">
                Super Slim Period Panties.
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-[#5C524D] leading-relaxed font-normal max-w-2xl">
                Worn like underwear, so nothing shifts. 360° coverage with a leak-resistant back for 10 to 12 hours, and super-thin under leggings, jeans or a saree. Two sizes, M-XL and XXL-XXXL, both the same price.
              </p>
            </div>

            {/* Checkmarks List */}
            <div className="space-y-2.5 text-xs sm:text-sm text-[#1F1915] max-w-xl">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#8C4F7C] shrink-0 stroke-[2.5]" />
                <span>Holds as much as 5 regular pads</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#8C4F7C] shrink-0 stroke-[2.5]" />
                <span>Tear-away sides, its own wrapper to bin it in</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#8C4F7C] shrink-0 stroke-[2.5]" />
                <span>Dermatologically tested, certified non-toxic</span>
              </div>
            </div>

            {/* Action Button -> Scrolls to Newsletter */}
            <div className="pt-2">
              <button
                onClick={scrollToNewsletter}
                className="bg-[#8C4F7C] hover:bg-[#763f69] text-white rounded-full px-7 py-3 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Tell me when it lands</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
