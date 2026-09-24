"use client";

import { useState, useEffect } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/apiFetch";
import Image from "next/image";
import { getImageKey } from "@/lib/imageUrl";

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  initialImage?: string | null; // Naya prop add kiya
}

export default function ImageUpload({
  onUploadSuccess,
  initialImage,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");

  // Jab component load ho ya initialImage badle, preview set karein
  useEffect(() => {
    if (initialImage) {
      setPreview(initialImage);
    }
  }, [initialImage]);

  const uploadImage = async (selectedFile: File) => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await apiFetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (res.status === 200 && res.data?.url) {
        setPreview(res.data.url);

        onUploadSuccess(getImageKey(res.data.filePath ?? res.data.url));
      } else {
        console.error("❌ Upload failed:", res.data);
      }
    } catch (error) {
      console.error("💥 Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center bg-white hover:bg-slate-50/50 transition-colors cursor-pointer min-h-[220px] relative overflow-hidden"
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        {uploading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
            <Loader2 className="animate-spin text-[#2D5A5D]" />
          </div>
        )}

        {preview ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={preview}
              alt="Preview"
              width={160}
              height={160}
              className="max-h-40 w-auto object-contain rounded-md"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-xs bg-white/90 px-2 py-1 rounded shadow-sm font-medium">
                Change Image
              </p>
            </div>
          </div>
        ) : (
          <>
            <ImagePlus className="w-10 h-10 text-slate-400 mb-3" />
            <p className="text-sm font-medium text-slate-600">
              Click to upload category image
            </p>
            <p className="text-xs text-slate-400 mt-1">
              SVG, JPG, PNG (max. 2 MB)
            </p>
          </>
        )}
      </div>

      <input
        id="fileInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const selected = e.target.files?.[0];
          if (selected) uploadImage(selected);
        }}
      />
    </div>
  );
}
