// These icons match the Shield, Recycle/Leaf, Globe, and Heart in your image
import { ShieldCheck, Leaf, Globe, Heart } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  bgColor?: string;
};

const features = [
  {
    title: "100% safe & Tested",
    description:
      "Dermatologically tested products that meet the highest safety standards for your peace of mind.",
    icon: <ShieldCheck className="w-6 h-6 text-white" />,
  },
  {
    title: "Eco-Friendly Packaging",
    description:
      "Biodegradable and recyclable packaging designed to minimize environmental impact.",
    icon: <Leaf className="w-6 h-6 text-white" />,
  },
  {
    title: "Sustainable Hygiene Solutions",
    description:
      "Eco-friendly materials and packaging that care for you and the planet we call home.",
    icon: <Globe className="w-6 h-6 text-white" />,
  },
  {
    title: "Designed for Sensitive Skin",
    description:
      "Soft, breathable layers designed specifically for sensitive skin to prevent irritation.",
    icon: <Heart className="w-6 h-6 text-white" />,
  },
];

export function BrandWhyChoose({
  title,
  subtitle = "",
  bgColor = "#FFF5F7",
}: Props) {
  return (
    <section
      className="py-16 text-center overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-full mx-auto px-6 md:px-6">
        {/* HEADER SECTION */}
        <div className="mb-12 md:mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#333333]">
            {title}
          </h2>
          <p className="max-w-2xl mx-auto text-base text-gray-500 leading-relaxed font-light">
            {subtitle}
          </p>
        </div>

        {/* CAROUSEL */}
        <div className=" max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mx-auto w-full">
          {features.map((feature, i) => (
            <div key={i} className=" w-full">
              <div className="bg-white  p-4 rounded-md shadow-sm border border-pink-50 h-full flex flex-col items-start text-left">
                <div className="mb-2 flex gap-3 ">
                  <div className=" shring-0 w-fit h-fit aspect-square p-4 rounded-lg bg-linear-to-br from-[#C3A6C8] to-[#9B7BA3] flex items-center justify-center shadow-md">
                    {feature.icon}
                  </div>

                  <h3 className="text-lg  font-roboto font-semibold text-[#1A1A1A] mb-4 leading-tight">
                    {feature.title}
                  </h3>
                </div>

                <p className="text-[14px]  text-gray-500 leading-relaxed font-medium opacity-80">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
