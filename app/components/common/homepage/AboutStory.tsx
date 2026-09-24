import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const AboutStory = () => {
  return (
    <section className="mb-12 w-full overflow-hidden bg-[#F5EEF6] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* LEFT IMAGE CONTAINER */}
          <div className="flex justify-center lg:col-span-5">
            <div className="group relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2.5rem] border border-purple-100/60 shadow-2xl sm:aspect-[1/1] lg:max-w-lg">
              <Image
                src="/products/pads-l.jpg"
                alt="Ovy Regular Flow Sanitary Pads Box"
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex flex-col text-left lg:col-span-7">
            <span className="mb-3 block text-[11px] font-bold tracking-widest text-[#016271] uppercase sm:text-xs">
              ONLY AT OVY
            </span>

            <h2 className="mb-4 font-serif text-3xl leading-[1.18] font-bold sm:text-4xl lg:text-[40px]">
              <span className="block text-gray-900">Your flow is not the</span>
              <span className="block text-gray-900">same every day.</span>
              <span className="mt-1 block text-[#8C4F7C]">
                Your box should not be either.
              </span>
            </h2>

            <p className="mb-6 max-w-xl text-xs leading-relaxed text-gray-600 sm:text-sm">
              Build one 21-pad box across L, XL and XL+ in any combination, with
              4 liners always included. Then let Cycle-Sync land it about 5 days
              before you are due. It is the first period delivery in India timed
              to your own cycle.
            </p>

            {/* 3 Numbered Steps */}
            <div className="mb-8 flex flex-col divide-y divide-purple-200/60 border-t border-b border-purple-200/60">
              {/* Step 01 */}
              <div className="flex items-start gap-4 py-4">
                <span className="shrink-0 pt-0.5 font-serif text-base font-bold text-[#8C4F7C] sm:text-lg">
                  01
                </span>
                <div className="flex flex-col">
                  <h4 className="mb-0.5 text-sm font-bold text-gray-900 sm:text-base">
                    Pick your lengths
                  </h4>
                  <p className="text-xs leading-relaxed text-gray-600">
                    L 240mm, XL 280mm and XL+ 320mm, in any mix that adds up to
                    21.
                  </p>
                </div>
              </div>

              {/* Step 02 */}
              <div className="flex items-start gap-4 py-4">
                <span className="shrink-0 pt-0.5 font-serif text-base font-bold text-[#8C4F7C] sm:text-lg">
                  02
                </span>
                <div className="flex flex-col">
                  <h4 className="mb-0.5 text-sm font-bold text-gray-900 sm:text-base">
                    Liners included
                  </h4>
                  <p className="text-xs leading-relaxed text-gray-600">
                    Four Ovy daily liners go into every box.
                  </p>
                </div>
              </div>

              {/* Step 03 */}
              <div className="flex items-start gap-4 py-4">
                <span className="shrink-0 pt-0.5 font-serif text-base font-bold text-[#8C4F7C] sm:text-lg">
                  03
                </span>
                <div className="flex flex-col">
                  <h4 className="mb-0.5 text-sm font-bold text-gray-900 sm:text-base">
                    Time it to your cycle
                  </h4>
                  <p className="text-xs leading-relaxed text-gray-600">
                    Enter three dates once. The box arrives about 5 days before
                    your period, every cycle. Pause or cancel any time.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div>
              <Link
                href="/product-detail/ovy-teen?scroll=starter#starter"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#8C4F7C] px-7 py-3.5 text-xs font-semibold text-white shadow-md transition-all hover:scale-105 hover:bg-[#773f69] sm:text-sm"
              >
                <span>Build your box</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStory;
