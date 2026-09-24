/* eslint-disable @typescript-eslint/no-explicit-any */
import { COGNITO_CLIENT_ID, USER_POOL_ID } from "@/env";
import { cognito, refreshCognitoSession } from "@/helper/cognito";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

type AuthUser = {
  userId?: string;
  email?: string;
  username?: string;
};

export type AuthSession = {
  authenticated: boolean;
  user: AuthUser | null;
  accessToken?: string;
  idToken?: string;
};

const accessTokenVerifier = CognitoJwtVerifier.create({
  userPoolId: USER_POOL_ID,
  tokenUse: "access",
  clientId: COGNITO_CLIENT_ID,
});

const idTokenVerifier = CognitoJwtVerifier.create({
  userPoolId: USER_POOL_ID,
  tokenUse: "id",
  clientId: COGNITO_CLIENT_ID,
});

const isProduction = process.env.NODE_ENV === "production";

export const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
} satisfies Partial<ResponseCookie>;

export function decodeAuthUser(idToken?: string): AuthUser | null {
  if (!idToken) return null;

  const decoded = jwt.decode(idToken) as any;
  if (!decoded) return null;

  return {
    userId: decoded["custom:user_id"],
    email: decoded.email,
    username: decoded["cognito:username"] || decoded.email,
  };
}

function parseStoredAuthUser(value?: string): AuthUser | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    return null;
  }
}

export async function setAuthCookies(tokens: {
  accessToken: string;
  idToken: string;
  refreshToken?: string;
  expiresIn?: number;
}) {
  const cookieStore = await cookies();
  const accessMaxAge = tokens.expiresIn || 60 * 60;
  const user = decodeAuthUser(tokens.idToken);

  cookieStore.set("accessToken", tokens.accessToken, {
    ...authCookieOptions,
    maxAge: accessMaxAge,
  });
  cookieStore.set("idToken", tokens.idToken, {
    ...authCookieOptions,
    maxAge: accessMaxAge,
  });

  if (tokens.refreshToken) {
    cookieStore.set("refreshToken", tokens.refreshToken, {
      ...authCookieOptions,
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  if (user?.email || user?.username) {
    cookieStore.set("authUser", JSON.stringify(user), {
      ...authCookieOptions,
      maxAge: 60 * 60 * 24 * 30,
    });
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  try {
    cookieStore.delete("accessToken");
    cookieStore.delete("idToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("authUser");
  } catch {
    // Server Components can read cookies but cannot always mutate them.
  }
}

async function verifyTokenPair(accessToken: string, idToken: string) {
  await Promise.all([
    accessTokenVerifier.verify(accessToken),
    idTokenVerifier.verify(idToken),
  ]);
}

export async function getAuthSession(options?: {
  refresh?: boolean;
  persistRefresh?: boolean;
}): Promise<AuthSession> {
  const shouldRefresh = options?.refresh ?? true;
  const shouldPersistRefresh = options?.persistRefresh ?? true;
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const idToken = cookieStore.get("idToken")?.value;

  if (accessToken && idToken) {
    try {
      await verifyTokenPair(accessToken, idToken);
      return {
        authenticated: true,
        user: decodeAuthUser(idToken),
        accessToken,
        idToken,
      };
    } catch {
      // Expired or invalid tokens may still be recoverable with refresh token.
    }
  }

  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!shouldRefresh || !refreshToken) {
    return { authenticated: false, user: null };
  }

  const storedAuthUser = cookieStore.get("authUser")?.value;
  const user =
    decodeAuthUser(idToken) || parseStoredAuthUser(storedAuthUser);
  const username = user?.username || user?.email;

  if (!username) {
    await clearAuthCookies();
    return { authenticated: false, user: null };
  }

  try {
    const refreshed = await refreshCognitoSession({ refreshToken, username });

    if (!refreshed.accessToken || !refreshed.idToken) {
      await clearAuthCookies();
      return { authenticated: false, user: null };
    }

    if (shouldPersistRefresh) {
      try {
        await setAuthCookies({
          accessToken: refreshed.accessToken,
          idToken: refreshed.idToken,
          expiresIn: refreshed.expiresIn,
        });
      } catch {
        // Server Components can read cookies but cannot always persist updates.
      }
    }

    return {
      authenticated: true,
      user: decodeAuthUser(refreshed.idToken),
      accessToken: refreshed.accessToken,
      idToken: refreshed.idToken,
    };
  } catch {
    await clearAuthCookies();
    return { authenticated: false, user: null };
  }
}
