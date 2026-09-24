// @ts-nocheck
import { db } from "@/db"
import { order } from "@/db/schema"
import { subscriptions } from "@/db/schema"
import { eq } from "drizzle-orm"
import { ORDER_STATUS } from "@/const/globalconst"

export async function POST(req: Request) {

  const { userId, planId } = await req.json()

  const plan = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.id, planId)
  })

  if (!plan || !plan.frequencyInDays) {
    return Response.json({ error: "Plan not found or invalid" })
  }

  const startDate = new Date()

  const nextBillingDate = new Date()
  nextBillingDate.setDate(
    nextBillingDate.getDate() + plan.frequencyInDays
  )

  const newSubscription = await db
    .insert(subscriptions)
    .values({
      userId,
      startDate,
      nextOrderDate: nextBillingDate,
      frequencyInDays: plan.frequencyInDays,
      isActive: false,
    })
    .returning()

  const [createdOrder] = await db
    .insert(order)
    .values({
      userId,
      status: ORDER_STATUS.PENDING,
      createdAt: new Date()
    })
    .returning({ id: order.id })

  await db
    .update(subscriptions)
    .set({ orderId: createdOrder.id })
    .where(eq(subscriptions.id, newSubscription[0].id))

  return Response.json({
    message: "Subscription created"
  })
}
