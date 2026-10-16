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

  const matchYatraCandidate = (itemKey: YatraKitItemKey, candidates: typeof rows) => {
    if (!candidates || candidates.length === 0) return null;

    return (
      candidates.find((row) => {
        const name = (row.variantName || "").toLowerCase();
        const sku = (row.sku || "").toLowerCase();
        const target = `${name} ${sku}`;

        switch (itemKey) {
          case "seat:p4":
            return target.includes("4-pack") || target.includes("4 pack") || target.includes("p4") || target.includes("100");
          case "seat:p2":
          case "seat":
            return target.includes("2-pack") || target.includes("2 pack") || target.includes("p2") || target.includes("50");
          case "pp:20":
            return target.includes("20") || target.includes("p20");
          case "pp:10":
          case "pp":
            return (target.includes("10") || target.includes("p10")) && !target.includes("20");
          case "pads:xlp":
            return target.includes("xl+") || target.includes("xlplus") || target.includes("xl-plus") || target.includes("xlp") || target.includes("320");
          case "pads:xl":
            return (
              (target.includes("xl") || target.includes("280")) &&
              !target.includes("xl+") &&
              !target.includes("xlplus") &&
              !target.includes("xl-plus") &&
              !target.includes("xlp") &&
              !target.includes("320")
            );
          case "pads:l":
            return (
              (target.includes("240") || target.includes("regular") || /\bl\b/.test(name) || sku.endsWith("-l") || sku.includes("-l-")) &&
              !target.includes("xl")
            );
          case "liner:80":
            return target.includes("80");
          case "liner:60":
            return target.includes("60");
          case "liner:40":
          case "liner":
            return target.includes("40");
          case "cup:xs":
          case "cup":
            return target.includes("teen") || target.includes("xs") || target.includes("pink") || target.includes("small");
          case "cup:m":
            return target.includes("medium") || target.includes("purple") || target.includes("-m");
          case "cup:l":
            return target.includes("large") || target.includes("white") || target.includes("-l");
          case "panty:lxl":
            return target.includes("m-xl") || target.includes("mxl") || target.includes("l-xl") || target.includes("lxl") || target.includes("l/xl");
          case "panty:xxl3xl":
            return target.includes("xxl") || target.includes("3xl");
          case "funnel":
            return target.includes("1") || target.includes("p1") || target.includes("funnel");
          default:
            return false;
        }
      }) || null
    );
  };

  return Object.fromEntries(
    Object.entries(YATRA_ITEM_LOOKUP).map(([key, lookup]) => {
      const itemKey = key as YatraKitItemKey;
      const candidates = bySlug[lookup.slug] || [];
      const matched = matchYatraCandidate(itemKey, candidates);

      const fallbackPrice =
        key === "pads:xlp"
          ? 379
          : key === "pads:xl"
            ? 349
            : key === "pads:l"
              ? 319
              : key === "seat:p4"
                ? 699
                : key.startsWith("seat")
                  ? 399
                  : key === "pp:20"
                    ? 899
                    : key.startsWith("pp")
                      ? 499
                      : key === "liner:80"
                        ? 419
                        : key === "liner:60"
                          ? 339
                          : key.startsWith("liner")
                            ? 249
                            : key.startsWith("cup")
                              ? 399
                              : 299;

      const fallbackVariantName =
        itemKey === "seat:p4"
          ? "4-Pack (100 covers)"
          : itemKey.startsWith("seat")
            ? "2-Pack (50 covers)"
            : itemKey === "pp:20"
              ? "Pack of 20"
              : itemKey.startsWith("pp")
                ? "Pack of 10"
                : itemKey === "pads:xlp"
                  ? "XL+ (320mm)"
                  : itemKey === "pads:xl"
                    ? "XL (280mm)"
                    : itemKey === "pads:l"
                      ? "L (240mm)"
                      : itemKey === "liner:80"
                        ? "Pack of 80"
                        : itemKey === "liner:60"
                          ? "Pack of 60"
                          : itemKey.startsWith("liner")
                            ? "Pack of 40"
                            : itemKey === "cup:m"
                              ? "Medium (Purple)"
                              : itemKey === "cup:l"
                                ? "Large (White)"
                                : itemKey.startsWith("cup")
                                  ? "Teen (XS Pink)"
                                  : itemKey === "funnel"
                                    ? "Pack of 1"
                                    : lookup.label;

      const primaryRow = candidates[0];

      return [
        key,
        {
          key: itemKey,
          productId: matched?.productId || primaryRow?.productId || `${lookup.slug}-prod`,
          productVariantId: matched?.productVariantId || (candidates.length === 1 ? primaryRow?.productVariantId : undefined) || `${lookup.slug}-${itemKey.replace(":", "-")}-var`,
          slug: matched?.productSlug || primaryRow?.productSlug || lookup.slug,
          title: matched?.productName || primaryRow?.productName || lookup.label,
          variantName: matched?.variantName || fallbackVariantName,
          sku: matched?.sku || `LOOWAY-${itemKey.toUpperCase().replace(":", "-")}`,
          image: getImageUrl(matched?.variantImage || matched?.productImage || primaryRow?.variantImage || primaryRow?.productImage || "/product.png"),
          price: Number(matched?.price || fallbackPrice),
          unit: lookup.unit,
        } satisfies YatraMappedProduct,
      ];
    }),
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
