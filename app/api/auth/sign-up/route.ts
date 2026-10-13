/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { referralCoinHistory, rewardCoinsHistory, users } from "@/db/schema";
import { cognitoAdminGetUser, cognitoSignUp } from "@/helper/cognito";
import { generateUniqueReferralCode } from "@/lib/referralCode";
import {
  REFERRAL_EARNING_RUPEES,
  REFERRAL_FRIEND_BONUS_RUPEES,
  SIGNUP_BONUS_RUPEES,
} from "@/lib/rewards";
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
        const isUuid =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            cleanRef,
          );
        if (isUuid) {
          foundUsers = await db
            .select()
            .from(users)
            .where(eq(users.id, cleanRef));
        }
      }

      if (foundUsers?.length) {
        // Strict self-referral check: cannot use own referral code
        if (
          foundUsers[0].email?.toLowerCase() === email?.toLowerCase() ||
          (phone && foundUsers[0].phone === phone) ||
          (name &&
            foundUsers[0].name?.trim().toLowerCase() ===
              String(name).trim().toLowerCase())
        ) {
          return NextResponse.json(
            { message: "You cannot use your own referral code." },
            { status: 400 },
          );
        }

        refUser = foundUsers;
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

        const safeName = (name || "New User").trim();
        const safePhone = phone || "0000000000";

        const [existingDbUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        let userRes;

        if (!existingDbUser) {
          const referredUser = refUser?.[0];
          const isValidReferral =
            referredUser &&
            referredUser.email?.toLowerCase() !== email?.toLowerCase();

          const initialRewardRupees =
            SIGNUP_BONUS_RUPEES +
            (isValidReferral ? REFERRAL_FRIEND_BONUS_RUPEES : 0);

          const generatedCode = await generateUniqueReferralCode(db, safeName);
          [userRes] = await db
            .insert(users)
            .values({
              name: safeName,
              email,
              phone: safePhone,
              cognitoId,
              referralCode: generatedCode,
              rewardOrderCoins: initialRewardRupees,
              referralCoins: 0,
            })
            .returning();

          // 1. Credit ₹100 Welcome Bonus for joining
          await db.insert(rewardCoinsHistory).values({
            userId: userRes.id,
            coins: SIGNUP_BONUS_RUPEES,
            type: "signup_bonus",
          });

          // 2. If signed up with a valid friend's referral code, credit friend bonus & referrer
          if (isValidReferral && referredUser.id !== userRes.id) {
            await db.insert(rewardCoinsHistory).values({
              userId: userRes.id,
              coins: REFERRAL_FRIEND_BONUS_RUPEES,
              type: "referral_welcome",
            });

            const [insertedRef] = await db
              .insert(referralCoinHistory)
              .values({
                userId: referredUser.id,
                coins: REFERRAL_EARNING_RUPEES,
                newUserName: safeName,
                newUserId: userRes.id,
                type: "referral",
              })
              .returning({ id: referralCoinHistory.id });

            await db.insert(rewardCoinsHistory).values({
              userId: referredUser.id,
              coins: REFERRAL_EARNING_RUPEES,
              type: `referral_bonus:${insertedRef?.id || userRes.id}:${safeName}`,
            });

            await db
              .update(users)
              .set({
                referralCoins: sql`COALESCE(${users.referralCoins}, 0) + ${REFERRAL_EARNING_RUPEES}`,
                rewardOrderCoins: sql`COALESCE(${users.rewardOrderCoins}, 0) + ${REFERRAL_EARNING_RUPEES}`,
              })
              .where(eq(users.id, referredUser.id));
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
