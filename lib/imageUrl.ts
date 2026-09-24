import { NEXT_PUBLIC_S3_URL } from "@/env";

const imageBaseUrl = NEXT_PUBLIC_S3_URL;

export function getImageUrl(src?: string | null) {
  if (!src) return "/placeholder.jpg";

  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("blob:") ||
    src.startsWith("data:") ||
    src.startsWith("/")
  ) {
    return src;
  }

  const baseUrl = imageBaseUrl;
  const imagePath = src.replace(/^\//, "");

  return `${baseUrl}/${imagePath}`;
}

export function getImageKey(src?: string | null) {
  if (!src) return "";

  const baseUrl = imageBaseUrl?.replace(/\/$/, "");

  if (baseUrl && src.startsWith(`${baseUrl}/`)) {
    return src.slice(baseUrl.length + 1);
  }

  return src.replace(/^\//, "");
}
