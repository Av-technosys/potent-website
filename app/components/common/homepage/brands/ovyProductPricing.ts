export type OvyVariant = {
  id?: string;
  _id?: string;
  sku?: string;
  name?: string;
  size?: string;
  color?: string;
  flowType?: string;
  price?: number | string;
  bannerImage?: string;
  image?: string;
};

export function getOvyVariants(product: any): OvyVariant[] {
  return (
    product?.productVariants ||
    product?.prodcutVarientBoxRes ||
    product?.variants ||
    []
  );
}

export function findOvyVariant(
  product: any,
  label: string,
  fallbackIndex = 0,
): OvyVariant | undefined {
  const variants = getOvyVariants(product);
  if (!label || variants.length === 0) return variants[fallbackIndex] || variants[0];

  const clean = (s: string) => s.trim().toLowerCase();
  const target = clean(label);

  // 1. Priority matching for XL+ and XL
  if (target === "xl+" || target === "xl plus" || target === "xlp") {
    const xlpMatch = variants.find((v) => {
      const size = clean(v.size || "");
      const sku = clean(v.sku || "");
      const name = clean(v.name || "");
      const flow = clean(v.flowType || "");
      return (
        size.includes("xl+") ||
        size.includes("320") ||
        sku.includes("xlp") ||
        name.includes("xl+") ||
        flow.includes("super heavy") ||
        flow.includes("overnight")
      );
    });
    if (xlpMatch) return xlpMatch;
  }

  if (target === "xl") {
    const xlMatch = variants.find((v) => {
      const size = clean(v.size || "");
      const sku = clean(v.sku || "");
      const name = clean(v.name || "");
      const isXlPlus =
        size.includes("xl+") ||
        size.includes("320") ||
        sku.includes("xlp") ||
        name.includes("xl+");
      if (isXlPlus) return false;

      return (
        size.startsWith("xl ") ||
        size === "xl" ||
        size.includes("280") ||
        sku.includes("-xl-") ||
        sku.endsWith("-xl") ||
        name.includes(" xl ")
      );
    });
    if (xlMatch) return xlMatch;
  }

  // 2. Direct exact match on size or sku (case-insensitive)
  const directMatch = variants.find((v) => {
    const size = clean(v.size || "");
    const sku = clean(v.sku || "");
    return (
      size === target ||
      sku === target ||
      size.startsWith(`${target} `) ||
      size.startsWith(`${target}(`) ||
      sku.endsWith(`-${target}`)
    );
  });
  if (directMatch) return directMatch;

  // 3. Normalized token match with '+' preserved as 'plus'
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/\+/g, " plus ")
      .replace(/\bxlp\b/g, "xl plus")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const normalizedLabel = normalize(label);
  const labelTokens = normalizedLabel
    .split(" ")
    .filter((token) => token.length > 0);

  const matchingVariants = variants.filter((variant) => {
    const searchable = normalize(
      [
        variant.name,
        variant.size,
        variant.color,
        variant.flowType,
        variant.sku,
      ]
        .filter(Boolean)
        .join(" "),
    );

    return labelTokens.every((token) => {
      const regex = new RegExp(`(^|\\s)${token}(\\s|$)`);
      return regex.test(searchable) || searchable.includes(token);
    });
  });

  if (matchingVariants.length === 1) {
    return matchingVariants[0];
  }

  if (matchingVariants.length > 1) {
    if (!normalizedLabel.includes("plus")) {
      const withoutPlus = matchingVariants.find((v) => {
        const s = normalize([v.name, v.size, v.sku].filter(Boolean).join(" "));
        return !s.includes("plus");
      });
      if (withoutPlus) return withoutPlus;
    } else {
      const withPlus = matchingVariants.find((v) => {
        const s = normalize([v.name, v.size, v.sku].filter(Boolean).join(" "));
        return s.includes("plus");
      });
      if (withPlus) return withPlus;
    }
    return matchingVariants[0];
  }

  return variants[fallbackIndex] || variants[0];
}

export function getOvyVariantPrice(variant?: OvyVariant) {
  const price = Number(variant?.price);
  return Number.isFinite(price) && price > 0 ? price : 0;
}

export function getOvyVariantLabel(variant?: OvyVariant) {
  return (
    variant?.name ||
    [variant?.size, variant?.color].filter(Boolean).join(", ") ||
    variant?.sku ||
    "Variant"
  );
}

export function getOvyVariantId(variant?: OvyVariant) {
  return variant?.id || variant?._id;
}

export function getOvyProductId(product: any) {
  return product?.id || product?._id;
}
