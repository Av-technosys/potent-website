import { unstable_cache } from "next/cache";
import { asc, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { category, product } from "@/db/schema";

export type CatalogCategory = {
  id: string;
  name: string | null;
  slug: string;
  bannerImage: string | null;
  description: string | null;
  priority: number | null;
  updatedAt: Date | null;
};

export type CatalogProduct = {
  id: string;
  name: string | null;
  slug: string;
  description: string | null;
  startingPrice: string | null;
  bannerImage: string | null;
  brand: "ovy" | "loway" | null;
  categoryId: string | null;
  categories: string[];
  category: CatalogCategory | null;
  hasVarientBox: boolean | null;
  isMixBox: boolean | null;
  image: string | null;
  priority: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

async function queryCatalogProducts() {
  const rows = await db
    .select({
      product,
      category,
    })
    .from(product)
    .leftJoin(category, eq(product.categoryId, category.id))
    .orderBy(
      desc(product.priority),
      asc(product.name),
    );

  return rows.map((row) => ({
    ...row.product,
    category: row.category,
    categoryId: row.product.categoryId,
    categories: row.category?.id
      ? [row.category.id]
      : row.product.categoryId
        ? [row.product.categoryId]
        : [],
    hasVarientBox: row.product.isMixBox,
    isMixBox: row.product.isMixBox,
    image: row.product.bannerImage,
  }));
}

async function queryCatalogCategories() {
  return db
    .select()
    .from(category)
    .orderBy(desc(category.priority), asc(category.name));
}

export const getCachedCatalogProducts = unstable_cache(
  queryCatalogProducts,
  ["catalog-products-with-categories-v4-priority-desc-no-variants-starting-price"],
  {
    tags: ["catalog-products", "products", "categories"],
    revalidate: 60 * 60 * 24,
  },
);

export const getCachedCatalogCategories = unstable_cache(
  queryCatalogCategories,
  ["catalog-categories-v2-priority-desc"],
  {
    tags: ["catalog-categories", "categories"],
    revalidate: 60 * 60 * 24,
  },
);
