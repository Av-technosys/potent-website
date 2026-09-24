"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createCategory, getAllCategoriesMeta } from "@/helper/category/action";
import { toast } from "sonner";
// Naya component import karein
import ImageUpload from "@/components/ImageUpload"; 
import { useFileUpload } from "@/helper";
import { getImageUrl } from "@/lib/imageUrl";

export default function AddCategoryForm() {
  const router = useRouter();
  const { upload, uploading } = useFileUpload();
  const bannerRef = useRef<HTMLInputElement>(null);
  
  const [parentId, setParentId] = useState("");
  // 'preview' ki jagah hum 'bannerUrl' use karenge jo ImageKit se aayega
  const [bannerUrl, setBannerUrl] = useState<string>(""); 
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    getAllCategoriesMeta().then((data) => {
      setCategories(data);
    });
  }, []);

  const submitHandler = async (e: any) => {
    e.preventDefault();
    const categoryData = {
      name: e.target.name.value,
      parentId: parentId,
      description: e.target.description.value,
      bannerImage: bannerUrl,
    };

    const response = await createCategory(categoryData);
    if (response?.success === true) {
      toast.success(response.message ?? "Category added successfully");
      router.push("/admin/category");
    } else {
      toast.error(response?.message ?? "Failed to add category");
    }
  };

   const handleBanner = async (file?: File) => {
    if (!file) return;

    try {
      const { fileKey } = await upload(file, "category");

      setBannerUrl(fileKey);

      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="w-full p-1">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Add Categories
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Organize your product hierarchy and manage structures.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form id="createCategory" onSubmit={(e) => submitHandler(e)}>
            <input type="hidden" name="parentId" value={parentId} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-slate-600 font-medium">Category Name</Label>
                  <Input
                    name="name"
                    placeholder="Enter Category Name"
                    className="h-11"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-slate-600 font-medium">Parent Category</Label>
                  <Select onValueChange={setParentId}>
                    <SelectTrigger className="h-11 text-slate-400">
                      <SelectValue placeholder="Select Parent Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-slate-600 font-medium">Description</Label>
                  <Textarea
                    name="description"
                    placeholder="Enter Description"
                    className="min-h-[140px] resize-none"
                  />
                </div>
              </div>

              {/* Right Column - Image Upload Logic Updated */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-slate-600 font-medium">Category Image</Label>
                  
                  {/* Purana drag-drop div hata kar naya component dala hai */}
                  {/* <ImageUpload onUploadSuccess={(url) => setBannerUrl(url)} /> */}
                  <div
                    onClick={() => bannerRef.current?.click()}
                    className="border-2 border-dashed rounded-xl h-48 flex items-center justify-center cursor-pointer relative overflow-hidden"
                  >
                    {!bannerUrl ? (
                      <p>Click to upload category image</p>
                    ) : (
                      <Image
                        src={getImageUrl(bannerUrl)}
                        alt="Category image preview"
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="w-full h-full object-contain"
                        unoptimized
                      />
                    )}

                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        Uploading...
                      </div>
                    )}
                  </div>

                  <input
                    ref={bannerRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleBanner(e.target.files?.[0])}
                  />

                  
                  {bannerUrl && (
                    <p className="text-xs text-green-600 font-medium mt-2">
                      ✓ Image uploaded successfully
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 px-0 pt-10">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/category")}
                className="px-12 h-11 rounded-full border-slate-300 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                form="createCategory"
                className="px-12 h-11 rounded-full bg-[#2D5A5D] hover:bg-[#234749] text-white"
              >
                Add
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
