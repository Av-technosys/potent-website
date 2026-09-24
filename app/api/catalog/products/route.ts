import { NextResponse } from "next/server";

import { getCachedCatalogProducts } from "@/lib/catalog";

export async function GET() {
  try {
    const products = await getCachedCatalogProducts();

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Catalog products API error:", error);
    return NextResponse.json(
      { error: "Unable to fetch catalog products" },
      { status: 500 },
    );
  }
}
