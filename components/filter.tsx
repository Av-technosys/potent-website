"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useUpdateQuery = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const updateQuery = useCallback(
    (key: string, value?: string) => {
      const currentParam = searchParams.get(key) ?? "";
      const trimmedValue = value?.trim() ?? "";

      // If the parameter is unchanged (e.g. empty to empty on initial mount), do nothing!
      if (currentParam === trimmedValue) {
        return;
      }

      // If neither has a value, do nothing!
      if (!currentParam && !trimmedValue) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());

      if (trimmedValue) {
        params.set(key, trimmedValue);
      } else {
        params.delete(key);
      }

      // If changing a search or filter, reset page to 1
      if (params.has("page") || trimmedValue) {
        params.set("page", "1");
      }

      const nextQuery = params.toString();
      const currentQuery = searchParams.toString();
      if (nextQuery === currentQuery) return;

      const targetUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
      router.push(targetUrl);
    },
    [pathname, router, searchParams],
  );

  return updateQuery;
};
