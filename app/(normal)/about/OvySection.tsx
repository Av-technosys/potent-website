import React from "react";
import Image from "next/image";

const OvySection = () => {
  const products = [
    {
      icon: "🩸",
      title: "Organic Sanitary Pads",
      desc: "Ultra-soft · Various sizes · Rash-free",
    },
    {
      icon: "🌸",
      title: "Menstrual Cups",
      desc: "12 hrs protection · Reusable · Up to 10 years",
    },
    {
      icon: "💜",
      title: "Period Panties",
      desc: "Leak-proof · Disposable · Replaces 100s of pads",
    },
    {
      icon: "✨",
      title: "Panty Liners",
      desc: "Daily freshness · Breathable · Gentle on skin",
    },
  ];

  return (
    <section className="bg-gradient-to-r from-[#f7f5f2] to-[#f3d6db] py-16 px-4 md:px-10 lg:px-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT CONTENT */}
        <div>
          <p className="text-xs tracking-[0.3em] text-rose-400 uppercase mb-4">
            Menstrual Care · Sub-brand 01
          </p>

          <h1 className="text-5xl md:text-6xl font-serif text-rose-400 mb-2">
            Ovy
          </h1>

          <p className="text-sm italic text-rose-300 mb-6">
            ✦ Derived from Ovaries — honouring the source
          </p>

          <h2 className="text-xl md:text-2xl font-serif text-gray-900 mb-4">
            Own Your Body. Own Your Cycle.
          </h2>

          <p className="text-gray-600 mb-6 leading-relaxed max-w-xl">
            <strong>Ovy is menstrual care reimagined for the modern Indian woman.</strong>{" "}
            Soft, organic, rash-free, pH-balanced, and kind to the planet. No chemicals your skin didn’t consent to. No synthetic fragrances. No compromises.
          </p>

          {/* Product List */}
          <div className="space-y-3">
            {products.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-white/70 backdrop-blur border border-gray-200 rounded-xl px-4 py-3"
              >
                <span className="text-lg">{item.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-white/70 backdrop-blur border border-gray-200 rounded-2xl p-8 text-center">
          <div className="w-32 h-32 mx-auto mb-6  rounded-full overflow-hidden">
            <Image
              src="/ovy-women.png"
              alt="women"
              width={128}
              height={128}
              className="h-full w-full object-cover"
            />
          </div>

          <h3 className="text-2xl font-serif text-gray-900 mb-4">
            Comfort. Confidence. Care.
          </h3>

          <p className="text-gray-600 mb-6 leading-relaxed">
            Ovy products are formulated with organic, skin-safe materials — free from chlorine, dioxins, synthetic fragrances, and harsh chemicals.
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {["Derm Tested", "Non-Irritant", "pH Balanced", "Cruelty-Free", "Safe for Planet"].map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-rose-100 text-rose-500 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OvySection;
