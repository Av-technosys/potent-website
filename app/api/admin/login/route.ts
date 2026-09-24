import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
// import { admins } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { authSingIn } from "@/helper/cognito";

export async function POST(request: NextRequest) {
  try {
    // const { email, password } = await request.json();

    // if (!email || !password) {
    //   return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    // }

    // // attempt cognito authentication first
    // const auth = await authSingIn({ email, password });

    // const admin = await db
    //   .select()
    //   .from(admins)
    //   .where(eq(admins.email, email))
    //   .limit(1);

    // if (admin.length === 0) {
    //   return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    // }

    // // login successful, return token from Cognito along with any admin info
    // return NextResponse.json({ message: "Login successful", token: auth.accessToken }, { status: 200 });
  } catch (err) {
    // console.error("Login error", err);
    // return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
