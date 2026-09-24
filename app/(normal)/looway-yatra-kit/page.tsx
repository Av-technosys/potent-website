import { inArray } from "drizzle-orm";
import YatraKitPageClient from "@/app/components/common/yatra/YatraKitPageClient";
import { loowayYatraKit } from "@/const/productsContent";
import { getImageUrl } from "@/lib/imageUrl";
import {
  YATRA_ITEM_LOOKUP,
  type YatraKitItemKey,
  type YatraMappedProduct,
} from "@/lib/yatraKit";
import { db } from "@/src/db";
import { product, productVariant } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function getYatraMappedProducts() {
  const slugs = [...new Set(Object.values(YATRA_ITEM_LOOKUP).map((item) => item.slug))];

  const rows = await db
    .select({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      productImage: product.bannerImage,
      productVariantId: productVariant.id,
      variantName: productVariant.name,
      variantImage: productVariant.bannerImage,
      sku: productVariant.sku,
      price: productVariant.price,
    })
    .from(product)
    .leftJoin(productVariant, eq(productVariant.productId, product.id))
    .where(inArray(product.slug, slugs));

  const bySlug = rows.reduce<Record<string, typeof rows>>((acc, row) => {
    acc[row.productSlug] ||= [];
    acc[row.productSlug].push(row);
    return acc;
  }, {});

  return Object.fromEntries(
    Object.entries(YATRA_ITEM_LOOKUP).map(([key, lookup]) => {
      const itemKey = key as YatraKitItemKey;
      const candidates = bySlug[lookup.slug] || [];
      const variant =
        candidates.find((row) =>
          row.variantName?.toLowerCase().includes(lookup.variantHint.toLowerCase()),
        ) ||
        candidates.find((row) => row.productVariantId) ||
        null;

      if (!variant?.productVariantId) return [key, null];

      return [
        key,
        {
          key: itemKey,
          productId: variant.productId,
          productVariantId: variant.productVariantId,
          slug: variant.productSlug,
          title: variant.productName || lookup.label,
          variantName: variant.variantName || lookup.label,
          sku: variant.sku || "",
          image: getImageUrl(variant.variantImage || variant.productImage || "/product.png"),
          price: Number(variant.price || 0),
          unit: lookup.unit,
        } satisfies YatraMappedProduct,
      ];
    }).filter(([, value]) => Boolean(value)),
  ) as Partial<Record<YatraKitItemKey, YatraMappedProduct>>;
}

export default async function LoowayYatraKitPage() {
  const mappedProducts = await getYatraMappedProducts();

  return (
    <YatraKitPageClient
      content={loowayYatraKit}
      mappedProducts={mappedProducts}
    />
  );
}
