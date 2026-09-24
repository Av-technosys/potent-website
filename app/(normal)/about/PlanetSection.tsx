import React from "react";

const PlanetSection = () => {
  const commitments = [
    {
      icon: "🌿",
      title: "Organic & Skin-Safe Materials",
      desc: "Plant-based fibres free from chlorine, dioxins, and harmful synthetics — safe for skin and soil.",
    },
    {
      icon: "📦",
      title: "Biodegradable Packaging",
      desc: "Recyclable, compostable, plastic-reduced across every product line. End-of-life by design.",
    },
    {
      icon: "♻️",
      title: "Reusable First",
      desc: "Menstrual cups last 10 years. Period panties replace hundreds of pads.",
    },
    {
      icon: "🔥",
      title: "Safe Disposal Infrastructure",
      desc: "Sanitary incinerators installed — enabling safe, dignified disposal.",
    },
    {
      icon: "💧",
      title: "Water-Safe Formulas",
      desc: "No chemicals that leach into groundwater or aquatic ecosystems.",
    },
    {
      icon: "📚",
      title: "Environmental Education",
      desc: "Teaching safe and responsible menstrual product disposal across Bharat.",
    },
  ];

  return (
    <section className="bg-[#f7f5f2] py-16 px-4 md:px-10 lg:px-20">
      
      {/* TOP LABEL */}
      <p className="text-xs tracking-[0.3em] text-green-600 uppercase mb-4">
        For the Planet
      </p>

      {/* HEADING */}
      <h2 className="text-3xl md:text-5xl font-serif text-gray-900 leading-tight mb-12">
        The crisis is real. <br />
        Our response is{" "}
        <span className="text-green-600 italic font-light">
          permanent.
        </span>
      </h2>

      {/* MAIN CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-sm border border-gray-200 mb-12">
        
        {/* LEFT - PROBLEM */}
        <div className="bg-[#2b0c0c] text-white p-8 md:p-10">
          <p className="text-xs tracking-widest text-red-400 uppercase mb-4">
            ▲ The Problem
          </p>

          <h3 className="text-xl md:text-2xl font-serif mb-4">
            Conventional hygiene is hurting our planet.
          </h3>

          <p className="text-sm text-gray-300 mb-6 leading-relaxed">
            Most sanitary pads are 90% plastic. They take 500–800 years to decompose,
            generating billions of units of waste every year.
          </p>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-lg font-semibold">12.3B</p>
              <p className="text-xs text-gray-400">Pads discarded yearly</p>
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-lg font-semibold">800yr</p>
              <p className="text-xs text-gray-400">To decompose in landfill</p>
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-lg font-semibold">90%</p>
              <p className="text-xs text-gray-400">Plastic in pads</p>
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-lg font-semibold">23%</p>
              <p className="text-xs text-gray-400">Girls drop out (hygiene)</p>
            </div>
          </div>
        </div>

        {/* RIGHT - SOLUTION */}
        <div className="bg-[#e8f2ec] text-gray-900 p-8 md:p-10">
          <p className="text-xs tracking-widest text-green-600 uppercase mb-4">
            ● Our Response
          </p>

          <h3 className="text-xl md:text-2xl font-serif mb-4">
            Every Potent Hygiene product is the answer.
          </h3>

          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Organic materials that biodegrade naturally. Reusables that replace
            thousands of disposable pads. Packaging that reduces plastic waste.
          </p>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-lg font-semibold">10yr</p>
              <p className="text-xs text-gray-500">Cup lifespan</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-lg font-semibold">3000</p>
              <p className="text-xs text-gray-500">Pads replaced</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-lg font-semibold">100%</p>
              <p className="text-xs text-gray-500">Free from toxins</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-lg font-semibold">0</p>
              <p className="text-xs text-gray-500">Endocrine disruptors</p>
            </div>
          </div>
        </div>
      </div>

      {/* COMMITMENTS */}
      <div>
        <p className="text-xs tracking-[0.3em] text-green-600 uppercase mb-6">
          Our Environmental Commitments
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {commitments.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="text-xl mb-3">{item.icon}</div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {item.title}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default PlanetSection;