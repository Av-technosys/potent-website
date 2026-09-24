import { NextResponse } from "next/server";

import { getFullProductDetails } from "@/helper/product/action";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const product = await getFullProductDetails(slug);

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Catalog product details API error:", error);
    return NextResponse.json(
      { error: "Unable to fetch product details" },
      { status: 404 },
    );
  }
}
