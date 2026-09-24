import { db } from "@/src/db";
import { product } from "@/src/db/schema";
import { ilike } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    const products = await db
      .select({
        id: product.id,
        name: product.name,
        slug: product.slug,
        bannerImage: product.bannerImage,
      })
      .from(product)
      .where(ilike(product.name, `%${query}%`))
      .limit(10);

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
