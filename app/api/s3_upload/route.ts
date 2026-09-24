import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { AWS_BUCKET } from "@/env";
import { s3 } from "@/lib/s3";

export async function POST(req: Request) {
  const { fileName, fileType , folder } = await req.json();
  const fileKey = `${folder}/${Date.now()}-${fileName}`;
  const command = new PutObjectCommand({
    Bucket: AWS_BUCKET!,
    Key: fileKey,
    ContentType: fileType,
  });
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
  return NextResponse.json({ uploadUrl, fileKey });
}
