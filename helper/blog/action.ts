/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { blog } from "@/db/schema";
import { db } from "@/lib/db";
import { getImageKey } from "@/lib/imageUrl";

import { and, desc, eq, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function normalizeBlog(blogData: typeof blog.$inferSelect) {
  return {
    ...blogData,
    date: blogData.createdAt?.toISOString().split("T")[0] ?? "",
    userImage: blogData.authorImage,
    userName: blogData.authorName,
    isVisible: blogData.isPublished,
  };
}

export async function getBlogs(search = "") {
  const filters = [];
  if (search && search.trim() !== "") {
    filters.push(
      or(
        ilike(blog.title, `%${search}%`), 
        ilike(blog.metaDescription, `%${search}%`)
      )
    );
  }

  const whereClause = filters.length ? and(...filters) : undefined;

  try {
    const result = await db
      .select()
      .from(blog)
      .where(whereClause)
      .orderBy(desc(blog.createdAt));

    return result.map(normalizeBlog);
  } catch (error) {
    console.error("Fetch Blogs Error:", error);
    return [];
  }
}

const FALLBACK_BLOG_MAP: Record<string, any> = {
  "why-choose-sanitary-pads-instead-of-cloth-during-periods": {
    title: "Why choose sanitary pads instead of cloth during periods?",
    blogCategory: "SANITARY PADS",
    date: "19 Aug 2026",
    userName: "Potent Editorial Team",
    userImage: "/author-placeholder.jpg",
    image: "/placeholder.jpg",
    metaDescription: "Discover why modern organic sanitary pads provide better protection, hygiene, and comfort compared to traditional cloth pads during your period.",
    data: `<p className="mb-4">Using sanitary pads during periods offers significant advantages over traditional cloth pads in terms of hygiene, convenience, and health. Modern organic sanitary pads are engineered with high-absorbency cores, leak guards, and breathable organic top sheets that keep you clean, dry, and rash-free throughout your cycle.</p><p className="mb-4">Traditional cloth, if not washed and dried thoroughly under direct sunlight, can harbor bacteria and moisture that increase the risk of skin infections and UTIs. Switching to dermatologically tested, organic sanitary pads ensures proper hygiene, maximum leak protection, and hassle-free comfort during work, travel, and sleep.</p>`,
  },
  "protection-and-womens-hygiene": {
    title: "Protection and women's hygiene",
    blogCategory: "PROTECTION",
    date: "19 Aug 2026",
    userName: "Potent Editorial Team",
    userImage: "/author-placeholder.jpg",
    image: "/placeholder.jpg",
    metaDescription: "Essential guidelines on intimate hygiene, choosing safe personal care products, and staying confident during travel and daily routine.",
    data: `<p className="mb-4">Feminine hygiene is an essential part of overall health and well-being. Using skin-friendly, pH-balanced, and dermatologically certified hygiene products protects intimate skin from irritation, discomfort, and infections.</p><p className="mb-4">Whether navigating daily work routines or traveling long distances, keeping reliable hygiene products like flushable seat covers, organic pads, and intimate wipes in your bag ensures complete protection and peace of mind wherever you go.</p>`,
  },
  "skin-pimples-causes-prevention-and-simple-care-tips": {
    title: "Skin pimples: causes, prevention and simple care tips",
    blogCategory: "SKIN",
    date: "19 Aug 2026",
    userName: "Potent Editorial Team",
    userImage: "/author-placeholder.jpg",
    image: "/placeholder.jpg",
    metaDescription: "Understanding hormonal skin changes during your menstrual cycle, causes of period breakouts, and easy daily skincare tips.",
    data: `<p className="mb-4">Hormonal fluctuations during the menstrual cycle often cause skin breakouts, increased sebum production, and acne. Understanding your cycle's effect on your skin allows you to take proactive, gentle care of your skin.</p><p className="mb-4">Maintain a simple skincare routine with a gentle, non-comedogenic cleanser, stay well-hydrated, change pillowcases regularly, and avoid harsh scrubbing during peak breakout days to keep your skin healthy and glowing.</p>`,
  },
  "periods-power-productivity-how-managing-menstrual-health-can-skyrocket-your-efficiency": {
    title: "Periods, power, productivity: managing menstrual health at work",
    blogCategory: "AT WORK",
    date: "19 Aug 2026",
    userName: "Potent Editorial Team",
    userImage: "/author-placeholder.jpg",
    image: "/placeholder.jpg",
    metaDescription: "How to manage period symptoms at the workplace, maintain energy levels, and stay productive throughout your cycle.",
    data: `<p className="mb-4">Managing period symptoms while maintaining high workplace productivity doesn't have to be overwhelming. Aligning your workload with your cycle phases, staying hydrated, and using ultra-absorbent organic period care products allows you to focus on your day without worry.</p><p className="mb-4">Keep a dedicated period care pouch at your desk, take short movement breaks to relieve cramps, and prioritize rest during heavy flow days to sustain high performance and well-being.</p>`,
  },
};

export async function getBlogBySlug(slug: string) {
  try {
    const result = await db
      .select()
      .from(blog)
      .where(eq(blog.slug, slug))
      .limit(1);

    if (result[0]) {
      return normalizeBlog(result[0]);
    }

    if (FALLBACK_BLOG_MAP[slug]) {
      return FALLBACK_BLOG_MAP[slug];
    }

    return null;
  } catch (error) {
    console.error("Fetch Blog By Slug Error:", error);
    return FALLBACK_BLOG_MAP[slug] || null;
  }
}

export async function createBlog(blogData: any) {
  try {
    const slug = blogData.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    await db.insert(blog).values({
      title: blogData.title,
      metaDescription: blogData.metaDescription,
      blogCategory: blogData.blogCategory,
      image: getImageKey(blogData.image),
      authorImage: getImageKey(blogData.userImage),
      authorName: blogData.userName,
      data: blogData.data, 
      slug: slug,
      tags: Array.isArray(blogData.tags) 
        ? blogData.tags 
        : (blogData.tags ? blogData.tags.split(',').map((t: string) => t.trim()) : []),
      isPublished: true,
    });
    revalidatePath("/admin/blog");
    revalidatePath("/blog"); 
    
    return { success: true };
  } catch (error: any) {
    console.error("Create Blog Error:", error);
    return { success: false, message: error.message };
  }
}
export async function updateBlog(blogId: string, blogData: any) {
  try {
    const slug = blogData.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    await db
      .update(blog)
      .set({
        title: blogData.title,
        metaDescription: blogData.metaDescription,
        blogCategory: blogData.blogCategory,
        image: getImageKey(blogData.image),
        authorImage: getImageKey(blogData.userImage),
        authorName: blogData.userName,
        data: blogData.data,
        slug: slug,
        tags: Array.isArray(blogData.tags) 
          ? blogData.tags 
          : (blogData.tags ? blogData.tags.split(',').map((t: string) => t.trim()) : []),
      })
      .where(eq(blog.id, blogId));

    revalidatePath("/admin/blog");
    revalidatePath(`/blog/${slug}`); 
    return { success: true };
  } catch (error) {
    console.error("Update Blog Error:", error);
    return { success: false };
  }
}

export async function deleteBlog(id: string) {
  try {
    await db.delete(blog).where(eq(blog.id, id));
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.error("Delete Blog Error:", error);
    return { success: false };
  }
}
export async function getBlogById(id: string) {
  try {
    const result = await db
      .select()
      .from(blog)
      .where(eq(blog.id, id))
      .limit(1);
    
    return result[0] ? normalizeBlog(result[0]) : null;
  } catch (error) {
    console.error("Fetch Blog By ID Error:", error);
    return null;
  }
}
