import React from "react";
import Image from "next/image";

const RoshniSection = () => {
  const initiatives = [
    {
      icon: "🎓",
      title: "Menstrual Hygiene Education",
      desc: "Workshops breaking stigma and providing accurate health knowledge to underserved communities.",
    },
    {
      icon: "🔥",
      title: "Sanitary Incinerator Installation",
      desc: "Safe, hygienic disposal systems protecting health and reducing environmental contamination.",
    },
    {
      icon: "🌍",
      title: "Community Outreach Across Bharat",
      desc: "Sessions in schools, hospitals, and communities — normalising menstrual health conversations.",
    },
  ];

  const stats = [
    {
      icon: "🔥",
      value: "1st",
      label: "Hygiene incinerator installed",
    },
    {
      icon: "🎓",
      value: "100%",
      label: "Shame-free workshops",
    },
    {
      icon: "🌍",
      value: "50K+",
      label: "Women reached",
    },
    {
      icon: "💗",
      value: "∞",
      label: "Commitment to impact",
    },
  ];

  return (
    <section className="bg-[#f3efe6] py-16 px-4 md:px-10 lg:px-20">
      {/* HEADER */}
      <div className="mb-10 flex items-center justify-start gap-6">
         <div className="bg-white rounded-2xl p-4 shadow-sm">
      <Image
        src="/roshniBanner.jpeg" // replace with your logo
        alt="Roshni NGO"
        width={80}
        height={80}
        className="w-20 h-20 object-contain"
      />
    </div>
        
       <div>
         <p className="text-xs tracking-[0.3em] text-yellow-700 uppercase mb-3">
          Social Impact Arm
        </p>

        <h2 className="text-3xl md:text-5xl font-serif text-gray-900 leading-tight">
          Roshni <span className="italic text-yellow-700">Manav Utthaan</span> Sansthaan
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Reg. No. 580/JAIPUR/1997-98 ·  Gokul Vatika, Durgapura, Jaipur 302018
        </p>

        <p className="text-yellow-700 mt-2 font-medium">
          रोशनी से राह, सशक्त समाज की चाह।
        </p>
       </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* LEFT CONTENT */}
        <div>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Roshni Manav Utthaan Sansthaan</strong> is a registered NGO delivering
            menstrual hygiene education and awareness into India’s most underserved communities —
            without judgment, without agenda, and without expectation.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Divita Agarwal serves as <span className="italic text-yellow-700">Vice President</span>,
            driving initiatives across Rajasthan, reaching women in rural areas, schools,
            and health centres.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Because <span className="italic text-yellow-700">knowledge is the first form of dignity</span>.
          </p>

          {/* INITIATIVES */}
          <div className="space-y-4">
            {initiatives.map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="bg-[#f7e8d5] rounded-2xl p-6 text-center border border-yellow-200">
          <div className="flex justify-center gap-6 mb-6">
            <div className="text-sm">
              <p>Learner</p>
            </div>
            <div className="text-sm">
               <p>Empowered</p>
            </div>
            <div className="text-sm">
              <p>Connected</p>
            </div>
          </div>

          {/* IMAGES */}
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/roshni1.jpeg"
              alt="image"
              width={240}
              height={128}
              className="rounded-lg object-cover h-32 w-full"
            />
            <Image
              src="/roshni2.jpeg"
              alt="image"
              width={240}
              height={128}
              className="rounded-lg object-cover h-32 w-full"
            />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-sm"
          >
            <div className="text-xl mb-2">{item.icon}</div>
            <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            <p className="text-sm text-gray-600 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

    </section>
  );
};

export default RoshniSection;
