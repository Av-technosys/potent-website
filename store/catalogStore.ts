"use client";

import { create } from "zustand";

export type CatalogCategory = {
  id: string;
  name?: string | null;
  slug?: string | null;
  bannerImage?: string | null;
  description?: string | null;
  priority?: number | null;
  redirectSlug :string;
};

export type CatalogProduct = {
  id: string;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  startingPrice?: string | null;
  bannerImage?: string | null;
  image?: string | null;
  brand?: "ovy" | "loway" | string | null;
  categoryId?: string | null;
  category?: CatalogCategory | null;
  categories?: string[];
  hasVarientBox?: boolean | null;
  isMixBox?: boolean | null;
  priority?: number | null;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
};

type CatalogStatus = "idle" | "loading" | "ready" | "error";

type CatalogState = {
  products: CatalogProduct[];
  categories: CatalogCategory[];
  status: CatalogStatus;
  error: string | null;
  fetchedAt: number | null;
  setProducts: (products: CatalogProduct[]) => void;
  setCategories: (categories: CatalogCategory[]) => void;
  setCatalog: (catalog: {
    products?: CatalogProduct[];
    categories?: CatalogCategory[];
  }) => void;
  fetchCatalog: (force?: boolean) => Promise<void>;
  getProductsByBrand: (brand: string) => CatalogProduct[];
  getProductsByCategory: (categoryId: string) => CatalogProduct[];
};

let catalogRequest: Promise<void> | null = null;

export const useCatalogStore = create<CatalogState>((set, get) => ({
  products: [],
  categories: [],
  status: "idle",
  error: null,
  fetchedAt: null,

  setProducts: (products) =>
    set((state) => ({
      products,
      status: state.categories.length ? "ready" : state.status,
      error: null,
      fetchedAt: Date.now(),
    })),

  setCategories: (categories) =>
    set((state) => ({
      categories,
      status: state.products.length ? "ready" : state.status,
      error: null,
      fetchedAt: Date.now(),
    })),

  setCatalog: ({ products, categories }) =>
    set((state) => ({
      products: products ?? state.products,
      categories: categories ?? state.categories,
      status: "ready",
      error: null,
      fetchedAt: Date.now(),
    })),

  fetchCatalog: async (force = false) => {
    const current = get();

    if (!force && current.status === "ready") return;
    if (!force && catalogRequest) return catalogRequest;

    catalogRequest = (async () => {
      set({ status: "loading", error: null });

      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch("/api/catalog/products"),
          fetch("/api/catalog/categories"),
        ]);

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Unable to load catalog");
        }

        const [productsPayload, categoriesPayload] = await Promise.all([
          productsResponse.json(),
          categoriesResponse.json(),
        ]);

        set({
          products: productsPayload.products ?? [],
          categories: categoriesPayload.categories ?? [],
          status: "ready",
          error: null,
          fetchedAt: Date.now(),
        });
      } catch (error) {
        set({
          status: "error",
          error:
            error instanceof Error ? error.message : "Unable to load catalog",
        });
      } finally {
        catalogRequest = null;
      }
    })();

    return catalogRequest;
  },

  getProductsByBrand: (brand) =>
    get().products.filter((product) => product.brand === brand),

  getProductsByCategory: (categoryId) =>
    get().products.filter((product) =>
      (product.categories ?? []).includes(categoryId),
    ),
}));
