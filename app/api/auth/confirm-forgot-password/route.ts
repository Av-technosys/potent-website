/* eslint-disable @typescript-eslint/no-explicit-any */
import { cognitoConfirmForgotPassword } from "@/helper/cognito";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { email, code, newPassword } = body;

    if (!email || !code || !newPassword) {
        return NextResponse.json({ message: 'email, code, and new password are required.' }, { status: 400 });
    }
    try {
        await cognitoConfirmForgotPassword({ email, code, newPassword });

        return NextResponse.json({ message: 'Password reset successful.' }, { status: 200 });
    } catch (err: any) {
        console.error('ConfirmForgotPassword error:', err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}