import React from "react";

const NorthStar = () => {
  return (
    <section className="bg-[#f7f5f2] py-16 px-4 md:px-10 lg:px-20">
      {/* Top Label */}
      <div className="mb-6">
        <p className="text-xs tracking-[0.3em] text-teal-600 font-medium uppercase">
          Our North Star
        </p>
      </div>

      {/* Heading */}
      <div className="max-w-5xl mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 leading-tight">
          Rooted in{" "}
          <span className="text-teal-600 italic font-light">
            conviction.
          </span>
          <br />
          Built for lasting impact.
        </h1>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="relative bg-white/60 backdrop-blur rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
          <p className="text-xs tracking-widest text-teal-600 uppercase mb-3">
            Our Purpose
          </p>

          <h3 className="text-lg md:text-xl font-serif text-gray-900 mb-4">
            To make{" "}
            <span className="text-rose-400 italic">
              every woman
            </span>{" "}
            feel dignified.
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed">
            In a country where 71% of women had no menstrual hygiene knowledge
            at their first period, and millions use unsafe materials — we exist
            to change the baseline. Permanently.
          </p>
        </div>

        {/* Card 2 */}
        <div className="relative bg-white/60 backdrop-blur rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
          <p className="text-xs tracking-widest text-teal-600 uppercase mb-3">
            Our Vision
          </p>

          <h3 className="text-lg md:text-xl font-serif text-gray-900 mb-4">
            A Bharat where{" "}
            <span className="text-rose-400 italic">
              no woman
            </span>{" "}
            compromises.
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed">
            Whether in a boardroom in Bangalore, a farm in Rajasthan, or the most
            remote corner of Bharat — her body deserves the same standard of care.
          </p>
        </div>

        {/* Card 3 */}
        <div className="relative bg-white/60 backdrop-blur rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
          <p className="text-xs tracking-widest text-teal-600 uppercase mb-3">
            Our Mission
          </p>

          <h3 className="text-lg md:text-xl font-serif text-gray-900 mb-4">
            Products that{" "}
            <span className="text-rose-400 italic">
              prove
            </span>{" "}
            skin-safe is possible.
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed">
            Organic, dermatologically tested, pH-balanced, cruelty-free hygiene —
            taken into communities mainstream brands never reach. Commerce with conscience.
          </p>
        </div>

      </div>
    </section>
  );
};

export default NorthStar;