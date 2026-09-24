import { db } from "@/db"
import { cart, cartItem } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function POST(req: Request) {
  try {

    const body = await req.json()

    const { userId, productId, subscriptionPlanId, quantity } = body

    if (!userId || !productId) {
      return Response.json(
        { success: false, message: "Missing data" },
        { status: 400 }
      )
    }

    // 1️⃣ check if user already has a cart
    let userCart = await db.query.cart.findFirst({
      where: eq(cart.userId, userId)
    })

    // 2️⃣ if no cart create one
    if (!userCart) {
      const newCart = await db
        .insert(cart)
        .values({ userId })
        .returning()

      userCart = newCart[0]
    }

    // 3️⃣ insert item in cart_item
    await db.insert(cartItem).values({
      cartId: userCart.id,
      productId,
      // subscriptionPlanId,
      quantity
    })

    return Response.json({
      success: true,
      message: "Added to cart"
    })

  } catch (error) {

    console.error("Cart API Error:", error)

    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}