"use client";

import Image from "next/image";

export default function AboutHero({ themeColor }: { themeColor?: any }) {
  return (
    <section
      className="w-full py-20"
      style={{
        backgroundColor: themeColor ? `${themeColor.darkColor}20` : "#ffffff",
      }}
    >
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        {/* LEFT SIDE - IMAGE DESIGN */}
        <div className="relative flex flex-1 justify-center lg:justify-start">
          <Image
            src="/abouthero.png" // replace with your uploaded image
            alt="Product Showcase"
            width={700}
            height={400}
            className="object-contain"
            priority
          />
        </div>

        {/* RIGHT SIDE - TEXT CONTENT */}
        <div className="space-y-6">
          {/* Small Label */}
          <Image
            src="/sustain.png" // replace with your uploaded image
            alt="Product Showcase"
            width={150}
            height={40}
            className="object-cover"
            priority
          />

          {/* Heading */}
          <h2 className="text-4xl lg:text-5xl font-semibold leading-tight text-gray-900">
            Empowering Hygiene for{" "}
            <span className="text-teal-600">Everyone & Everywhere</span>
          </h2>

          {/* Paragraph */}
          <div className="space-y-4 text-gray-600 text-base leading-relaxed">
            <p>
              At Potent Hygiene, we believe hygiene is for all. Our inclusive
              range of thoughtfully designed products supports the unique needs
              of women, men, kids, families, and seniors.
            </p>

            <p>
              Whether it's menstrual care, travel essentials, or daily hygiene,
              we create innovative solutions that prioritize comfort,
              confidence, and sustainability. Together, let's redefine hygiene
              to empower lives and protect the planet one product, one choice at
              a time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
