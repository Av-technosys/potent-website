import React from "react";

const stats = [
  {
    value: "50K+",
    label: "Women reached across Bharat",
  },
  {
    value: "3",
    label: "D2C brands built from scratch",
  },
  {
    value: "100%",
    label: "Dermatologically tested products",
  },
  {
    value: "23%",
    label: "Girls miss school due to poor menstrual hygiene",
  },
  {
    value: "2",
    label: "IIM Incubations — NSRCEL & IIMV FIELD",
  },
  {
    value: "Top 13",
    label: "TiE Women Rajasthan · 2025",
  },
];

const highlights = [
  {
    icon: "🎓",
    title: "Menstrual Hygiene Education",
    desc: "Reaching underserved women through workshops across Rajasthan with Roshni NGO.",
  },
  {
    icon: "🌿",
    title: "Organic-First Product Range",
    desc: "Every Ovy product is organic, skin-safe, non-irritant, pH-balanced, and cruelty-free.",
  },
  {
    icon: "✈️",
    title: "Travel Hygiene for All",
    desc: "Looway removes barriers that make public hygiene a gamble — for everyone.",
  },
];

const NumbersSection = () => {
  return (
    <section className="bg-[#f7f5f2] py-16 px-4 md:px-10 lg:px-20">
      
      {/* LABEL */}
      <p className="text-xs tracking-[0.3em] text-teal-600 uppercase mb-4">
        The Numbers Behind The Mission
      </p>

      {/* HEADING */}
      <h2 className="text-3xl md:text-5xl font-serif text-gray-900 leading-tight mb-12">
        Every figure represents <br />
        a{" "}
        <span className="text-teal-600 italic font-light">
          real woman.
        </span>
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* LEFT - STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stats.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
            >
              <p className="text-3xl font-serif text-teal-600 mb-2">
                {item.value}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* RIGHT - CONTENT */}
        <div>
          <h3 className="text-xl md:text-2xl font-serif text-gray-900 mb-4">
            The work that{" "}
            <span className="italic text-teal-600">
              matters most
            </span>{" "}
            is the work no one else is doing.
          </h3>

          <p className="text-gray-600 mb-4 leading-relaxed">
            Anyone can sell a pad. Very few build an organic, dermatologically tested,
            pH-balanced range. Even fewer take menstrual health education into
            communities that need it most. We do both.
          </p>

          <p className="text-gray-600 mb-6 leading-relaxed">
            We measure success not in revenue, but in the number of women who no longer
            silently endure discomfort, infections, or stigma.
          </p>

          {/* HIGHLIGHTS */}
          <div className="space-y-4">
            {highlights.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default NumbersSection;