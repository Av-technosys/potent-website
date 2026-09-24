/* eslint-disable @typescript-eslint/no-explicit-any */

type ApiResponse<T = any> = {
  message?: string;
  data?: T;
};

const BASE_AUTH_API_URL = process.env.NEXT_PUBLIC_BASE_AUTH_API_URL!;
const AUTH_API_PATH = "/api/auth";

async function request<T>(
  endpoint: string,
  options: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const baseUrl =
      typeof window === "undefined" ? BASE_AUTH_API_URL || AUTH_API_PATH : AUTH_API_PATH;

    const res = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
      ...options,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function signUp(payload: {
  email: string;
  password: string;
  phone: string;
  name: string;
  ref: string;
}) {
  return request("/sign-up", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


export async function signIn(payload: {
  email: string;
  password: string;
}) {
  return request("/sign-in", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function forgotPassword(email: string) {
  return request("/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resendOtp(email: string) {
  return request("/resend-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function confirmForgotPassword(payload: {
  email: string;
  code: string;
  newPassword: string;
}) {
  return request("/confirm-forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function verifyOtp(payload: {
  email: string;
  code: string;
}) {
  return request("/verify-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function refreshToken(payload: {
  refreshToken?: string;
  idToken?: string;
}) {
  return request("/refersh-token", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logout() {
  await request("/logout", {
    method: "POST",
  });

}
export async function session() {
  return request('/session' ,{
    method: "GET"
  })
}

export async function isUserLoggedIn(): Promise<boolean> {
  try {
    const res: any = await session();

    return res?.authenticated ?? false;
  } catch (error) {
    console.error("Auth check failed:", error);
    return false;
  }
}
