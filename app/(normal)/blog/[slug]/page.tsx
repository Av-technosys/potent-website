import { getBlogBySlug } from "@/helper/blog/action";
import Image from "next/image";
import { getImageUrl } from "@/lib/imageUrl";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { notFound } from "next/navigation";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) return notFound();

  const imageAlt = blog.title || "Blog Post Details";

  return (
    <div className=" min-h-screen pb-12">

      <div className="max-w-3xl mx-auto pt-16 pb-10 px-6 relative">
        <Link
          href="/blog"
          className="absolute hover:bg-primary/10 left-0 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-all p-2"
        >
          <IconArrowLeft size={24} stroke={1.5} />
        </Link>

        <h1 className="text-3xl md:text-3xl font-bold text-[#1a1a1a] leading-tight px-10 py-10">
          {blog.title}
        </h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 ">
        <div className=" mb-10space-y-8">
          <div className="flex items-center gap-3 text-sm text-neutral-500 font-medium border-b border-neutral-50 pb-6">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={blog.userImage || "/author-placeholder.jpg"}
                alt={blog.userName || "Author"}
              />
              <AvatarFallback>{blog.userName?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-black font-semibold">{blog.userName}</span>
              <span>|</span>
              <span>{blog.date}</span>
              <span>|</span>
              <span>{blog.blogCategory}</span>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-neutral-100 group">
            <Image
              src={getImageUrl(blog.image || "/placeholder.jpg")}
              alt={blog.title || "Blog Image"}
              width={600}
              height={400}
              className={`w-full object-contain h-auto`}
              unoptimized
            />
          </div>

          <article className="prose prose-neutral max-w-none text-[#4a4a4a]">
            <div
              className="whitespace-pre-line leading-relaxed text-[17px]"
              dangerouslySetInnerHTML={{ __html: blog.data || '' }}
            />
          </article>
        </div>
      </div>
    </div>
  );
}
