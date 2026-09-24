"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/imageUrl";
import { IconArrowRight } from "@tabler/icons-react";

const categories = [
  "All Articles",
  "Period care",
  "Sustainability",
  "Product Knowledge",
  "Hygiene Basics",
  "Wellness Tips",
];

export default function BlogListClient({
  initialBlogs,
}: {
  initialBlogs: any[];
}) {
  const [activeCategory, setActiveCategory] = useState("All Articles");

  const filteredBlogs =
    activeCategory === "All Articles"
      ? initialBlogs
      : initialBlogs.filter((b) => b.blogCategory === activeCategory);

  const getPreviewText = (html: string, limit: number) => {
    if (!html) return "";
    const cleanText = html.replace(/<\/?[^>]+(>|$)/g, "");
    return cleanText.length > limit
      ? cleanText.substring(0, limit) + "..."
      : cleanText;
  };

  if (!initialBlogs || initialBlogs.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed bg-gray-50 py-20 text-center text-gray-400">
        No blogs available yet.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl py-10 md:px-4">
      {/* <div className="flex gap-3 overflow-x-auto whitespace-nowrap no-scrollbar  mb-10 sm:flex-wrap sm:justify-center">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setActiveCategory(item)}
            className={`shrink-0 px-5 py-2 rounded-full border text-sm transition font-medium ${activeCategory === item
              ? "bg-[#016271] text-white border-[#016271]"
              : "bg-white text-[#016271] border-[#016271] hover:bg-teal-50"
              }`}
          >
            {item}
          </button>
        ))}
      </div> */}

      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {filteredBlogs.map((blog, index) => {
            const isFeatured = index === 0;

            return (
              <div
                key={blog.slug || index}
                className={`flex h-full flex-col overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:shadow-lg ${
                  isFeatured ? "md:col-span-2" : "col-span-1"
                }`}
              >
                {/* Image Wrapper - Parent must be relative and have a height */}
                <div
                  className={`relative w-full overflow-hidden rounded-t-2xl bg-neutral-100 ${
                    isFeatured ? "h-72 md:h-[300px]" : "h-auto"
                  }`}
                >
                  <Image
                    src={getImageUrl(blog.image || "/placeholder.jpg")}
                    alt={blog.title}
                    width={600}
                    height={400}
                    className="h-auto w-full object-contain transition-transform duration-500 hover:scale-105"
                    priority={isFeatured} // Featured card ko fast load karne ke liye
                    unoptimized
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h2
                    className={`mb-3 leading-tight font-bold text-gray-900 ${
                      isFeatured
                        ? "text-2xl md:text-3xl"
                        : "line-clamp-2 text-lg"
                    }`}
                  >
                    {blog.title}
                  </h2>

                  <p className="mb-6 text-sm leading-relaxed text-neutral-500">
                    {isFeatured
                      ? getPreviewText(blog.data || blog.metaDescription, 180)
                      : getPreviewText(blog.data || blog.metaDescription, 90)}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4 text-xs font-medium text-neutral-400">
                    <span>{blog.date}</span>
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="flex items-center gap-1 font-bold text-[#016271] transition-all hover:gap-2"
                    >
                      Read More <IconArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center font-medium text-neutral-500">
          No articles found in this category.
        </div>
      )}
    </div>
  );
}
