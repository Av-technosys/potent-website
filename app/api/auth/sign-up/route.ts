/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { referralCoinHistory, users } from "@/db/schema";
import { cognitoAdminGetUser, cognitoSignUp } from "@/helper/cognito";
import { generateUniqueReferralCode } from "@/lib/referralCode";
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

  let refUser: any;

  try {
    if (ref && typeof ref === "string" && ref.trim()) {
      const cleanRef = ref.trim();
      // Look up by short referralCode first (case-insensitive)
      let foundUsers = await db
        .select()
        .from(users)
        .where(sql`lower(${users.referralCode}) = lower(${cleanRef})`);

      // Fallback for legacy UUID referral links
      if (!foundUsers.length) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanRef);
        if (isUuid) {
          foundUsers = await db.select().from(users).where(eq(users.id, cleanRef));
        }
      }

      if (foundUsers?.length) {
        // Self-referral check: cannot use own referral code
        if (
          foundUsers[0].email?.toLowerCase() === email?.toLowerCase() ||
          (phone && foundUsers[0].phone === phone)
        ) {
          return NextResponse.json(
            { message: "You cannot use your own referral code." },
            { status: 400 },
          );
        }

        refUser = foundUsers;
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
          const generatedCode = await generateUniqueReferralCode(db, safeName);
          [userRes] = await db
            .insert(users)
            .values({
              name: safeName,
              email,
              phone: safePhone,
              cognitoId,
              referralCode: generatedCode,
              referralCoins: refUser?.length ? 200 : 0,
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
