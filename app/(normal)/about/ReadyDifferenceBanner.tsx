import React from "react";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

const ReadyDifferenceBanner = () => {
  return (
    <section className="w-full bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 xl:px-8">
        <div className="flex flex-col items-center text-center gap-8">


          <h2 className="text-3xl sm:text-3xl xl:text-4xl font-semibold text-neutral-800">
            Ready to Experience the Difference?
          </h2>


          <p className="text-xl sm:text-sm text-gray-600 max-w-4xl">
            Join thousands of women who trust Potent Hygiene for their daily
            care needs. Discover products that truly understand you.
          </p>


          <div className="flex  flex-row  items-center gap-4 pt-2">


            <Link href="/shop" className="group flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#1496ad] to-[#9ad7e3] text-white font-semibold text-base px-8 py-3 shadow-md transition hover:opacity-95">
              Shop Now
              <IconArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>


            <Link href="/shop" className="rounded-full border-2 border-[#1496ad] text-[#1496ad] font-semibold text-base px-8 py-3 bg-white transition hover:bg-[#f3fbfc]">
              View Products
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ReadyDifferenceBanner;