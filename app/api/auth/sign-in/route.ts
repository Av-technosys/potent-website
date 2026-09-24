/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { authSingIn } from "@/helper/cognito";
import { setAuthCookies } from "@/helper/auth/session";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 }
    );
  }

  try {
    const result = await authSingIn({ email, password });
    if (!result?.accessToken) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      {
        message: "Login successful",
        data: { authenticated: true },
      },
      { status: 200 }
    );

    await setAuthCookies({
      accessToken: result.accessToken!,
      idToken: result.idToken!,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
    });

    return response;

  } catch (error: any) {
    console.error("Login error:", error);

    // 🔥 Proper Cognito error handling (VERY IMPORTANT)

    if (error.name === "NotAuthorizedException") {
      return NextResponse.json(
        { message: "Incorrect email or password" },
        { status: 401 }
      );
    }

    if (error.name === "UserNotConfirmedException") {
      return NextResponse.json(
        { message: "Please verify your email first (OTP)" },
        { status: 403 }
      );
    }

    if (error.name === "UserNotFoundException") {
      return NextResponse.json(
        { message: "User does not exist" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: error.message || "Login failed" },
      { status: 500 }
    );
  }
}
