"use client";

interface ComparisonItem {
  situation: string;
  oldWay: string;
  looway: string;
  stripPattern: string;
}

const COMPARISON_DATA: ComparisonItem[] = [
  {
    situation: "A filthy Western seat",
    oldWay: "Hover over it, knees aching",
    looway: "Lay a cover, push out the centre, sit down",
    stripPattern:
      "repeating-linear-gradient(180deg, #004851 0 7px, #F6D353 7px 14px)",
  },
  {
    situation: "A squat pan, with sore knees or a bump",
    oldWay: "Squat anyway, or wait for the next stop",
    looway: "Stand, clothes just moved aside, touching nothing",
    stripPattern:
      "repeating-linear-gradient(180deg, #C02670 0 7px, #F6D353 7px 14px)",
  },
  {
    situation: "No toilet on the highway, or a car-sick child",
    oldWay: "Hold it to the next dhaba, or a plastic bag and a wet back seat",
    looway: "A bag that turns pee or vomit to gel and seals shut",
    stripPattern:
      "repeating-linear-gradient(180deg, #1E5E41 0 7px, #F6D353 7px 14px)",
  },
];

export function LoowayComparisonSection() {
  return (
    <section className="w-full overflow-hidden bg-[#FAF9F5] pt-0 pb-16 md:pb-24">
      {/* Top Alternating Pattern Strap */}
      <div
        className="mb-10 h-3 w-full border-b border-teal-900/10 md:mb-14"
        style={{
          background:
            "repeating-linear-gradient(90deg, #004851 0 12px, #F6D353 12px 24px)",
        }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <span className="mb-2 block text-[11px] font-bold tracking-widest text-[#006573] uppercase">
            THE OLD WAY, AND THE LOOWAY
          </span>
          <h2 className="font-serif text-[27px] leading-[29.16px] font-semibold text-[#1A150F] sm:text-[46px] sm:leading-[49.68px]">
            You have been making do. You don’t have to.
          </h2>
        </div>

        {/* 3 Comparison Cards / Rows */}
        <div className="space-y-4 sm:space-y-6">
          {COMPARISON_DATA.map((item, idx) => (
            <div
              key={idx}
              className="relative flex flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-[#EAE3D2] bg-[#F6F2E9] p-5 pl-7 shadow-2xs transition-all hover:shadow-xs sm:p-6 sm:pl-9 md:flex-row md:items-center md:gap-6 md:p-7"
            >
              {/* Left Vertical Strip Pattern */}
              <div
                className="absolute top-0 bottom-0 left-0 w-3 rounded-l-2xl"
                style={{ background: item.stripPattern }}
              />

              {/* Situation Title (Left) */}
              <div className="md:w-[32%]">
                <h3 className="text-base leading-snug font-bold text-[#1F1915] sm:text-lg">
                  {item.situation}
                </h3>
              </div>

              {/* The Old Way (Center) */}
              <div className="space-y-1 md:w-[34%]">
                <span className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                  THE OLD WAY
                </span>
                <p className="text-xs leading-relaxed font-normal text-gray-500 sm:text-sm">
                  {item.oldWay}
                </p>
              </div>

              {/* The Looway Inner Card (Right) */}
              <div className="space-y-1 rounded-xl border border-gray-100/90 bg-white p-4 shadow-2xs sm:p-4.5 md:w-[34%]">
                <span className="block text-[10px] font-bold tracking-widest text-[#006573] uppercase">
                  THE LOOWAY
                </span>
                <p className="text-xs leading-relaxed font-bold text-[#1F1915] sm:text-sm">
                  {item.looway}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
