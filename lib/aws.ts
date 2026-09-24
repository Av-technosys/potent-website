import { AWS_REGION, SES_AWS_ACCESS_KEY_ID, SES_AWS_SECRET_ACCESS_KEY } from "@/env";
import { SESClient } from "@aws-sdk/client-ses";

export const sesClient = new SESClient({
  region: AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: SES_AWS_ACCESS_KEY_ID,
    secretAccessKey: SES_AWS_SECRET_ACCESS_KEY,
  },
});
