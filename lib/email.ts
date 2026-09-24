import { EMAIL_FROM } from "@/env";
import { sesClient } from "@/lib/aws";
import { SendEmailCommand } from "@aws-sdk/client-ses";
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

  return await sesClient.send(command);
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
