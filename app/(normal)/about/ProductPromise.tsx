import React from "react";

const promises = [
  {
    icon: "🧪",
    title: "Dermatologically Tested",
    desc: "Tested on human skin panels by certified labs. Safe for all skin types including sensitive.",
    tag: "Lab Certified",
  },
  {
    icon: "🚫",
    title: "Non-Irritant",
    desc: "Zero irritants — no chlorine, no dioxins, no synthetic fragrances. No more rashes.",
    tag: "Clinically Verified",
  },
  {
    icon: "⚖️",
    title: "pH Balanced",
    desc: "Matched to your body's natural chemistry. Supports microbiome health and prevents irritation.",
    tag: "Skin Harmonious",
  },
  {
    icon: "🐰",
    title: "Cruelty-Free",
    desc: "No animal testing at any stage of development. Ever. Full stop.",
    tag: "No Animal Testing",
  },
  {
    icon: "🌿",
    title: "Organic & Skin-Safe",
    desc: "Plant-based, organic materials — grown without synthetic pesticides. Softer, safer, breathable.",
    tag: "Clean Formulation",
  },
  {
    icon: "♻️",
    title: "Eco Packaging",
    desc: "Biodegradable, recyclable, plastic-reduced packaging across the full product range.",
    tag: "Eco-Conscious",
  },
];

const ProductPromise = () => {
  return (
    <section className="bg-[#f7f5f2] py-16 px-4 md:px-10 lg:px-20">
      
      {/* Top Label */}
      <div className="mb-6">
        <p className="text-xs tracking-[0.3em] text-teal-600 uppercase font-medium">
          Our Product Promise
        </p>
      </div>

      {/* Heading + Description */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        
        {/* Left Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 leading-tight">
          Every label, <br />
          every{" "}
          <span className="text-teal-600 italic font-light">
            claim, earned.
          </span>
        </h2>

        {/* Right Description */}
        <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-xl">
          No marketing language. Every commitment we carry is backed by third-party
          laboratory testing — because when we say skin-safe, we mean it and we can prove it.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {promises.map((item, index) => (
          <div
            key={index}
            className="bg-white/70 backdrop-blur rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition"
          >
            {/* Icon */}
            <div className="text-2xl mb-4">{item.icon}</div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {item.desc}
            </p>

            {/* Tag */}
            <span className="inline-block text-xs tracking-widest uppercase bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
              {item.tag}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductPromise;