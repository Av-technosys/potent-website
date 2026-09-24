/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateBlog } from "@/helper/blog/action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { getImageUrl } from "@/lib/imageUrl";
import {
  IconDeviceFloppy,
  IconX,
  IconPhoto,
  IconUser,
  IconRefresh,
} from "@tabler/icons-react";
import RichTextEditor from "../ui/rich-text-editor";
import { useFileUpload } from "@/helper";

export default function EditBlogForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { upload, uploading } = useFileUpload();

  const [formData, setFormData] = useState({
    title: initialData.title || "",
    metaDescription: initialData.metaDescription || "",
    blogCategory: initialData.blogCategory || "",
    image: initialData.image || "",
    userImage: initialData.userImage || "",
    userName: initialData.userName || "",
    date: initialData.date || "",
    data: initialData.data || "",
    tags: Array.isArray(initialData.tags)
      ? initialData.tags.join(", ")
      : initialData.tags || "",
  });

  // ✅ IMAGE UPLOAD FUNCTION
  // const handleFileUpload = async (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   field: string
  // ) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const formDataUpload = new FormData();
  //   formDataUpload.append("file", file);

  //   try {
  //     const res = await fetch("/api/upload", {
  //       method: "POST",
  //       body: formDataUpload,
  //     });

  //     const data = await res.json();

  //     if (data.url) {
  //       setFormData((prev) => ({
  //         ...prev,
  //         [field]: data.url,
  //       }));
  //     }
  //   } catch (error) {
  //     console.error("Upload failed", error);
  //   }
  // };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { fileKey } = await upload(file, "blog");

      setFormData((prev) => ({
        ...prev,
        [field]: fileKey,
      }));
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await updateBlog(initialData.id, formData);

    if (res.success) {
      router.push("/admin/blog");
      router.refresh();
    } else {
      alert("Something went wrong!");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-8 pb-20">
      <div className="grid gap-6 md:grid-cols-2">
        {/* LEFT */}
        <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 border-b pb-2 text-lg font-bold">
            <IconPhoto className="h-5 w-5 text-teal-600" /> Main Details
          </h3>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Blog Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter catchy title"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Category
              </label>
              <Input
                value={formData.blogCategory}
                onChange={(e) =>
                  setFormData({ ...formData, blogCategory: e.target.value })
                }
                placeholder="e.g. Period Care"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Publish Date
              </label>
              <Input
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                placeholder="January 10, 2024"
              />
            </div>
          </div>

          {/* MAIN IMAGE */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Main Image
            </label>

            <div className="relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center hover:bg-gray-50">
              <input
                type="file"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={(e) => handleFileUpload(e, "image")}
              />
              <p className="flex items-center justify-center gap-2 text-sm text-gray-500">
                {formData.image ? (
                  <>
                    <IconRefresh className="h-4 w-4" />
                    Change Image
                  </>
                ) : (
                  "Upload Image"
                )}
              </p>
            </div>

            {formData.image && (
              <div className="relative mt-3 h-40 w-full overflow-hidden rounded-lg border">
                <Image
                  src={getImageUrl(formData.image)}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 border-b pb-2 text-lg font-bold">
            <IconUser className="h-5 w-5 text-teal-600" /> Author & Metadata
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Author Name
              </label>
              <Input
                value={formData.userName}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Author Image
              </label>

              <div className="relative cursor-pointer rounded-md border bg-white p-3 text-center">
                <input
                  type="file"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={(e) => handleFileUpload(e, "userImage")}
                />

                <span className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  {formData.userImage ? (
                    <>
                      <IconRefresh className="h-4 w-4" />
                      Change Photo
                    </>
                  ) : (
                    "Upload Photo"
                  )}
                </span>
              </div>

              {formData.userImage && (
                <div className="relative mt-2 h-24 w-24 overflow-hidden rounded-full border">
                  <Image
                    src={getImageUrl(formData.userImage)}
                    alt="Author"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Meta Description
            </label>
            <Textarea
              value={formData.metaDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  metaDescription: e.target.value,
                })
              }
              rows={2}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Tags (comma separated)
            </label>
            <Input
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="health, wellness, hygiene"
            />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <label className="mb-4 block border-b pb-2 text-lg font-bold">
          Blog Content (Data)
        </label>
        <RichTextEditor
          value={formData.data}
          onChange={(val) => setFormData({ ...formData, data: val })}
        />
      </div>

      {/* BUTTONS */}
      <div className="right-0 bottom-0 left-0 z-100 flex justify-center gap-4 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#016271] px-10 py-4 text-lg font-bold text-white shadow-md hover:bg-[#137688]"
        >
          {loading ? (
            "Saving Changes..."
          ) : (
            <>
              <IconDeviceFloppy className="mr-2 h-5 w-5" />
              Update Post
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="border-gray-300 px-10 py-4 text-lg text-gray-700 hover:bg-gray-50"
        >
          <IconX className="mr-2 h-5 w-5" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
