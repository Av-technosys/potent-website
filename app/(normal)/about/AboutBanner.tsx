import Image from "next/image";
import React from "react";

const AboutBanner = () => {
  return (
    <section className="relative bg-[#061c1e] text-white overflow-hidden">

      {/* Gradient Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,200,0.08),transparent_60%)]" />

      <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">

        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 border border-teal-400/30 rounded-full px-4 py-1 mb-10 text-[10px] md:text-xs tracking-[0.25em] text-teal-300 uppercase">
          
         · Breaking the Silence · For Every Woman in Bharat
        </div>

        {/* Subtitle */}
        <p className="text-gray-400 tracking-[0.4em] text-xs md:text-sm mb-4">
          SHE WAS TOLD
        </p>

        {/* Main Heading with strike */}
        <div className="relative inline-block">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight">
            not to talk about it.
          </h1>

          {/* Strike Line */}
          <span className="absolute left-0 top-1/2 w-full h-[2px] bg-red-400/70"></span>
        </div>

        {/* Sub text */}
        <p className="text-gray-400 tracking-[0.3em] text-xs md:text-sm mt-8">
          WE BUILT A BRAND
        </p>

        {/* Highlight line */}
        <h2 className="text-3xl md:text-5xl font-serif italic text-teal-200 mt-2">
          on talking about it.
        </h2>

        {/* Stats Card */}
        <div className="mt-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 overflow-hidden">

          {/* Item */}
          <div className="p-8">
            <h3 className="text-3xl md:text-4xl font-serif mb-2">71%</h3>
            <p className="text-gray-400 text-sm">
              Women with zero menstrual knowledge at their first period
            </p>
          </div>

          <div className="p-8">
            <h3 className="text-3xl md:text-4xl font-serif mb-2">12.3 Billion</h3>
            <p className="text-gray-400 text-sm">
              Disposable pads discarded in India every single year
            </p>
          </div>

          <div className="p-8">
            <h3 className="text-3xl md:text-4xl font-serif mb-2">23%</h3>
            <p className="text-gray-400 text-sm">
              Girls who drop out of school due to lack of menstrual hygiene
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutBanner;