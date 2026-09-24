import { NextResponse } from "next/server";

import { getCachedCatalogCategories } from "@/lib/catalog";

export async function GET() {
  try {
    const categories = await getCachedCatalogCategories();

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Catalog categories API error:", error);
    return NextResponse.json(
      { error: "Unable to fetch catalog categories" },
      { status: 500 },
    );
  }
}
