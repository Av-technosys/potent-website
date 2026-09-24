"use client";

import React from "react";
import {
  IconShieldCheck,
  IconDropletPlus,
  IconHeart,
  IconRecycle,
  IconShield,
  IconLeaf,
} from "@tabler/icons-react";

const features = [
  {
    icon: IconShieldCheck,
    title: "Safer than traditional products with no harmful chemicals",
  },
  {
    icon: IconDropletPlus,
    title: "Superior absorption performance for heavy flow days",
  },
  {
    icon: IconHeart,
    title: "No irritation, no discomfort, no rashes",
  },
  {
    icon: IconRecycle,
    title: "Better for the environment, better for your body",
  },
  {
    icon: IconShield,
    title: "Customer approved and research - backed quality",
  },
  {
    icon: IconLeaf,
    title: "Designed by women, for women",
  },
];

const WhyChooseSection = () => {
  return (
    <section className="container py-12 md:py-16">
      <div className="">


        <div className="text-center mb-8 md:mb-12 space-y-2">
          <h2 className="text-2xl md:text-4xl font-semibold text-foreground tracking-tight">
            Why Choose Potent Hygiene?
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Here's what makes us different from the rest
          </p>
        </div>


        <div className="grid gap-4 md:gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="flex items-center gap-4 rounded-2xl bg-white border border-border shadow-sm p-4"
              >

                <div className="shrink-0 flex items-center justify-center rounded-2xl bg-linear-to-r from-cyan-600 to-cyan-300 text-white p-3 md:p-4">
                  <Icon className="h-6 w-6 md:h-7 md:w-7" stroke={1.8} />
                </div>


                <p className="text-base text-muted-foreground leading-relaxed font-medium">
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseSection;