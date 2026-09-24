import { cart, cartItem, product, users } from "@/db/schema";
import { getProfile, sendCartAbandonmentEmail } from "@/helper";
import { db } from "@/lib/db";
import { and, eq, gt, lt } from "drizzle-orm";

export async function GET() {
const now = new Date();

const FIVE_DAYS_AGO = new Date(now);
FIVE_DAYS_AGO.setDate(now.getDate() - 5);

const SIX_DAYS_AGO = new Date(now);
SIX_DAYS_AGO.setDate(now.getDate() - 6);

 const data = await db
    .select({
      userId: cart.userId,
      email: users.email,
      fullName: users.name,
      productName: product.name,
    })
    .from(cartItem)
    .innerJoin(cart, eq(cartItem.cartId, cart.id))
    .innerJoin(users, eq(cart.userId, users.id))
    .innerJoin(product, eq(cartItem.productId, product.id))
    .where(
    and(
      lt(cartItem.createdAt, FIVE_DAYS_AGO),  // older than 5 days
      gt(cartItem.createdAt, SIX_DAYS_AGO)    // newer than 6 days
    )
  );

 
  for (const item of data) {
     await sendCartAbandonmentEmail(item.email,item.fullName,item.productName,"https://www.potenthygiene.com/cart","https://www.potenthygiene.com/dashboard/reviews");
  }

  return Response.json({ success: true });
}