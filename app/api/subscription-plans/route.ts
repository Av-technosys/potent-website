export const dynamic = "force-dynamic";
import { db } from "@/src/db";
import { subscriptions } from "@/src/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const plans = await db.select().from(subscriptions);
        return NextResponse.json({ success: true, data: plans }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
