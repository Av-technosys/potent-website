import Image from "next/image";

export const LoowaySection = () => {
  const products = [
    {
      icon: "🚿",
      title: "Pee Funnel",
      desc: "Stand-to-pee · Treks, pilgrimages, concerts",
    },
    {
      icon: "🛡️",
      title: "Disposable Toilet Seat Covers",
      desc: "Hygienic protection · Universal fit",
    },
    {
      icon: "🧳",
      title: "Pee & Puke Bags",
      desc: "Leak-proof · Road trips, flights, motion sickness",
    },
  ];

  return (
    <section className="bg-[#eaf4f5] py-16 px-4 md:px-10 lg:px-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT CARD */}
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
         <div className="w-32 h-32 mx-auto mb-6  rounded-full overflow-hidden">
            <Image
              src="/ovy-women-road.png"
              alt="women"
              width={128}
              height={128}
              className="h-full w-full object-cover"
            />
          </div>


          <h3 className="text-2xl font-serif text-gray-900 mb-4">
            No compromises on the road.
          </h3>

          <p className="text-gray-600 mb-6 leading-relaxed">
            Compact, reliable, and built for real Indian travel — from solo women trekkers to families on road trips.
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {["All Genders", "Travel-Ready", "Leak-Proof", "Compact"].map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-teal-100 text-teal-600 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div>
          <p className="text-xs tracking-[0.3em] text-teal-600 uppercase mb-4">
            Travel Hygiene · Sub-brand 02
          </p>

          <h1 className="text-5xl md:text-6xl font-serif text-teal-600 mb-2">
            Looway
          </h1>

          <p className="text-sm italic text-teal-400 mb-6">
            ✦ Your road, your rules — hygiene on the move
          </p>

          <h2 className="text-xl md:text-2xl font-serif text-gray-900 mb-4">
            Your Journey. Your Hygiene. Sorted.
          </h2>

          <p className="text-gray-600 mb-6 leading-relaxed max-w-xl">
            <strong>Looway is travel hygiene done right.</strong> Whether trekking the Himalayas or stuck in traffic — you’ve always got it handled.
          </p>

          {/* Product List */}
          <div className="space-y-3">
            {products.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3"
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

      </div>
    </section>
  );
};
