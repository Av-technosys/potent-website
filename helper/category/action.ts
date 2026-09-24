// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/lib/db";

import slugify from "slugify";
//import path from "path";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { revalidatePath, unstable_cache } from "next/cache";
import { generateUniqueSlug } from "../slug/generateUniqueSlug";
import { and, asc, ilike, sql } from "drizzle-orm";
import { paginate } from "@/lib/pagination";
import { category, product, productVariant } from "@/db/schema";
import { getImageKey } from "@/lib/imageUrl";


interface GetCategoriesOptions {
  page?: number;
  pageSize?: any;
  search?: string;
  category: any;
}
export async function createCategory(categoryData: any) {
  try {
    const { name, description, parentId, bannerImage } = categoryData;
    const slug = await generateUniqueSlug(db, name, category.slug);
    await db.insert(category).values({
      name,
      slug,
      description,
      bannerImage: getImageKey(bannerImage) || null,
    });

    revalidatePath("/admin/category");
    return { success: true, message: "Category created successfully" };
  } catch (error) {
    console.error("Create category failed:", error);
    return { success: false, message: "Failed to create category" };
  }
  redirect("/admin/category");
}

export async function updateCategory(categoryData: any) {
  try {
    const { id, name, description, parentId, bannerImage } =
      categoryData;

    await db
      .update(category)
      .set({
        name,
        slug: slugify(name, { lower: true }),
        description,
        bannerImage: getImageKey(bannerImage) || null,

      })
      .where(eq(category.id, id));

    revalidatePath("/admin/category");
    revalidatePath(`/admin/category/${id}`);
    return { success: true, message: "Category updated successfully" };
  } catch (error) {
    console.error("Update category failed:", error);
    return { success: false, message: "Failed to update category" };
  }
  redirect("/admin/category");
}

export const attachProductCategory = async (
  productId: string,
  categoryId: string,
) => {
  try {
    return { success: true };
  } catch (error) {
    console.error("attach Product Category failed:", error);
    throw new Error("attach Product Category failed");
  }
};

export async function getProductCategory(productId: string) {
  try {
    return [];
  } catch (error) {
    console.error("fetch product category failed:", error);
    throw new Error("fetch product category failed");
  }
}
export async function updateProductCategory(
  productId: string,
  categoryId: string,
) {
  try {
    return { success: true };
  } catch (error) {
    console.error("Update product category failed:", error);
    throw new Error("Failed to update category");
  }
}

export async function getCategoriesPagination({
  page = 1,
  pageSize = 10,
  search = "",
  category: categorySlug,
}: GetCategoriesOptions) {
  const filters = [];

  if (search.trim() !== "") {
    filters.push(ilike(category.name, `%${search}%`));
  }

  if (categorySlug) {
    filters.push(eq(category.slug, categorySlug));
  }

  const whereClause = filters.length ? and(...filters) : undefined;

  const result = await paginate({
    table: category,
    page,
    pageSize,
    where: whereClause,
    // orderBy: desc(category.createdAt),
  });

  return {
    items: result.data,
    totalPages: result.meta.totalPages,
    page: result.meta.page,
  };
}
export async function deleteCategory(id: string) {
  try {
    await db.delete(category).where(eq(category.id, id));

    revalidatePath("/admin/category");

    return {
      success: true,
      message: "Category deleted successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Something went wrong while deleting category",
    };
  }
}
export async function getCategories() {
  try {
    return await db.select().from(category).orderBy(desc(category.priority))
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getCashedCategory() {
  return unstable_cache(getCategories, ['categories'], {
    tags: ["categories"],
    revalidate: 60 * 60 * 24
  })
}

export async function getAllProductsByCategorySlug(slug: string) {
  try {
    return [];
  } catch (error) {
    console.error("fetch products by category failed:", error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const result = await db
      .select()
      .from(category)
      .where(eq(category.slug, slug))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("fetch category by slug failed:", error);
    return null;
  }
}

export async function getAllCategoriesMeta() {
  try {
    return await db
      .select({
        id: category.id,
        name: category.name,
      })
      .from(category);
  } catch (error) {
    console.error(error);
    return [];
  }
}
