import Image from "next/image";
import React from "react";

const AboutPage = () => {
  return (
    <section className="">

      <div className=" container py-12 xl:py-16 text-center">
        <h2 className="text-2xl sm:text-3xl xl:text-4xl font-semibold text-gray-900 mb-6">
          About Potent Hygiene
        </h2>

        <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-7xl mx-auto">
          Potent Hygiene was built to make feminine care safer, sustainable, and more comfortable.
          We believe every woman deserves access to hygiene products that prioritize her health,
          comfort, and the planet&apos;s well-being.
        </p>

        <p className="mt-5 text-sm sm:text-base text-gray-600 leading-relaxed max-w-7xl mx-auto">
          Our products are thoughtfully designed with care, backed by research, and crafted to empower
          women to live confidently through every phase of their menstrual cycle.
        </p>
      </div>


      <section className="w-full bg-[#eaf1f8] py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 xl:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 items-center gap-8 xl:gap-12">


            <div className="w-full overflow-hidden rounded-2xl">
              <Image
                src="/about.png"
                alt="About Potent Hygiene"
                width={900}
                height={650}
                priority
                className="w-full h-auto object-cover"
              />
            </div>


            <div className="space-y-4 sm:space-y-5">
              <h2 className="text-3xl sm:text-4xl xl:text-5xl md:text-left text-center font-bold text-cyan-700 leading-tight">
                How It All Started
              </h2>

              <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
                The journey of Potent Hygiene began with a simple yet powerful
                realization: women deserve better. For too long, the menstrual
                hygiene market has been dominated by products that prioritize
                profit over safety, convenience over comfort, and mass production
                over sustainability.
              </p>

              <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
                Our founders, driven by personal experiences and conversations
                with countless women, identified critical gaps in the industry —
                products causing rashes, discomfort, and environmental harm.
                This sparked a mission to create a brand that truly understands
                and addresses women&apos;s needs.
              </p>


              <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
                Today, Potent Hygiene stands as a trusted partner for thousands
                of women across India, and we&apos;re just getting started.
              </p>
            </div>

          </div>
        </div>
      </section>
    </section>
  );
};

export default AboutPage; 7