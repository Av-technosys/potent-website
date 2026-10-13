import {
  EMAIL_FROM,
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  SES_AWS_ACCESS_KEY_ID,
} from "@/env";
import { sesClient } from "@/lib/aws";
import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import fs from "fs";
import path from "path";

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

type TemplateData = Record<string, string | number | null | undefined>;

type SendTemplateEmailParams = {
  to: string;
  subject: string;
  template: string;
  type: string;
  data?: TemplateData;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function loadTemplate(template: string, type: string) {
  const templatePath = path.join(
    process.cwd(),
    "email-templates",
    type,
    `${template}.html`,
  );

  return fs.readFileSync(templatePath, "utf-8");
}

function renderTemplate(template: string, data: TemplateData = {}) {
  return template.replace(/{{\s*([^}]+)\s*}}/g, (_, key: string) => {
    const value = data[key.trim()];

    if (value === null || value === undefined) {
      return "";
    }

    return escapeHtml(String(value));
  });
}

export const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
  const command = new SendEmailCommand({
    Source: EMAIL_FROM,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Html: {
          Data: html,
        },
      },
    },
  });

  try {
    return await sesClient.send(command);
  } catch (err: any) {
    if (
      err?.name === "InvalidClientTokenId" &&
      AWS_ACCESS_KEY_ID &&
      AWS_ACCESS_KEY_ID !== SES_AWS_ACCESS_KEY_ID
    ) {
      try {
        const fallbackClient = new SESClient({
          region: AWS_REGION || "ap-south-1",
          credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
          },
        });
        return await fallbackClient.send(command);
      } catch (fallbackErr) {
        throw fallbackErr;
      }
    }
    throw err;
  }
};

export const sendTemplateEmail = async ({
  to,
  subject,
  template,
  type,
  data,
}: SendTemplateEmailParams) => {
  const html = renderTemplate(loadTemplate(template, type), data);

  return sendEmail({
    to,
    subject,
    html,
  });
};
