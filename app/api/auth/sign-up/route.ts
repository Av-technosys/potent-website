/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { referralCoinHistory, users } from "@/db/schema";
import { cognitoAdminGetUser, cognitoSignUp } from "@/helper/cognito";
import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, name, phone, ref } = body;

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 },
    );
  }

  try {
    var refUser: any;
    if (ref) {
      refUser = await db.select().from(users).where(eq(users.id, ref));
      if (refUser?.length) {
        await db
          .update(users)
          .set({ referralCoins: sql`${users.referralCoins} + ${200}` })
          .where(eq(users.id, refUser[0].id));
      } else {
        return NextResponse.json(
          { message: "Referral code is invalid." },
          { status: 400 },
        );
      }
    }
    const existingUser = await cognitoAdminGetUser({ email });

    if (existingUser?.UserStatus === "CONFIRMED") {
      return NextResponse.json(
        { message: "User already exists. Please login." },
        { status: 409 },
      );
    }

    await cognitoSignUp({
      email,
      password,
      userAttribute: [{ Name: "email", Value: email }],
    });

    return NextResponse.json(
      {
        message: "OTP resent to your email.",
        data: { email },
      },
      { status: 200 },
    );
  } catch (error: any) {
    if (error.__type === "UserNotFoundException") {
      try {
        const cognitoRes = await cognitoSignUp({
          email,
          password,
          userAttribute: [{ Name: "email", Value: email }],
        });

        const cognitoId = cognitoRes.UserSub;
        if (!cognitoId) throw new Error("Cognito User ID missing");

        const safeName = name || "New User";
        const safePhone = phone || "0000000000";

        const [existingDbUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        let userRes;

        if (!existingDbUser) {
          [userRes] = await db
            .insert(users)
            .values({
              name: safeName,
              email,
              phone: safePhone,
              cognitoId,
              referralCoins: ref ? 200 : 0,
            })
            .returning();

          const referredUser = refUser?.[0];

          if (referredUser) {
            await db.insert(referralCoinHistory).values({
              userId: referredUser.id,
              coins: 200,
              newUserName: name,
              newUserId: userRes.id,
              type: "referral",
            });
          }
        } else {
          userRes = existingDbUser;
        }

        return NextResponse.json(
          {
            message: "Signup successful. OTP sent to email.",
            data: {
              userId: userRes.id,
              email,
            },
          },
          { status: 201 },
        );
      } catch (signupError: any) {
        console.error("Signup error:", signupError);

        return NextResponse.json(
          { message: signupError.message },
          { status: 500 },
        );
      }
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
