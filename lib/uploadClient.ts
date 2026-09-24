// /* eslint-disable @typescript-eslint/no-explicit-any */
import { getImageUrl } from "@/lib/imageUrl";
export type UploadResult = {
  fileKey: string;
  fileUrl: string;
};

// export async function uploadFileToS3(file: File , folder: any): Promise<UploadResult> {
//   // Step 1: ask server for signed url
//   const res = await fetch("/api/s3_upload", {
//     method: "POST",
//     body: JSON.stringify({
//       fileName: file.name,
//       fileType: file.type,
//       folder: folder
//     }),
//   });

//   if (!res.ok) throw new Error("Failed to get upload URL");

//   const { uploadUrl, fileKey } = await res.json();

//   // Step 2: upload directly to S3
//   const upload = await fetch(uploadUrl, {
//     method: "PUT",
//     headers: { "Content-Type": file.type },
//     body: file,
//   });

//   if (!upload.ok) throw new Error("Upload failed");

//   return { fileKey };
// }


export async function uploadFileToS3(file: File, folder: any): Promise<UploadResult> {
  const res = await fetch("/api/s3_upload", {
    method: "POST",
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      folder: folder,
    }),
  });

  if (!res.ok) throw new Error("Failed to get upload URL");

  const { uploadUrl, fileKey } = await res.json();

  const upload = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!upload.ok) throw new Error("Upload failed");

  const fileUrl = getImageUrl(fileKey);

  return { fileKey, fileUrl };
}
