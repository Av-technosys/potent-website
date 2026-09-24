import { db } from "@/db"
import { subscriptions } from "@/db/schema"

export async function GET() {

  const plans = await db.select().from(subscriptions)

  return Response.json(plans)
}


// GET /api/plans