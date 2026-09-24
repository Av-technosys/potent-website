"use client";

import Image from "next/image";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { getBlogs } from "@/helper/blog/action";

export default function JournalsSection({
  themeColor,
}: {
  themeColor?: any;
}) {
  const [articles, setArticles] = useState<any>([]);

  useEffect(() => {
    const fetchJournals = async () => {
      const allBlogs = await getBlogs();
      setArticles(allBlogs?.slice(0, 3) || []);
    };

    fetchJournals();
  }, []);

  return (
    <section className="w-full  py-20">
      <div className=" mx-auto ">
        {/* Header */}
        <div className="text-center mb-14">
          <h2
            className="text-4xl font-semibold mb-4"
            style={{ color: themeColor || "#111827" }}
          >
            Journals
          </h2>
          <p className="text-gray-600 text-base">
            Tips, guides, and insights for your menstrual health journey.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((item: any, index: number) => (
            <div key={index} className="group">
              {/* Image */}
              <div className="relative w-full h-80 rounded-2xl overflow-hidden">
                <Image
                  src={item?.image}
                  alt="Journal"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition duration-500"
                />

                {/* Category Badge */}
                <span
                  className="absolute top-4 left-4 text-white text-xs px-3 py-1 rounded-full"
                  style={{ backgroundColor: themeColor.darkColor || "#a855f7" }}
                >
                  Wellness
                </span>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <Calendar
                  className="w-4 h-4"
                  style={{ color: themeColor.darkColor || "#0d9488" }}
                />
                <span>{item?.date}</span>
              </div>

              {/* Title */}
              <h3 className="mt-3 text-lg font-semibold text-gray-900 leading-snug">
                {item?.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                {item?.metaDescription}
              </p>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-center mt-16">
          <button
            className="px-8 py-3 border-2  rounded-full transition duration-300 "
            style={{
              borderColor: themeColor.darkColor || "#0d9488",
              color: themeColor.darkColor || "#0d9488",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = themeColor.lightColor || "#0d9488";
              e.currentTarget.style.color = themeColor.darkColor || "#0d9488";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = themeColor.darkColor || "#0d9488";
            }}
          >
            View All Articles
          </button>
        </div>
      </div>
    </section>
  );
}
