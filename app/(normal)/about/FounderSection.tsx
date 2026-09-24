// import React from "react";

// const FounderSection = () => {
//   return (
//     <section className="bg-[#061c1e] text-white">
//       <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        
//         {/* LEFT IMAGE */}
//         <div className="relative h-[400px] lg:h-auto">
//           <Image
//             src="/divya-agrawal.jpeg" // replace with your image
//             alt="Founder"
//             className="w-full h-full object-cover"
//           />
//         </div>

//         {/* RIGHT CONTENT */}
//         <div className="flex flex-col justify-center px-6 md:px-12 lg:px-20 py-12">
          
//           {/* Label */}
//           <div className="flex items-center gap-3 mb-6">
//             <div className="w-10 h-[1px] bg-gray-500"></div>
//             <p className="text-xs tracking-[0.3em] text-gray-400 uppercase">
//               The Founder’s Chapter
//             </p>
//           </div>

//           {/* Name */}
//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight mb-4">
//             DIVITA <br /> AGARWAL
//           </h1>

//           {/* Role */}
//           <p className="text-teal-400 tracking-widest text-sm uppercase mb-8">
//             CEO & Co-Founder · Potent Hygiene
//           </p>

//           <hr className="border-gray-700 mb-8" />

//           {/* Quote */}
//           <p className="text-lg md:text-xl italic text-gray-300 leading-relaxed font-serif">
//             "I did not start Potent Hygiene to build a company. I started it
//             because I was tired of watching women accept discomfort — chemicals,
//             rashes, shame, silence — as if that were destiny. It is not."
//           </p>

//           <hr className="border-gray-700 mt-10" />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FounderSection;


import React from "react";
import Image from "next/image";

const achievements = [
  {
    id: "01",
    icon: "🏢",
    title: "NSRCEL · IIM Bangalore",
    desc: "Women Startup Programme, WSP5 Cohort · Active",
  },
  {
    id: "02",
    icon: "🌱",
    title: "IIM Visakhapatnam · FIELD",
    desc: "Funded · December 2025",
  },
  {
    id: "03",
    icon: "🏆",
    title: "TiE Women Rajasthan — Top 13",
    desc: "Startup Recognition · 2025",
  },
  {
    id: "04",
    icon: "🎓",
    title: "MBA · NMIMS Mumbai",
    desc: "Brand Strategy & Business Management",
  },
  {
    id: "05",
    icon: "💗",
    title: "Vice President · Roshni NGO",
    desc: "Roshni Manav Utthaan Sansthaan, Rajasthan",
  },
];


const storyData = [
  {
    title: "THE SPARK",
    text: `Divita saw women accepting chemical-laden products causing rashes and infections as normal. 
    She asked: why should any woman in 2024 use a product that harms her? 
    That question built Potent Hygiene.`,
  },
  {
    title: "BUILT FROM NOTHING",
    text: `First-time founder. No rulebook. No prior playbook. Three D2C brands built from scratch — 
    incubated at two IIMs, funded, and growing across Bharat.`,
  },
  {
    title: "THE PLANET PROBLEM",
    text: `India disposes 12.3 billion pads every year. Most take 800 years to decompose. 
    Divita saw an environmental crisis hiding in plain sight — and built the answer into every product.`,
  },
  {
    title: "BEYOND COMMERCE",
    text: `As VP of Roshni NGO, Divita carries menstrual hygiene education into spaces most brands never reach — 
    rural schools, health centres, and underserved communities across Bharat.`,
  },
];

const FounderSection = () => {
  return (
    <>
    <section className="bg-[#061c1e] text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        
        {/* LEFT IMAGE */}
        <div className="relative h-[400px] lg:h-auto">
          <Image
            src="/divya-agrawal.jpeg"
            alt="Founder"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex flex-col justify-center px-6 md:px-12 lg:px-20 py-12">
          
          {/* Label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-[1px] bg-gray-500"></div>
            <p className="text-xs tracking-[0.3em] text-gray-400 uppercase">
              The Founder’s Chapter
            </p>
          </div>

          {/* Name */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight mb-4">
            DIVITA <br /> AGARWAL
          </h1>

          {/* Role */}
          <p className="text-teal-400 tracking-widest text-sm uppercase mb-8">
            CEO & Co-Founder · Potent Hygiene
          </p>

          <hr className="border-gray-700 mb-8" />

          {/* Quote */}
          <p className="text-lg md:text-xl italic text-gray-300 leading-relaxed font-serif mb-10">
            "I did not start Potent Hygiene to build a company. I started it
            because I was tired of watching women accept discomfort — chemicals,
            rashes, shame, silence — as if that were destiny. It is not."
          </p>

          {/* ✅ NEW TIMELINE SECTION */}
          <div className="space-y-6">
            {achievements.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 border-t border-gray-800 pt-4"
              >
                {/* Number */}
                <span className="text-gray-500 text-sm w-6">
                  {item.id}
                </span>

                {/* Icon */}
                <span className="text-lg">{item.icon}</span>

                {/* Content */}
                <div>
                  <h3 className="font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 mt-5 md:grid-cols-2 lg:grid-cols-4">
    
    {storyData.map((item, index) => (
      <div
        key={index}
        className="p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-gray-800"
      >
        {/* Title */}
        <p className="text-xs tracking-[0.25em] text-gray-400 uppercase mb-6">
          {item.title}
        </p>

        {/* Text */}
        <p className="text-gray-300 leading-relaxed">
          {item.text}
        </p>
      </div>
    ))}

  </div>
    </section>

</>
  );
};

export default FounderSection;
