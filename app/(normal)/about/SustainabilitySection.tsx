import React from "react";
import { IconTarget, IconEye } from "@tabler/icons-react";

const SustainabilitySection = () => {
  return (
    <section className="container bg-white py-16">
      <div className="">


        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-semibold text-neutral-900">
            Sustainability & Responsibility Section
          </h2>
          <p className="text-base sm:text-lg text-neutral-600">
            Guiding principles that drive everything we do
          </p>
        </div>


        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">


          <div className="rounded-2xl border border-green-500 bg-green-50 p-6">
            <div className="inline-flex rounded-2xl bg-green-600 p-4 text-white">
              <IconTarget className="h-7 w-7" />
            </div>

            <h3 className="mt-6 text-2xl font-semibold text-neutral-900">
              Eco-Friendly Materials
            </h3>

            <p className="mt-4 text-base text-neutral-700 leading-relaxed">
              We use 98% biodegradable materials in our products, including
              organic cotton, bamboo fiber, and plant-based polymers. Our
              packaging is 100% recyclable and made from post-consumer recycled
              materials.
            </p>

            <ul className="mt-5 list-disc pl-5 space-y-1 text-neutral-800">
              <li>Organic cotton top sheet</li>
              <li>Biodegradable absorbent core</li>
              <li>Plant-based adhesive</li>
            </ul>
          </div>


          <div className="rounded-2xl border border-blue-500 bg-blue-50 p-6">
            <div className="inline-flex rounded-2xl bg-blue-600 p-4 text-white">
              <IconEye className="h-7 w-7" />
            </div>

            <h3 className="mt-6 text-2xl font-semibold text-neutral-900">
              Our Vision
            </h3>

            <p className="mt-4 text-base text-neutral-700 leading-relaxed">
              We partner with certified suppliers who share our commitment to
              ethical and sustainable practices. Every material is traceable,
              ensuring transparency from source to product.
            </p>

            <ul className="mt-5 list-disc pl-5 space-y-1 text-neutral-800">
              <li>Fair trade certified suppliers</li>
              <li>Carbon-neutral manufacturing</li>
              <li>Zero-waste production goals</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SustainabilitySection;