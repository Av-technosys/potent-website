/* eslint-disable @typescript-eslint/no-explicit-any */
import { decodeAuthUser, setAuthCookies } from "@/helper/auth/session";
import { refreshCognitoSession } from "@/helper/cognito";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const cookieStore = await cookies();

    const body = await req.json().catch(() => ({}));
    const refreshToken = body.refreshToken || cookieStore.get("refreshToken")?.value;
    const idToken = body.idToken || cookieStore.get("idToken")?.value;
    const storedAuthUser = cookieStore.get("authUser")?.value;
    let parsedAuthUser = null;

    try {
        parsedAuthUser = storedAuthUser ? JSON.parse(storedAuthUser) : null;
    } catch {
        parsedAuthUser = null;
    }

    const user = decodeAuthUser(idToken) || parsedAuthUser;
    const username = user?.username || user?.email;

    if (!refreshToken)
        return NextResponse.json({ message: 'Refresh token is required.' }, { status: 400 });

    if (!username)
        return NextResponse.json({ message: 'Unable to resolve token username.' }, { status: 401 });

    try {
        const result = await refreshCognitoSession({ refreshToken, username });

        if (!result.accessToken || !result.idToken) {
            throw new Error("Invalid refresh response");
        }

        await setAuthCookies({
            accessToken: result.accessToken,
            idToken: result.idToken,
            expiresIn: result.expiresIn,
        });

        return NextResponse.json({
            authenticated: true,
            user: decodeAuthUser(result.idToken),
        }, { status: 200 });
    } catch (err: any) {
        cookieStore.delete("accessToken");
        cookieStore.delete("idToken");
        cookieStore.delete("refreshToken");
        cookieStore.delete("authUser");

        return NextResponse.json({ message: err.message }, { status: 401 });
    }
}
