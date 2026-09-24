import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { review } from "@/src/db/schema";


// GET REVIEWS
export async function GET() {

  try {

    const data = await db.select().from(review);

    return NextResponse.json(data);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );

  }

}


// CREATE REVIEW
export async function POST(req: NextRequest) {

  try {

    const body = await req.json();

    const newReview = await db
      .insert(review)
      .values({
        userId: body.userId,
        name: body.name,
        productId: body.productId,
        rating: body.rating,
        message: body.message,
      })
      .returning();

    return NextResponse.json(newReview);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );

  }

}