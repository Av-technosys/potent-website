/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FEED_IMAGES = [
  {
    id: "1",
    src: "https://dw0n4qiceose7.cloudfront.net/website-images/insta_3.jpg",
    alt: "What a period is not",
  },
  {
    id: "2",
    src: "https://dw0n4qiceose7.cloudfront.net/website-images/insta_4.jpg",
    alt: "Period cramps surviving the apocalypse",
  },
  {
    id: "3",
    src: "https://dw0n4qiceose7.cloudfront.net/website-images/insta_5.jpg",
    alt: "Period cramps eat these foods",
  },
  {
    id: "4",
    src: "https://dw0n4qiceose7.cloudfront.net/website-images/insta_1.jpg",
    alt: "On my period wake up and cry together",
  },
  {
    id: "5",
    src: "https://dw0n4qiceose7.cloudfront.net/website-images/insta_2.jpg",
    alt: "When period cramps hit so bad comfort pose",
  },
];

// Quadruple items to ensure seamless infinite loop marquee without empty gaps on large screens
const CAROUSEL_ITEMS = [...FEED_IMAGES, ...FEED_IMAGES, ...FEED_IMAGES, ...FEED_IMAGES];

type Props = {
  title?: string;
  username?: string;
  gradientFrom?: string;
  gradientTo?: string;
  textColor?: string;
  buttonColor?: string;
};

export function InstagramFeed(_props: Props) {
  return (
    <section className="w-full bg-[#E8F6F7] py-14 sm:py-16 overflow-hidden">
      <div className="w-full text-center">
        
        {/* HEADER */}
        <div className="mb-8 sm:mb-10 space-y-2">
          <span className="text-[#016271] text-[11px] sm:text-xs font-bold uppercase tracking-widest block">
            @POTENTHYGIENE
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight">
            Join the Potent circle.
          </h2>
        </div>

        {/* INFINITE MARQUEE CAROUSEL */}
        <div className="w-full overflow-hidden py-3">
          <div
            className="flex items-center gap-5 sm:gap-6 animate-marquee hover:[animation-play-state:paused] w-max"
            style={{ animationDuration: "50s" }}
          >
            {CAROUSEL_ITEMS.map((img, idx) => (
              <a
                key={`${img.id}-${idx}`}
                href="https://www.instagram.com/potenthygiene/"
                target="_blank"
                rel="noreferrer"
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xs border border-white/70 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 aspect-square w-52 sm:w-60 md:w-64 shrink-0 group block cursor-pointer"
              >
                <Image
                  unoptimized
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              </a>
            ))}
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex justify-center pt-8 sm:pt-10">
          <Link
            href="https://www.instagram.com/potenthygiene/"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-[#016271] text-[#016271] bg-[#E8F6F7] hover:bg-[#016271] hover:text-white px-6 py-2.5 sm:px-7 sm:py-3 text-xs sm:text-sm font-semibold transition-all duration-300 shadow-2xs hover:scale-105 cursor-pointer"
          >
            <span>Follow @potenthygiene</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}

