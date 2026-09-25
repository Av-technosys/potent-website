const TICKER_ITEMS_DARK = [
  "Rewards Club cash credits",
  "Gift mode hides the price",
  "Pause, skip or cancel in two clicks",
  "Mix Your Box",
  "Subscribe and save",
  "A surprise gift in every third box",
];

const WHY_CARDS = [
  {
    badge: "ONLY HERE",
    title: "Cycle-Sync delivery",
    description:
      "Your box lands about 5 days before you are due. The first period delivery in India timed to your own cycle.",
    isMint: true,
  },
  {
    badge: "ONLY HERE",
    title: "Mix Your Box",
    description:
      "One box, three pad lengths, in whatever combination your cycle actually needs. Nobody else does this.",
    isMint: true,
  },
  {
    title: "Subscribe and save",
    description:
      "A saving on every order, free delivery over the threshold, and a surprise gift in every third box. Pause, skip or cancel in two clicks.",
  },
  {
    title: "Rewards Club",
    description:
      "Cash credits in rupees rather than points. Earned on orders, reviews, referrals and your birthday, and applied automatically at checkout.",
  },
  {
    title: "Gift mode",
    description:
      "Hides the price and adds your note, so a teen kit arrives feeling thoughtful rather than transactional.",
  },
  {
    title: "Claims we can prove",
    description:
      "Certified toxin-free, dermatologically tested, pH-balanced and non-irritant, with a certificate behind every word on the pack.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF7F2] pt-0 pb-16">
      {/* Top Ticker Strap (Dark Teal) */}
      <div className="w-full overflow-hidden bg-[#016271] py-2.5">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="mx-3 flex shrink-0 items-center gap-6">
              {TICKER_ITEMS_DARK.map((item, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-6 font-serif text-xs font-medium tracking-wide text-white sm:text-sm"
                >
                  <span>{item}</span>
                  <span className="font-sans text-white/60">+</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Top Dashed Pattern Strip */}
      <div
        className="mb-8 h-3 w-full opacity-90 sm:mb-16"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='14' viewBox='0 0 24 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='2' width='10' height='10' rx='1' fill='%23016271'/%3E%3Crect x='12' y='2' width='10' height='10' rx='1' fill='%23F5BA24'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat-x",
          backgroundSize: "24px 14px",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-6 text-center sm:mb-12">
          <span className="mb-1 block text-[11px] font-bold tracking-widest text-[#016271] uppercase sm:text-xs">
            WHY BUY DIRECT
          </span>
          <h2 className="mb-2 font-serif text-2xl leading-tight font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Better here than anywhere else.
          </h2>
          <p className="mx-auto max-w-xl text-xs leading-relaxed text-gray-600 sm:text-sm">
            The things you only get on potenthygiene.com, and the claims we can
            actually prove.
          </p>
        </div>

        {/* Mobile 1-Row Continuous Marquee Loop Carousel (< lg) */}
        <div className="mb-6 w-full overflow-hidden lg:hidden">
          <div className="flex w-max animate-marquee gap-3.5 py-2">
            {[...WHY_CARDS, ...WHY_CARDS, ...WHY_CARDS].map((card, idx) => (
              <div
                key={idx}
                className={`w-[250px] shrink-0 rounded-2xl p-4 shadow-2xs ${
                  card.isMint
                    ? "border border-[#BDE3EA] bg-[#E6F4F6]"
                    : "border border-gray-100 bg-white"
                }`}
              >
                {card.badge && (
                  <span className="mb-2 inline-block w-fit rounded-full border border-[#016271]/20 bg-white/90 px-2 py-0.5 text-[9px] font-bold tracking-wider text-[#016271] uppercase">
                    {card.badge}
                  </span>
                )}
                <h3 className="mb-1 font-serif text-sm font-bold text-gray-900">
                  {card.title}
                </h3>
                <p className="text-[11px] leading-snug text-gray-600">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop 3-Column Grid (lg:) */}
        <div className="mx-auto hidden max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid lg:grid-cols-3">
          {WHY_CARDS.map((card, idx) => (
            <div
              key={idx}
              className={`flex flex-col justify-start rounded-2xl p-6 shadow-2xs transition-all hover:shadow-md ${
                card.isMint
                  ? "border border-[#BDE3EA] bg-[#E6F4F6]"
                  : "border border-gray-100 bg-white"
              }`}
            >
              {card.badge && (
                <span className="mb-3 inline-block w-fit rounded-full border border-[#016271]/20 bg-white/90 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#016271] uppercase">
                  {card.badge}
                </span>
              )}
              <h3 className="mb-2 font-serif text-lg font-bold text-gray-900 sm:text-xl">
                {card.title}
              </h3>
              <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
