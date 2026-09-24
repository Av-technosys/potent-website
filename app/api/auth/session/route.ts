import { NextResponse } from "next/server";
import { getAuthSession } from "@/helper/auth/session";

export async function GET() {
  const session = await getAuthSession({ refresh: true, persistRefresh: true });

  return NextResponse.json({
    authenticated: session.authenticated,
    user: session.user,
  });
}
