/* eslint-disable @typescript-eslint/no-explicit-any */
import { COGNITO_CLIENT_ID } from "@/env";
import { cognito, generateSecretHash } from "@/helper/cognito";
import { ResendConfirmationCodeCommand } from "@aws-sdk/client-cognito-identity-provider";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { email } = body;

    if (!email)
        return NextResponse.json({ message: 'email is required.' }, { status: 400 });

    try {
        const secretHash = await generateSecretHash(email);
        const params = {
            ClientId: COGNITO_CLIENT_ID,
            Username: email,
            SecretHash: secretHash,
        };
        const command = new ResendConfirmationCodeCommand(params);

        const response = await cognito.send(command);

        return NextResponse.json({ message: response }, { status: 200 });
    } catch (err: any) {
        console.error('refreshToken error:', err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}