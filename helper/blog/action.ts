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

export async function getBlogBySlug(slug: string) {
  try {
    const result = await db
      .select()
      .from(blog)
      .where(eq(blog.slug, slug))
      .limit(1);
    
    return result[0] ? normalizeBlog(result[0]) : null;
  } catch (error) {
    console.error("Fetch Blog By Slug Error:", error);
    return null;
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
