"use client";

import Image from "next/image";

export function OvyPadsDetail() {
  return (
    <section className="w-full bg-[#FAF5E8] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Exploded Pad Diagram with Purple Beaded Frame */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md sm:max-w-lg aspect-square">
              <div
                className="relative h-full w-full rounded-3xl p-4 sm:p-5 shadow-sm border border-purple-200/40"
                style={{ backgroundColor: "#FAF3EB" }}
              >
                {/* SVG Purple Beaded Frame Ring */}
                <svg
                  className="absolute inset-0 h-full w-full pointer-events-none p-1.5 sm:p-2"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="6"
                    y="6"
                    width="calc(100% - 12px)"
                    height="calc(100% - 12px)"
                    rx="22"
                    fill="none"
                    stroke="#8C4F7C"
                    strokeWidth="6"
                    strokeDasharray="0 14"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Main Pad Diagram Image */}
                <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white flex items-center justify-center p-2">
                  <Image
                    src="/ovy/pad-diagram.jpg"
                    alt="Four layers exploded pad diagram"
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 100vw, 550px"
                    priority
                  />
                </div>

                {/* Inset Overlay Photo (Twist Test) */}
                <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 max-w-[160px] sm:max-w-[210px] bg-white rounded-2xl p-2 sm:p-3 shadow-xl border border-purple-100/80 z-10">
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-purple-50 mb-1.5">
                    <Image
                      src="/ovy/pad-twist.jpg"
                      alt="The twist test"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-[10px] sm:text-xs text-[#4A3B47] leading-tight font-medium">
                    The twist test: a used pad, wrung out. The core keeps what it took in.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Text Content & Numbered Layers */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="mb-6">
              <span className="text-[11px] font-bold tracking-widest text-[#602E55] uppercase block mb-1.5">
                NOT YOUR AVERAGE PAD
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-4xl font-bold text-[#1F1915] leading-snug">
                Four layers, and nothing you would not want next to your skin.
              </h2>
            </div>

            {/* Numbered Layers (01 - 04) */}
            <div className="divide-y divide-[#EAE1D3] border-t border-b border-[#EAE1D3] mb-6">
              <div className="py-3.5 sm:py-4 flex items-start gap-4">
                <span className="font-serif text-xl sm:text-2xl font-normal text-[#602E55] w-7 sm:w-8 shrink-0">
                  01
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#1F1915] leading-snug">
                    Organic top sheet
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C524D] mt-0.5 leading-relaxed font-normal">
                    100% organic, cottony-soft, hypoallergenic fibres. Rash-free, never a plastic feel.
                  </p>
                </div>
              </div>

              <div className="py-3.5 sm:py-4 flex items-start gap-4">
                <span className="font-serif text-xl sm:text-2xl font-normal text-[#602E55] w-7 sm:w-8 shrink-0">
                  02
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#1F1915] leading-snug">
                    Acquisition layer
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C524D] mt-0.5 leading-relaxed font-normal">
                    Natural fibres pull fluid away from the skin fast, so the surface stays dry.
                  </p>
                </div>
              </div>

              <div className="py-3.5 sm:py-4 flex items-start gap-4">
                <span className="font-serif text-xl sm:text-2xl font-normal text-[#602E55] w-7 sm:w-8 shrink-0">
                  03
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#1F1915] leading-snug">
                    Super-absorbent core
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C524D] mt-0.5 leading-relaxed font-normal">
                    A gel core that locks fluid and odour at source, instead of perfuming over it. Twist a used pad and nothing comes back out.
                  </p>
                </div>
              </div>

              <div className="py-3.5 sm:py-4 flex items-start gap-4">
                <span className="font-serif text-xl sm:text-2xl font-normal text-[#602E55] w-7 sm:w-8 shrink-0">
                  04
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#1F1915] leading-snug">
                    Breathable backsheet
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C524D] mt-0.5 leading-relaxed font-normal">
                    Lets heat out, so there is no sweat build-up in an Indian summer. Extra-wide wings hold everything in place; the XL+ adds dual leak guards.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                "No chlorine bleach",
                "No parabens",
                "No fragrance",
                "No dyes",
                "No synthetic plastics",
              ].map((pill) => (
                <span
                  key={pill}
                  className="bg-[#F5EFF6] text-[#602E55] text-xs font-semibold px-3.5 py-1.5 rounded-full border border-[#E8DAEC] shadow-2xs"
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* Footer Note */}
            <p className="text-xs text-[#6B5E57] leading-relaxed font-normal">
              Every pad comes with its own biodegradable, compostable disposal bag. Roll, seal, bin. Never flush.
            </p>

          </div>

        </div>
      </div>
    </section>
  );
}
