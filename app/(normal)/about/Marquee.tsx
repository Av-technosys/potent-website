import React from "react";

const items = [
  "PH BALANCED ✦",
  "CRUELTY FREE ✦",
  "MADE FOR BHARAT ✦",
  "DERM TESTED ✦",
  "ZERO COMPROMISE ✦",
  "HYGIENE IS A RIGHT ✦",
  "NO MORE ADJUSTING ✦",
  "SAFE FOR HER, SAFE FOR PLANET ✦",
];

const Marquee = () => {
  return (
    <div className="overflow-hidden bg-[#061c1e] py-3 border-y border-white/10">
      <div className="flex whitespace-nowrap animate-marquee">
        
        {/* First copy */}
        {items.map((item, i) => (
          <span
            key={i}
            className="mx-6 text-xs tracking-[0.3em] text-gray-400 uppercase"
          >
            {item}
          </span>
        ))}

        {/* Duplicate for seamless loop */}
        {items.map((item, i) => (
          <span
            key={`dup-${i}`}
            className="mx-6 text-xs tracking-[0.3em] text-gray-400 uppercase"
          >
            {item}
          </span>
        ))}

      </div>
    </div>
  );
};

export default Marquee;