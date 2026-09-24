/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { users } from "@/db/schema";
import { cognitoForgotPassword } from "@/helper/cognito";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { email } = body;
    try {
        const [user] = await db.select({id:users.id}).from(users).where(eq(users.email,email));
        if(!user){
            return NextResponse.json({
                message: 'User not found, please signup',
                delivery: null,
            }, { status: 404 });
        }
        const response = await cognitoForgotPassword({ email });

        return NextResponse.json({
            message: 'Password reset code sent to your email.',
            delivery: response.CodeDeliveryDetails,
        }, { status: 200 });
    } catch (err: any) {
        console.error('ForgotPassword error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

