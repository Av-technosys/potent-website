import React from "react";
import { IconTargetArrow, IconEye } from "@tabler/icons-react";

const Vision = () => {
  return (
    <section className="container bg-white py-16">
      <div className="">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold text-neutral-800 sm:text-4xl">
            Our Mission & Vision
          </h2>
          <p className="mt-3 text-sm text-neutral-600 sm:text-base">
            Guiding principles that drive everything we do
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#169bb2] bg-cyan-50 p-6">
            <div className="mb-6 w-fit rounded-xl bg-[#016271] p-4 text-white">
              <IconTargetArrow size={28} />
            </div>

            <h3 className="mb-4 text-2xl font-bold text-neutral-800">
              Our Mission
            </h3>

            <p className="text-base leading-relaxed text-neutral-700">
              To provide clean, rash-free, eco-friendly menstrual hygiene
              products that prioritize women's health, comfort, and confidence.
            </p>
          </div>

          <div className="rounded-2xl border border-[#d97706] bg-orange-50 p-6">
            <div className="mb-6 w-fit rounded-xl bg-[#d97706] p-4 text-white">
              <IconEye size={28} />
            </div>

            <h3 className="mb-4 text-2xl font-bold text-neutral-800">
              Our Vision
            </h3>

            <p className="text-base leading-relaxed text-neutral-700">
              To build a healthier, more confident menstrual world where every
              woman has access to safe, sustainable, and comfortable hygiene
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vision;
