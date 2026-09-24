import { NextResponse } from "next/server";
import { SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognito, generateSecretHash } from "@/helper/cognito";
import { db } from "@/db";
// import { admins } from "@/db/schema";



export async function POST(req: Request) {
  try {
//     const body = await req.json();

//     const { fullName, email, phone, password } = body;
//     const formattedPhone = `+91${phone}`;

//     const secretHash = await generateSecretHash(email);

//     // 1️⃣ Create user in Cognito
//    const command = new SignUpCommand({
//   ClientId: process.env.COGNITO_CLIENT_ID!,
//   Username: email,
//   Password: password,
//   SecretHash: secretHash,
//   UserAttributes: [
//     { Name: "email", Value: email },
//     { Name: "name", Value: fullName },
//     { Name: "phone_number", Value: formattedPhone }
//   ]
// });

// await cognito.send(command);

//     // 2️⃣ Save user in Drizzle DB
//     await db.insert(admins).values({
//       fullName: fullName,
//       email: email,
//       phone: phone
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Signup successful"
//     });

  } catch (error: any) {
    // console.error(error);

    // return NextResponse.json(
    //   { error: error.message || "Signup failed" },
    //   { status: 400 }
    // );
  }
}