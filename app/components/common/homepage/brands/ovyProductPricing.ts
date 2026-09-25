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
  const normalizedLabel = label.toLowerCase().replace(/[^a-z0-9]+/g, " ");
  const match = variants.find((variant) => {
    const searchable = [
      variant.name,
      variant.size,
      variant.color,
      variant.flowType,
      variant.sku,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ");

    return normalizedLabel
      .split(" ")
      .filter((token) => token.length > 1)
      .every((token) => searchable.includes(token));
  });

  return match || variants[fallbackIndex] || variants[0];
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
