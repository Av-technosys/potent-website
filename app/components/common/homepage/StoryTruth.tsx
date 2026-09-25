import React from "react";
import Image from "next/image";
import Link from "next/link";

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
};

const StoryTruth = (_props: Props) => {
  return (
    <section className="w-full bg-[#F5EEF6] overflow-hidden relative pb-16 pt-0 mb-12">
      {/* Top Strip with alternating dark teal & yellow pattern */}
      <div 
        className="w-full h-3.5 mb-12 sm:mb-16 opacity-90"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='14' viewBox='0 0 24 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='2' width='10' height='10' rx='1' fill='%23016271'/%3E%3Crect x='12' y='2' width='10' height='10' rx='1' fill='%23F5BA24'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat-x",
          backgroundSize: "24px 14px",
        }}
      />

      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full pt-1">
            <div>
              <span className="text-[#016271] text-[11px] sm:text-xs font-bold tracking-widest uppercase mb-2 sm:mb-3 block">
                FOR MOTHERS AND DAUGHTERS
              </span>

              <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-serif font-bold text-[#222222] leading-[1.15]">
                Her first period,<br />
                <span className="font-caveat text-3xl sm:text-5xl lg:text-[52px] text-[#8C4F7C] font-normal inline-block mt-1 tracking-wide">
                  handled with love.
                </span>
              </h2>

              <p className="mt-3 sm:mt-6 text-xs sm:text-base text-gray-600 leading-relaxed max-w-md">
                The hardest part of a first period is the not knowing. So we chose everything in advance, wrote the guidebook she will actually read, and made the wrapper silent for school.
              </p>

              {/* Parents advice card */}
              <div className="mt-8 hidden p-6 bg-white rounded-2xl shadow-xs border border-purple-100/60 max-w-md lg:block">
                <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-2">
                  For parents: how to start the conversation
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                  You do not need the perfect words, just calm and open ones. Tell her it happens to everyone, there is no rush to have it all figured out, and she can always come to you.
                </p>
                <Link
                  href="/blog/periods-power-productivity-how-managing-menstrual-health-can-skyrocket-your-efficiency"
                  className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#8C4F7C] hover:underline group gap-1"
                >
                  Read the parents' corner <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>

            <p className="mt-8 hidden text-xs text-gray-500 lg:block">
              Gift mode at checkout hides the price and adds your note.
            </p>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-6">
            
            {/* First Period Box - Purple Banner */}
            <div className="bg-[#8C4F7C] rounded-2xl p-5 sm:p-7 text-white shadow-sm relative overflow-hidden">
              <span className="text-[10px] sm:text-xs font-bold tracking-widest text-purple-200 uppercase mb-1.5 sm:mb-2 block">
                THE MILESTONE GIFT
              </span>
              <h3 className="text-lg sm:text-2xl font-serif font-bold text-white mb-1.5 sm:mb-2">
                First Period Box
              </h3>
              <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed mb-4 sm:mb-5 max-w-xl">
                50 pieces. Pads in three sizes, period panties, seat covers, wipes, disposal bags, warming patches, and the “You’ve Got This” guidebook, written for her.
              </p>
              <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#602E55] text-white shadow-inner">
                Coming soon
              </span>
            </div>

            {/* Product Cards (Side-by-Side on Mobile) */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              
              {/* Card 1: Starter Pack */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col h-full border border-purple-100/60">
                <div className="relative w-full aspect-[4/3] bg-purple-50">
                  <Image
                    src="/products/teen.jpg"
                    alt="Starter Pack"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
                <div className="p-3 sm:p-5 flex flex-col flex-1">
                  <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-[#8C4F7C] uppercase mb-1 block">
                    BIG CHANGES NEED A GENTLE START
                  </span>
                  <h4 className="text-xs sm:text-lg font-serif font-bold text-gray-900 mb-1">
                    Starter Pack
                  </h4>
                  <p className="text-[10px] sm:text-xs text-gray-600 leading-snug mb-3 flex-1">
                    10 L and 11 XL pads plus 4 liners. Two sizes, so she learns her own flow from day one.
                  </p>
                  <Link
                    href="/products/ovy-teen-starter-pack"
                    className="inline-flex items-center text-[11px] sm:text-xs font-semibold text-[#8C4F7C] hover:gap-2 transition-all gap-1 mt-auto group"
                  >
                    Shop Starter <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>

              {/* Card 2: Pro-Active Pack */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col h-full border border-purple-100/60">
                <div className="relative w-full aspect-[4/3] bg-purple-50">
                  <Image
                    src="/products/teen-pro.jpg"
                    alt="Pro-Active Pack"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
                <div className="p-3 sm:p-5 flex flex-col flex-1">
                  <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-[#8C4F7C] uppercase mb-1 block">
                    BLEED. CONQUER. SLAY.
                  </span>
                  <h4 className="text-xs sm:text-lg font-serif font-bold text-gray-900 mb-1">
                    Pro-Active Pack
                  </h4>
                  <p className="text-[10px] sm:text-xs text-gray-600 leading-snug mb-3 flex-1">
                    Three sizes, sport-tested wings and sweat-wicking fibres. For the girl who will not hit pause.
                  </p>
                  <Link
                    href="/products/ovy-for-active-teens"
                    className="inline-flex items-center text-[11px] sm:text-xs font-semibold text-[#8C4F7C] hover:gap-2 transition-all gap-1 mt-auto group"
                  >
                    Shop Pro-Active <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default StoryTruth;
