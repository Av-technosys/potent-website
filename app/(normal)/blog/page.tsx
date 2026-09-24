import BlogHeader from "@/app/components/common/BlogHeader";
import Footer from "@/app/components/common/Footer";
import BlogListClient from "./BlogListClient"; // Aapka client component
import { getBlogs } from "@/helper/blog/action";
import { Suspense } from "react";
import Loading from "../../loading";

export default async function BlogPage() {
  // Database se live blogs fetch kar rahe hain
  const allBlogs = await getBlogs();

  return (
    <div className="min-h-screen bg-[#FDFCF9]">
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12 py-24 text-center">
          <h1 className="mb-4 text-2xl font-bold text-[#333333] md:text-5xl">
            Our Journal Hygiene Knowledge Hub
          </h1>
          <p className="mx-auto max-w-2xl text-black/50">
            Learn, understand, and make healthier wellness choices
          </p>
        </div>

        {/* Aapka pura purana UI logic BlogListClient ke andar hai */}
        {/* Humne bas database wala data props mein bhej diya hai */}
        <Suspense fallback={<Loading />}>
          <BlogListClient initialBlogs={allBlogs} />
        </Suspense>
      </main>
    </div>
  );
}
