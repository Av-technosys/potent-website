"use client";

import { useEffect } from "react";

import { useCatalogStore } from "@/store/catalogStore";

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const fetchCatalog = useCatalogStore((state) => state.fetchCatalog);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  return <>{children}</>;
}
