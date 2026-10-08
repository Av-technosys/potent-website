import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type WishlistVariant = {
  productVariantId: string;
  sku: string;
  name: string;
  size?: string;
  price: number;
  image: string;
  originalPrice?: number;
  flowType?: string;
};

export type WishlistItem = {
  productId: string;
  productVariantId: string;
  sku: string;
  title: string;
  name: string;
  slug?: string;
  image: string;
  basePrice: number;
  price: number;
  originalPrice?: number;
  variants: WishlistVariant[];
  hasVarientBox?: boolean;
};

type WishlistState = {
  items: WishlistItem[];
  setWishlist: (items: WishlistItem[]) => void;
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  totalItems: () => number;
};

type WishlistRecord = Record<string, unknown>;

const asRecord = (value: unknown): WishlistRecord =>
  value && typeof value === "object" ? (value as WishlistRecord) : {};

const toNumber = (...values: unknown[]) => {
  for (const value of values) {
    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }
  return 0;
};

export const normalizeWishlistVariant = (
  variant: unknown,
  productId: string,
  fallbackImage: string,
  index = 0,
): WishlistVariant => {
  const value = asRecord(variant);
  return {
    productVariantId: String(
      value.productVariantId || value.variantId || value.id || `${productId}-default-${index}`,
    ),
    sku: String(value.sku || `${productId}-default-${index}`),
    name: String(value.name || value.title || value.size || `Option ${index + 1}`),
    size: value.size ? String(value.size) : undefined,
    price: toNumber(value.price, value.discountPrice, value.basePrice),
    image: String(value.bannerImage || value.image || value.mediaURL || fallbackImage || "/product.png"),
    originalPrice:
      value.strikethroughPrice == null && value.mrp == null
        ? undefined
        : toNumber(value.strikethroughPrice, value.mrp),
    flowType: value.flowType ? String(value.flowType) : undefined,
  };
};

export const createWishlistItem = (product: unknown, selectedVariant?: unknown): WishlistItem => {
  const value = asRecord(product);
  const selectedValue = asRecord(selectedVariant);
  const productId = String(value.productId || value.id || value._id || "");
  const media = Array.isArray(value.productMediaRes) ? asRecord(value.productMediaRes[0]).mediaURL : undefined;
  const fallbackImage = String(
    value.bannerImage || value.image || media || "/product.png",
  );
  const sourceVariants = Array.isArray(value.variants)
    ? value.variants
    : Array.isArray(value.productVariants)
      ? value.productVariants
      : Array.isArray(value.prodcutVarientBoxRes)
        ? value.prodcutVarientBoxRes
        : [];
  const rawVariants = sourceVariants.length > 0 ? sourceVariants : [selectedVariant || product];
  const variants = rawVariants.map((variant, index: number) =>
    normalizeWishlistVariant(variant, productId, fallbackImage, index),
  );
  const selectedId = selectedValue.productVariantId || selectedValue.variantId || selectedValue.id;
  const selectedIndex = selectedId
    ? variants.findIndex((variant: WishlistVariant) => variant.productVariantId === String(selectedId))
    : 0;
  const selected = variants[selectedIndex >= 0 ? selectedIndex : 0] || normalizeWishlistVariant(product, productId, fallbackImage);
  const basePrice = toNumber(value.basePrice, value.startingPrice, value.price, selected.price);

  return {
    productId,
    productVariantId: selected.productVariantId,
    sku: selected.sku,
    title: String(value.title || value.name || selected.name || "Product"),
    name: String(value.name || value.title || "Product"),
    slug: value.slug ? String(value.slug) : undefined,
    image: selected.image || fallbackImage,
    basePrice,
    price: selected.price || basePrice,
    originalPrice: selected.originalPrice,
    variants,
    hasVarientBox: Boolean(value.hasVarientBox),
  };
};

export const normalizeWishlistItem = (item: unknown): WishlistItem => {
  const value = asRecord(item);
  return createWishlistItem(
    {
      ...value,
      id: value.productId,
      name: value.name || value.title,
      image: value.image,
      basePrice: value.basePrice ?? value.price,
      variants: value.variants,
    },
    value.productVariantId
      ? {
          id: value.productVariantId,
          sku: value.sku,
          name: value.title || value.name,
          price: value.price,
          image: value.image,
          strikethroughPrice: value.originalPrice,
        }
      : undefined,
  );
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      setWishlist: (items) => set({ items: items.map(normalizeWishlistItem) }),
      addItem: (item) =>
        set((state) => ({
          items: state.items.some((current) => current.productId === item.productId)
            ? state.items.map((current) =>
                current.productId === item.productId ? item : current,
              )
            : [...state.items, item],
        })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      totalItems: () => get().items.length,
    }),
    {
      name: "potent-wishlist",
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persistedState: unknown) => {
        const state = asRecord(persistedState);
        return {
          ...state,
          items: Array.isArray(state.items)
            ? state.items.map(normalizeWishlistItem)
            : [],
        };
      },
    },
  ),
);
