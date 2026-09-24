// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/lib/db";

import { revalidatePath, revalidateTag } from "next/cache";
import { and, asc, desc, eq, gte, ilike, inArray, lte, ne, sql } from "drizzle-orm";
import { generateUniqueSlug } from "../slug/generateUniqueSlug";

import {
  category,
  product,
  productFaq,
  productMedia,
  productVariant,
} from "@/db/schema";

function deduplicateProducts(rows: any[]) {
  const seen = new Set();
  return rows.filter((row) => {
    if (seen.has(row.id)) return false;
    seen.add(row.id);
    return true;
  });
}
import { getImageKey } from "@/lib/imageUrl";
import { bestSellingSlug, isUUID } from "@/const/globalconst";

interface GetProductsOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  type?: string;
  material?: string;
  size?: string;
  flow?: string;
  cramps?: string;
  allergies?: string;
  min?: any;
  max?: any;
  stock?: any;
  brand?: any;
}

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
}

function num(fd: FormData, key: string) {
  const v = Number(fd.get(key));
  return isNaN(v) ? 0 : v;
}

function parseMedia(fd: FormData) {
  return fd.getAll("media").filter((v) => typeof v === "string") as string[];
}

function buildVariantRows(payload: any, productId: string) {
  const productVariants = Array.isArray(payload.productVariants)
    ? payload.productVariants
    : [];

  if (productVariants.length > 0) {
    const rows = productVariants
      .map((variant: any, index: number) => ({
        productId,
        sku: String(variant.sku || "").trim(),
        name: String(variant.name || "").trim(),
        price: Number(variant.price) || 0,
        strikethroughPrice:
          variant.strikethroughPrice === "" ||
          variant.strikethroughPrice === null ||
          variant.strikethroughPrice === undefined
            ? null
            : Number(variant.strikethroughPrice),
        boxQuantity:
          variant.boxQuantity === "" ||
          variant.boxQuantity === null ||
          variant.boxQuantity === undefined
            ? null
            : Number(variant.boxQuantity),
        priority: Number(variant.priority ?? index),
        bannerImage: getImageKey(variant.bannerImage || variant.image) || null,
        flowType: String(variant.flowType || "").trim() || null,
        isInStock:
          variant.isInStock !== undefined ? Boolean(variant.isInStock) : true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
      .filter((variant: any) => variant.name && variant.sku);

    if (rows.length > 0) return rows;
  }

  const variantBoxes = Array.isArray(payload.VarientBoxes)
    ? payload.VarientBoxes
    : [];

  if (variantBoxes.length > 0) {
    return variantBoxes.map((variant: any, index: number) => ({
      productId,
      sku:
        variant.sku ||
        `${payload.sku}-${(variant.name || `variant-${index + 1}`)
          .replace(/\s+/g, "-")
          .toUpperCase()}`,
      name: variant.name || payload.name,
      price: Number(variant.price || payload.price) || 0,
      strikethroughPrice: variant.strikethroughPrice
        ? Number(variant.strikethroughPrice)
        : payload.strikethroughPrice
          ? Number(payload.strikethroughPrice)
          : null,
      boxQuantity: variant.boxQuantity ? Number(variant.boxQuantity) : null,
      priority: Number(variant.priority ?? index),
      bannerImage:
        getImageKey(variant.bannerImage || variant.image || payload.bannerImage) ||
        null,
      flowType: variant.flowType || payload.flowType?.[0] || null,
      isInStock:
        variant.isInStock !== undefined
          ? variant.isInStock
          : payload.isInStock !== undefined
            ? payload.isInStock
            : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }

  return [
    {
      productId,
      sku: payload.sku,
      name: payload.name,
      price: Number(payload.price) || 0,
      strikethroughPrice: payload.strikethroughPrice
        ? Number(payload.strikethroughPrice)
        : null,
      boxQuantity: payload.boxQuantity ? Number(payload.boxQuantity) : null,
      priority: 0,
      bannerImage: getImageKey(payload.bannerImage) || null,
      flowType: payload.flowType?.[0] || null,
      isInStock:
        payload.isInStock !== undefined ? payload.isInStock : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}

async function replaceVariantMedia(tx: any, variantIds: string[], payload: any) {
  if (variantIds.length > 0) {
    await tx
      .delete(productMedia)
      .where(inArray(productMedia.productVariantId, variantIds));
  }

  const productMediaRows = Array.isArray(payload.productMedia)
    ? payload.productMedia
        .map((item: any) => {
          const variantIndex = Number(item.variantIndex) || 0;
          const productVariantId = variantIds[variantIndex];
          const mediaURL = getImageKey(item.mediaURL || item.url || "");

          if (!productVariantId || !mediaURL) return null;

          return {
            productVariantId,
            mediaType: String(item.mediaType || "image").trim() || "image",
            mediaURL,
          };
        })
        .filter(Boolean)
    : [];

  if (productMediaRows.length > 0) {
    await tx.insert(productMedia).values(productMediaRows);
    return;
  }

  const media = Array.isArray(payload.media)
    ? payload.media
    : Array.isArray(payload.gallery)
      ? payload.gallery
      : [];

  if (!media.length || !variantIds[0]) return;

  await tx.insert(productMedia).values(
    media.map((item: any) => ({
      productVariantId: variantIds[0],
      mediaType: "image",
      mediaURL: getImageKey(item.preview ?? item.key ?? item),
    })),
  );
}

async function replaceProductFaqs(tx: any, productId: string, payload: any) {
  const faqs = Array.isArray(payload.faqs) ? payload.faqs : [];
  const rows = faqs
    .map((faq: any, index: number) => ({
      productId,
      priority: Number(faq.priority ?? index),
      question: String(faq.question || "").trim(),
      answer: String(faq.answer || "").trim(),
    }))
    .filter((faq: any) => faq.question && faq.answer);

  await tx.delete(productFaq).where(eq(productFaq.productId, productId));

  if (rows.length) {
    await tx.insert(productFaq).values(rows);
  }
}

interface VariantInput {
  name: string;
  sku: string;
  description?: string;
  shortDescription?: string;
  price: number;
  strikethroughPrice?: number;
  bannerImage?: string;
  media?: string[];
  isInStock: boolean;
  isReturnable: boolean;
  isCancelable: boolean;
  isReplacement: boolean;
  returnDays: number;
  highlights: string[];
  replacementDays: number;
  attributes: { attribute: string; value: string }[];
  subscriptionPlans?: number[];
}

// export async function createProduct(formData: FormData) {
//   try {
//     // const categoryIds = [
//     //   ...new Set(formData.getAll("category[]").filter(Boolean)),
//     // ] as string[];
//     // const variantsData = str(formData, "variants");
//     // if (!variantsData) throw new Error("No variants provided");
//     // const variants: VariantInput[] = JSON.parse(variantsData);
//     // const productId = await db.transaction(async (tx) => {
//     //   // 1. Create the parent product
//     //   const [createdProduct] = await tx
//     //     .insert(product)
//     //     .values({})
//     //     .returning({ id: product.id });
//     //   const pId = createdProduct.id;
//     //   // 2. Attach categories to the parent product
//     //   if (categoryIds.length) {
//     //     await tx.insert(productCategory).values(
//     //       categoryIds.map((catId) => ({
//     //         productId: pId,
//     //         categoryId: catId,
//     //       })),
//     //     );
//     //   }
//     //   const slugs = await Promise.all(
//     //     variants.map((v) =>
//     //       generateUniqueSlug(tx, v.name, product.slug)
//     //     )
//     //   );
//     //   const variantInsertData = variants.map((v, index) => ({
//     //     productId: pId,
//     //     name: v.name,
//     //     slug: slugs[index],
//     //     sku: v.sku,
//     //     description: v.description,
//     //     shortDescription: v.shortDescription,
//     //     basePrice: v.price,
//     //     strikethroughPrice: v.strikethroughPrice,
//     //     bannerImage: v.bannerImage || null,
//     //     isInStock: v.isInStock,
//     //     isReturnable: v.isReturnable,
//     //     isCancelable: v.isCancelable,
//     //     isReplacement: v.isReplacement,
//     //     returnDays: v.returnDays,
//     //     highlights: v.highlights || [],
//     //     replacementDays: v.replacementDays,
//     //     rating: 0,
//     //     reviewCount: 0,
//     //   }));
//     //   const insertedVariants = await tx
//     //     .insert(product)
//     //     .values(variantInsertData)
//     //     .returning({ id: product.id });
//     //   const allMediaRows: {
//     //     productId: string;
//     //     mediaType: string;
//     //     mediaURL: string;
//     //   }[] = [];
//     //   const allAttributeRows: {
//     //     productId: string;
//     //     attribute: string;
//     //     value: string;
//     //   }[] = [];
//     //   const allSubscriptionRows: {
//     //     productId: string;
//     //     subscriptionPlanId: number;
//     //   }[] = [];
//     //   for (let i = 0; i < variants.length; i++) {
//     //     const variantId = insertedVariants[i].id;
//     //     const v = variants[i];
//     //     // Media
//     //     if (v.media?.length) {
//     //       for (const url of v.media) {
//     //         allMediaRows.push({
//     //           productId: variantId,
//     //           mediaType: "image",
//     //           mediaURL: url,
//     //         });
//     //       }
//     //     }
//     //     // Attributes
//     //     if (v.attributes?.length) {
//     //       for (const attr of v.attributes) {
//     //         allAttributeRows.push({
//     //           productId: variantId,
//     //           attribute: attr.attribute,
//     //           value: attr.value,
//     //         });
//     //       }
//     //     }
//     //     // Subscriptions
//     //     if (v.subscriptionPlans?.length) {
//     //       for (const planId of v.subscriptionPlans) {
//     //         allSubscriptionRows.push({
//     //           productId: variantId,
//     //           subscriptionPlanId: planId
//     //         });
//     //       }
//     //     }
//     //   }
//     //   if (allMediaRows.length) {
//     //     await tx.insert(productMedia).values(allMediaRows);
//     //   }
//     //   if (allAttributeRows.length) {
//     //     await tx.insert(productAttribute).values(allAttributeRows);
//     //   }
//     //   // if (allSubscriptionRows.length) {
//     //   //   await tx.insert(productVariantSubscriptionPlan).values(allSubscriptionRows);
//     //   // }
//     //   return pId;
//     // });
//     // return { id: productId };
//   } catch (error) {
//     console.error("createProduct failed:", error);
//     throw new Error("Unable to create product");
//   }
// }

export async function createProduct(formData: FormData): Promise<void> {
  try {
    const categoryId = formData
      .getAll("category[]")
      .find((value) => typeof value === "string") as string | undefined;
    const variantsData = str(formData, "variants");
    if (!variantsData) throw new Error("No variants provided");

    const variants: any = JSON.parse(variantsData);

    await db.transaction(async (tx) => {
      const slug = await generateUniqueSlug(tx, variants.name, product.slug);
      // 1. Create Product
      const [newProduct] = await tx
        .insert(product)
        .values({
          name: variants.name,
          brand: variants.brand,
          slug: slug,
          description: variants.description,
          startingPrice: String(variants.startingPrice || "").trim() || null,
          bannerImage: getImageKey(variants.bannerImage) || null,
          categoryId: categoryId || null,
          priority: Number(variants.priority) || 0,
          allowCycleSync: variants.allowCycleSync || false,
          allowSubscription: variants.allowSubscription || false,
          isMixBox: variants.hasVarientBox || variants.isMixBox || false,
          custimizeBoxInfo: variants.custimizeBoxInfo || null,
          subscribeMonthlyDiscount:
            Number(variants.subscribeMonthlyDiscount) || 0,
          subscribeBiMontlyDiscount:
            Number(variants.subscribeBiMontlyDiscount) || 0,
          cycleSyncDiscount: Number(variants.cycleSyncDiscount) || 0,
          maxQuantityPurchase: Number(variants.maxQuantityPurchase) || 6,
          freeShippingOver: Number(variants.freeShippingOver) || 599,
          highlights: variants.highlights || [],
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning({ id: product.id });

      const productId = newProduct.id;
      const insertedVariants = await tx
        .insert(productVariant)
        .values(buildVariantRows(variants, productId))
        .returning({ id: productVariant.id });

      await replaceVariantMedia(
        tx,
        insertedVariants.map((variant: any) => variant.id),
        variants,
      );

      await replaceProductFaqs(tx, productId, variants);
    });

    revalidatePath("/admin/product");
    revalidateTag("catalog-products");
  } catch (error) {
    console.error("createProduct failed:", error);
    throw new Error("Unable to create product");
  }
}

export async function updateProduct(formData: FormData): Promise<void> {
  try {
    const productId = formData.get("id") as string;
    if (!productId) throw new Error("Product ID missing");

    const categoryId = formData
      .getAll("category[]")
      .find((value) => typeof value === "string") as string | undefined;
    const variantsData = str(formData, "variants");
    if (!variantsData) throw new Error("No variants provided");

    const variants: any = JSON.parse(variantsData);

    await db.transaction(async (tx) => {
      await tx
        .update(product)
        .set({
          name: variants.name,
          brand: variants.brand,
          description: variants.description,
          startingPrice: String(variants.startingPrice || "").trim() || null,
          bannerImage: getImageKey(variants.bannerImage) || null,
          categoryId: categoryId || null,
          priority: Number(variants.priority) || 0,
          allowCycleSync: variants.allowCycleSync || false,
          allowSubscription: variants.allowSubscription || false,
          isMixBox: variants.hasVarientBox || variants.isMixBox || false,
          custimizeBoxInfo: variants.custimizeBoxInfo || null,
          subscribeMonthlyDiscount:
            Number(variants.subscribeMonthlyDiscount) || 0,
          subscribeBiMontlyDiscount:
            Number(variants.subscribeBiMontlyDiscount) || 0,
          cycleSyncDiscount: Number(variants.cycleSyncDiscount) || 0,
          maxQuantityPurchase: Number(variants.maxQuantityPurchase) || 6,
          freeShippingOver: Number(variants.freeShippingOver) || 599,
          highlights: variants.highlights || [],
          updatedAt: new Date(),
        })
        .where(eq(product.id, productId));

      const existingVariants = await tx
        .select({ id: productVariant.id })
        .from(productVariant)
        .where(eq(productVariant.productId, productId));

      await replaceVariantMedia(
        tx,
        existingVariants.map((variant: any) => variant.id),
        { media: [] },
      );

      await tx
        .delete(productVariant)
        .where(eq(productVariant.productId, productId));

      const insertedVariants = await tx
        .insert(productVariant)
        .values(buildVariantRows(variants, productId))
        .returning({ id: productVariant.id });

      await replaceVariantMedia(
        tx,
        insertedVariants.map((variant: any) => variant.id),
        variants,
      );

      await replaceProductFaqs(tx, productId, variants);

      // Update Subscriptions
      // await tx
      //   .delete(productVariantSubscriptionPlan)
      //   .where(eq(productVariantSubscriptionPlan.productId, vId!));
      // if (v.subscriptionPlans?.length) {
      //   await tx.insert(productVariantSubscriptionPlan).values(
      //     v.subscriptionPlans.map((planId) => ({
      //       productId: vId!,
      //       subscriptionPlanId: planId
      //     }))
      //   )
      // }
    });

    revalidatePath("/admin/product");
    revalidateTag("catalog-products");
  } catch (error) {
    console.error("updateProduct failed:", error);
    throw new Error("Unable to update product");
  }
}

export async function getFullProductDetails(identifier: string) {
  try {
    if (!identifier) throw new Error("Missing product identifier");

    // const isThroughId = isUUID(identifier);
    // if (!isThroughId) throw new Error("Invalid product identifier");

    const [productDeails] = await db
      .select()
      .from(product)
      .where(eq(product.slug, identifier))
      .limit(1);
    if (!productDeails) throw new Error("Product not found");

    const productVariantsRes = await db
      .select()
      .from(productVariant)
      .where(eq(productVariant.productId, productDeails.id))
      .orderBy(asc(productVariant.priority), asc(productVariant.name));

    const variantIds = productVariantsRes.map((variant) => variant.id);
    const productMediaRes = variantIds.length
      ? await db
          .select()
          .from(productMedia)
          .where(inArray(productMedia.productVariantId, variantIds))
      : [];
    const categoryRes = productDeails.categoryId
      ? await db
          .select({ categories: category })
          .from(category)
          .where(eq(category.id, productDeails.categoryId))
      : [];
    const productFaqRes = await db
      .select()
      .from(productFaq)
      .where(eq(productFaq.productId, productDeails.id))
      .orderBy(asc(productFaq.priority));

    return {
      ...productDeails,
      hasVarientBox: productDeails.isMixBox,
      prodcutVarientBoxRes: productVariantsRes,
      productVariants: productVariantsRes,
      categoryRes,
      productAttributeRes: [],
      productFaqRes,
      productMediaRes,
      filters: [],
    };
  } catch (error) {
    console.error("getFullProduct failed:", error);
    throw new Error("Unable to fetch product");
  }
}

export async function getFullProduct(identifier: string) {
  try {
    if (!identifier) throw new Error("Missing product identifier");

    const isThroughId = isUUID(identifier);
    if (!isThroughId) throw new Error("Invalid product identifier");

    const [productDeails] = await db
      .select()
      .from(product)
      .where(eq(product.id, identifier))
      .limit(1);
    if (!productDeails) throw new Error("Product not found");

    const productVariantsRes = await db
      .select()
      .from(productVariant)
      .where(eq(productVariant.productId, productDeails.id))
      .orderBy(asc(productVariant.priority), asc(productVariant.name));

    const variantIds = productVariantsRes.map((variant) => variant.id);
    const productMediaRes = variantIds.length
      ? await db
          .select()
          .from(productMedia)
          .where(inArray(productMedia.productVariantId, variantIds))
      : [];
    const categoryRes = productDeails.categoryId
      ? await db
          .select({ categories: category })
          .from(category)
          .where(eq(category.id, productDeails.categoryId))
      : [];
    const productFaqRes = await db
      .select()
      .from(productFaq)
      .where(eq(productFaq.productId, productDeails.id))
      .orderBy(asc(productFaq.priority));

    return {
      ...productDeails,
      hasVarientBox: productDeails.isMixBox,
      prodcutVarientBoxRes: productVariantsRes,
      productVariants: productVariantsRes,
      categoryRes,
      productAttributeRes: [],
      productFaqRes,
      productMediaRes,
      filters: [],
    };
  } catch (error) {
    console.error("getFullProduct failed:", error);
    throw new Error("Unable to fetch product");
  }
}

export async function getCategoryName(categoryId: any) {
  try {
    const categoryName = await db
      .select({ name: category.name })
      .from(category)
      .where(eq(category.id, categoryId))
      .limit(1);
    return categoryName[0].name;
  } catch (error) {
    console.error("getCategoryName failed:", error);
    throw new Error("Unable to fetch category name");
  }
}

export async function getProductSimilarProducts(slug: string | any) {
  try {
    const [v] = await db
      .select()
      .from(product)
      .where(eq(product.slug, slug))
      .limit(1);
    if (!v || !v.id) return [];

    const similarVariants = await db
      .select({
        id: product.id,
        name: product.name,
        slug: product.slug,
        startingPrice: product.startingPrice,
        basePrice: productVariant.price,
        bannerImage: product.bannerImage,
        hasVarientBox: product.isMixBox,
        strikethroughPrice: productVariant.strikethroughPrice,
        brand: product.brand,
      })
      .from(product)
      .leftJoin(productVariant, eq(product.id, productVariant.productId))
      .where(and(eq(product.brand, v.brand), ne(product.id, v.id)))
      .limit(30);

    return deduplicateProducts(similarVariants).slice(0, 10);
  } catch (error) {
    console.error("getProductSimilarProducts failed:", error);
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.transaction(async (tx) => {
      const variants = await tx
        .select({ id: productVariant.id })
        .from(productVariant)
        .where(eq(productVariant.productId, id));

      const variantIds = variants.map((variant) => variant.id);
      if (variantIds.length > 0) {
        await tx
          .delete(productMedia)
          .where(inArray(productMedia.productVariantId, variantIds));
      }

      await tx.delete(productVariant).where(eq(productVariant.productId, id));
      await tx.delete(product).where(eq(product.id, id));
    });

    revalidatePath("/admin/product");
    return {
      success: true,
      message: "Product and all variants deleted successfully",
    };
  } catch (error: any) {
    console.error("delete product failed:", error);
    throw new Error("Failed to delete product");
  }
}

export async function getProducts({
  page = 1,
  pageSize = 20,
  search = "",
  category: categorySlug,
  type = "",
  material = "",
  size = "",
  flow = "",
  cramps = "",
  allergies = "",
  min = "",
  max = "",
  stock = "",
  brand = "",
}: GetProductsOptions) {
  const filters = [];

  if (search.trim() !== "") {
    filters.push(ilike(product.name, `%${search}%`));
  }

  const offset = (page - 1) * pageSize;

  if (size) filters.push(eq(productVariant.size, size));
  if (flow) filters.push(eq(productVariant.flowType, flow));

  if (min && max) {
    filters.push(
      and(
        gte(productVariant.price, Number(min)),
        lte(productVariant.price, Number(max)),
      ),
    );
  } else if (min) {
    filters.push(gte(productVariant.price, Number(min)));
  } else if (max) {
    filters.push(lte(productVariant.price, Number(max)));
  }

  if (stock) {
    filters.push(eq(productVariant.isInStock, true));
  }

  if (brand) {
    filters.push(eq(product.brand, brand))
  }

  const whereClause = filters.length ? and(...filters) : undefined;

  const [items, total] = await Promise.all([
    db
      .select({
        id: product.id,
        name: product.name,
        slug: product.slug,
        hasVarientBox: product.isMixBox,
        startingPrice: product.startingPrice,
        basePrice: productVariant.price,
        strikethroughPrice: productVariant.strikethroughPrice,
        bannerImage: product.bannerImage,
        createdAt: product.createdAt,
      })
      .from(product)
      .leftJoin(productVariant, eq(product.id, productVariant.productId))
      .where(whereClause)
      .orderBy(desc(product.createdAt))
      .limit(pageSize * 10)
      .offset(offset),

    db
      .select({ count: sql<number>`count(distinct ${product.id})` })
      .from(product)
      .leftJoin(productVariant, eq(product.id, productVariant.productId))
      .where(whereClause),
  ]);

  const dedupedItems = deduplicateProducts(items).slice(0, pageSize);
  const totalPages = Math.ceil(total[0].count / pageSize);

  return {
    items: dedupedItems,
    totalPages,
    page,
  };
}

export async function getUserProduct() {
  try {
    const rows = await db
      .select({
        id: product.id,
        name: product.name,
        slug: product.slug,
        bannerImage: product.bannerImage,
        startingPrice: product.startingPrice,
        basePrice: productVariant.price,
        strikethroughPrice: productVariant.strikethroughPrice,
        createdAt: product.createdAt,
      })
      .from(product)
      .leftJoin(productVariant, eq(product.id, productVariant.productId))
      .orderBy(desc(product.createdAt));
    return deduplicateProducts(rows);
  } catch (error) {
    console.log(error)
  }
}
export async function getProductCategories() {
  return db
    .select({
      productId: product.id,
      categoryId: product.categoryId,
    })
    .from(product)
    .where(sql`${product.categoryId} is not null`);
}

// export async function getProductSimilarProducts(slug: string | any) {
//   try {
//     const v = await db.query.product.findFirst({
//       where: eq(product.slug, slug),
//     });
//     if (!v || !v.productId) return [];

//     const productWithCategory = await db
//       .select({ categoryId: productCategory.categoryId })
//       .from(productCategory)
//       .where(eq(productCategory.productId, v.productId));

//     if (!productWithCategory.length) return [];

//     const categoryId = productWithCategory[0].categoryId;

//     const similars = await db
//       .select({
//         id: product.id,
//         name: product.name,
//         slug: product.slug,
//         basePrice: product.basePrice,
//         bannerImage: product.bannerImage,
//         rating: product.rating,
//       })
//       .from(product)
//       .innerJoin(
//         productCategory,
//         eq(productCategory.productId, product.productId),
//       )
//       .where(
//         and(
//           eq(productCategory.categoryId, categoryId),
//           ne(product.productId, v.productId),
//         ),
//       )
//       .limit(10);

//     return similars;
//   } catch (error) {
//     console.error("getProductSimilarProducts failed:", error);
//   }
// }

export async function getProductsForCart(productIds: string[]) {
  try {
    if (!productIds || !productIds.length) return [];
    const safeIds = productIds.filter(Boolean);
    if (!safeIds.length) return [];

    const products = await db
      .select()
      .from(product)
      .where(inArray(product.id, safeIds));

    if (!products.length) return [];

    const variants = await db
      .select()
      .from(productVariant)
      .where(inArray(productVariant.productId, safeIds));

    const variantIds = variants.map((variant) => variant.id);
    const media = variantIds.length
      ? await db
      .select()
      .from(productMedia)
          .where(inArray(productMedia.productVariantId, variantIds))
      : [];

    const mediaMap = new Map<string, typeof media>();
    const variantProductMap = new Map(
      variants.map((variant) => [variant.id, variant.productId]),
    );
    for (const m of media) {
      if (!m.productVariantId) continue;
      const productId = variantProductMap.get(m.productVariantId);
      if (!productId) continue;
      if (!mediaMap.has(productId)) mediaMap.set(productId, []);
      mediaMap.get(productId)!.push(m);
    }

    return products.map((p) => ({
      ...p,
      variants: variants.filter((variant) => variant.productId === p.id),
      media: mediaMap.get(p.id) ?? [],
    }));
  } catch (error) {
    console.error("getProductsForCart failed:", error);
    return [];
  }
}

export async function saveProductAttributes(productId: string, payload: any) {
  // Deprecated in favor of nested  handling in updateProduct
  return { success: true };
}

export async function getProductsCount() {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(product);

    return result[0].count || 0;
  } catch (error) {
    console.error("getProductsCount failed:", error);
    return 0;
  }
}

export async function getBestSellingProducts() {
  try {
    const products = await db
      .select({
        id: product.id,
        name: product.name,
        price: productVariant.price,
        startingPrice: product.startingPrice,
        oldPrice: productVariant.strikethroughPrice,
        image: product.bannerImage,
        slug: product.slug,
      })
      .from(product)
      .leftJoin(productVariant, eq(product.id, productVariant.productId))
      .orderBy(desc(product.createdAt))
      .limit(20);

    return deduplicateProducts(products).slice(0, 4);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getBrandBestSellingProducts(slug: any) {
  try {
    const brandProducts = await db.select({
      id: product.id,
      name: product.name,
      price: productVariant.price,
      startingPrice: product.startingPrice,
      image: product.bannerImage,
      slug: product.slug,
      brand: product.brand,
      oldPrice: productVariant.strikethroughPrice
    }).from(product).leftJoin(productVariant, eq(product.id, productVariant.productId)).where(eq(product.brand, slug)).limit(20);
    return deduplicateProducts(brandProducts).slice(0, 4);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getBrandNewArrivalProducts(slug: any) {
  try {
    const brandProducts = await db.select({
      id: product.id,
      name: product.name,
      price: productVariant.price,
      startingPrice: product.startingPrice,
      image: product.bannerImage,
      slug: product.slug,
      brand: product.brand,
      oldPrice: productVariant.strikethroughPrice
    }).from(product).leftJoin(productVariant, eq(product.id, productVariant.productId)).where(eq(product.brand, slug)).orderBy(desc(product.createdAt)).limit(20);
    return deduplicateProducts(brandProducts).slice(0, 4);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getProductsByBrand(brand: "ovy" | "loway") {
  try {
    const brandProducts = await db
      .select({
        id: product.id,
        name: product.name,
        price: productVariant.price,
        startingPrice: product.startingPrice,
        oldPrice: productVariant.strikethroughPrice,
        image: product.bannerImage,
        slug: product.slug,
        brand: product.brand,
        hasVarientBox: product.isMixBox,
        createdAt: product.createdAt,
      })
      .from(product)
      .leftJoin(productVariant, eq(product.id, productVariant.productId))
      .where(eq(product.brand, brand))
      .orderBy(desc(product.createdAt))
      .limit(50);

    return deduplicateProducts(brandProducts);
  } catch (error) {
    console.error(error);
    return [];
  }
}



export async function getQuizSuggestedProducts(userAnswers: any) {
  try {
    const filters: string[] = userAnswers
      .map((a: any) => a.answer)
      .filter(Boolean);

    if (!filters.length) return [];

    const matchedVariants = await db
      .select({ productId: productVariant.productId })
      .from(productVariant)
      .where(
        sql`${productVariant.size} in (${sql.join(
          filters.map((f) => sql`${f}`),
          sql`,`,
        )}) or ${productVariant.flowType} in (${sql.join(
          filters.map((f) => sql`${f}`),
          sql`,`,
        )})`,
      );

    const productIds: any = [
      ...new Set(matchedVariants.map((f) => f.productId)),
    ];

    if (productIds.length === 0) return [];

    // Step 3: fetch products
    const products = await db
      .select()
      .from(product)
      .where(inArray(product.id, productIds));

    return products;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// export async function getBrandBestSellingProducts(slug:any){
//   try {
//     const brandProducts = await db.select({
//       id: product.id,
//       name: product.name,
//       price: product.basePrice,
//       image: product.bannerImage,
//       slug: product.slug,
//       brand: product.brand,
//       oldPrice: product.strikethroughPrice
//     }).from(product).where(eq(product.brand, slug)).limit(4);
//     return brandProducts
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }

// export async function getBrandNewArrivalProducts(slug:any){
//   try {
//     const brandProducts = await db.select({
//       id: product.id,
//       name: product.name,
//       price: product.basePrice,
//       image: product.bannerImage,
//       slug: product.slug,
//       brand: product.brand,
//       oldPrice: product.strikethroughPrice
//     }).from(product).where(eq(product.brand, slug)).orderBy(desc(product.createdAt)).limit(4);
//     return brandProducts
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }



// export async function getQuizSuggestedProducts(userAnswers:any){
//  try {
//   const filters:string[] = userAnswers.map((a: any) => a.answer);

//   // Step 1: find matching filters
//   const matchedFilters = await db
//     .select({ productId: productFilter.productId })
//     .from(productFilter)
//     .where(inArray(productFilter.filter, filters));

//   // Step 2: unique productIds
//   const productIds:any = [
//     ...new Set(matchedFilters.map((f) => f.productId)),
//   ];

//   if (productIds.length === 0) return [];

//   // Step 3: fetch products
//   const products = await db
//     .select()
//     .from(product)
//     .where(inArray(product.id, productIds));

//   return products;
// } catch (error) {
//   console.log(error);
//   return [];
// }
// }
