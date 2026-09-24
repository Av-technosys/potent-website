// components/sections/blog-section.tsx

import Image from "next/image";
import { getImageUrl } from "@/lib/imageUrl";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getBlogs } from "@/helper/blog/action";

export async function BlogSection() {
  const allBlogs = await getBlogs();

  const articles = allBlogs?.slice(0, 3) || [];

  return (
    <section className="py-16 bg-[#F8F6F1]">
      <div className="container mx-auto px-6 md:px-16">
        {/* Heading */}
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-[#333]">
            Hygiene & Wellness Hub
          </h2>

          <p className="text-sm text-gray-500">
            Tips, guides, and insights for your menstrual health journey.
          </p>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article: any, index: number) => (
            <Link
              key={article.id || `${article.slug}-${index}`}
              href={`/blog/${article.slug}`}
            >
              <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300">
                {/* Image */}
                <div className="relative w-full h-auto  overflow-hidden">
                  <Image
                    src={getImageUrl(article?.image)}
                    alt={article?.title || "Blog Post"}
                    width={300}
                    height={300}
                    className="object-cover w-full h-auto object-center group-hover:scale-105 transition duration-500"
                  />

                  {/* Category */}
                  {article.blogCategory && (
                    <span className="absolute top-4 left-4 bg-[#1A8D91] text-white text-[10px] px-3 py-1 rounded-full font-semibold">
                      {article.blogCategory}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {article.date || "Recent"}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-gray-900 leading-snug group-hover:text-[#1A8D91] transition">
                    {article.title || "Untitled Blog"}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {article.metaDescription ||
                      "Read more about this article..."}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-center pt-14">
          <Link href="/blog">
            <Button
              variant="outline"
              className="rounded-full border-2 border-[#1A8D91] text-[#1A8D91] px-10 py-6 hover:bg-[#1A8D91] hover:text-white"
            >
              View All Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
// credial
