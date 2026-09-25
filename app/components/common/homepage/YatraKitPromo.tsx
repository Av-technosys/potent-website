import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const TICKER_ITEMS = [
  "Made in Jaipur",
  "Built for Indian bodies, Indian toilets, Indian journeys",
  "One brand for life",
  "Potent Hygiene",
  "Where your wellness comes first",
];

const TRIP_TAGS = [
  "Girls' Trip",
  "Teerth Yatra",
  "Boys' Trip",
  "Pregnancy Travel",
  "Toddler Travel",
  "Family",
];

export function YatraKitPromo() {
  return (
    <section className="w-full bg-[#FAF7F2] overflow-hidden relative pb-16 pt-0">
      
      {/* Top Ticker Strap */}
      <div className="w-full bg-[#FAF7F2] py-2.5 overflow-hidden border-b border-gray-200/50">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 mx-3 shrink-0">
              {TICKER_ITEMS.map((item, idx) => (
                <span key={idx} className="flex items-center gap-6 text-xs sm:text-sm font-serif font-semibold text-[#016271] tracking-wide">
                  <span>{item}</span>
                  <span className="text-[#016271]/60 font-sans">+</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Top Dashed Pattern Strip */}
      <div 
        className="w-full h-3 mb-10 sm:mb-14 opacity-90"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='14' viewBox='0 0 24 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='2' width='10' height='10' rx='1' fill='%23016271'/%3E%3Crect x='12' y='2' width='10' height='10' rx='1' fill='%23F5BA24'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat-x",
          backgroundSize: "24px 14px",
        }}
      />

      <div className="max-w-7xl px-4 sm:px-6 lg:px-12 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left">
            <span className="text-[#016271] text-[11px] sm:text-xs font-bold tracking-widest uppercase mb-2 sm:mb-3 block">
              LOOWAY YATRA KIT
            </span>

            <h2 className="text-2xl sm:text-4xl lg:text-[44px] font-serif font-bold text-gray-900 leading-[1.15] mb-3 sm:mb-4">
              Pick a kit. Open it.<br className="hidden sm:block" /> Make it yours.
            </h2>

            <p className="text-xs sm:text-base text-gray-600 leading-relaxed max-w-lg mb-5 sm:mb-6">
              Eleven ready-made kits, from Girls' Trip to Teerth Yatra to Pregnancy, each built for the toilets that particular trip will throw at you. Open any one and change what is inside.
            </p>

            {/* Mobile 1-Row Marquee Loop Carousel for Trip Tags */}
            <div className="mb-5 w-full overflow-hidden lg:hidden">
              <div className="flex w-max animate-marquee gap-2.5">
                {[...TRIP_TAGS, ...TRIP_TAGS, ...TRIP_TAGS].map((tag, idx) => (
                  <span
                    key={`${tag}-${idx}`}
                    className="shrink-0 cursor-pointer rounded-full border border-gray-100 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 shadow-2xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Desktop Trip Tag Pills Wrap Grid */}
            <div className="mb-8 hidden max-w-md flex-wrap gap-2.5 lg:flex">
              {TRIP_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="cursor-pointer rounded-full border border-gray-100 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-2xs transition-all hover:border-[#016271] hover:text-[#016271]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Button */}
            <div className="mb-6 lg:mb-0">
              <Link
                href="/looway-yatra-kit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#016271] py-3 px-6 text-xs sm:text-sm font-semibold text-white shadow-md transition-all hover:bg-[#014e5a] hover:scale-105 lg:inline-flex lg:w-auto cursor-pointer"
              >
                <span>Build your Yatra Kit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full aspect-[4/3] sm:aspect-[1/1] max-w-md lg:max-w-lg rounded-3xl overflow-hidden shadow-xl border border-white/80 group">
              <Image
                src="/yatra_mom_daughter.jpg"
                alt="Mother and daughter camping with Looway Yatra Kit"
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
