/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";



import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import React, { RefObject } from "react";
import { getImageUrl } from "@/lib/imageUrl";

type ImageItem = { key: string; preview: string };

type Props = {
  gallery: ImageItem[];
  galleryRef: RefObject<HTMLInputElement | null>;
  handleGallery: (files: FileList | null) => void;
  setGallery: React.Dispatch<React.SetStateAction<ImageItem[]>>;
};

export default function GallerySection({
  gallery,
  galleryRef,
  handleGallery,
  setGallery
}: Props) {
  return (
    <Card className="m-1">
      <CardHeader>
        <CardTitle>Product Gallery</CardTitle>
        <CardDescription>Additional product images</CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        <div className="lg:col-span-4 w-full">
          <div
            onClick={() => galleryRef.current?.click()}
            className="flex flex-col items-center justify-center border-3 border-dashed border-muted-foreground/20 rounded-xl h-48 hover:bg-muted/50 transition-all cursor-pointer group"
          >
            <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
              <ImagePlus size={32} className="text-primary" />
            </div>
            <p className="mt-3 text-sm font-semibold">Upload images</p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG up to 2MB
            </p>
          </div>
        </div>

        <input
          ref={galleryRef}
          type="file"
          multiple
          accept="image/*"
          hidden
          onChange={(e) => handleGallery(e.target.files)}
        />

        <div className="lg:col-span-8 w-full">
          {gallery.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {gallery.map((img, i) => (
                <div
                  key={i}
                  className="relative group aspect-square border rounded-lg overflow-hidden bg-muted"
                >
                  <Image
                    src={getImageUrl(img.preview)}
                    alt="preview"
                    fill
                    sizes="(min-width: 640px) 33vw, 50vw"
                    className="object-cover"
                    unoptimized
                  />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                    type="button"
                      onClick={() =>
                        setGallery((prev) => prev.filter((_, x) => x !== i))
                      }
                      className="cursor-pointer absolute top-1 right-1 bg-black/60 text-white rounded px-2 py-1"
                    >
                      <X size={14} />
                    </Button>
                  </div>

                  <input type="hidden" name="media" value={img.key} />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center border rounded-xl border-muted bg-muted/10 text-muted-foreground">
              <p className="text-sm">No images selected</p>
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
