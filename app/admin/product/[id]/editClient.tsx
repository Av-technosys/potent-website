/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MultiCategorySelect } from "@/components/multiCategorySelect";
import { updateProduct } from "@/helper/product/action";
import { useFileUpload } from "@/helper";
import { validateImage } from "@/lib/validateImage";
import { getImageUrl } from "@/lib/imageUrl";

type ImageItem = {
  key: string;
  preview: string;
};

type ProductDetailsForm = {
  id: string;
  name: string;
  description: string;
  startingPrice: string;
  banner: ImageItem | null;
  highlights: string[];
  allowCycleSync: boolean;
  allowSubscription: boolean;
  isMixBox: boolean;
  brand: "ovy" | "loway";
  custimizeBoxInfo: string;
  priority: number;
  subscribeMonthlyDiscount: number;
  subscribeBiMontlyDiscount: number;
  cycleSyncDiscount: number;
  maxQuantityPurchase: number;
  freeShippingOver: number;
};

type ProductVariantForm = {
  id?: string;
  name: string;
  sku: string;
  price: number | "";
  strikethroughPrice: number | "";
  boxQuantity: number | "";
  priority: number;
  banner: ImageItem | null;
  flowType: string;
  isInStock: boolean;
};

type ProductMediaForm = {
  variantIndex: number;
  mediaType: string;
  mediaURL: string;
};

const emptyVariant = (priority = 0): ProductVariantForm => ({
  name: "",
  sku: "",
  price: "",
  strikethroughPrice: "",
  boxQuantity: "",
  priority,
  banner: null,
  flowType: "",
  isInStock: true,
});

export default function EditProduct({ productDetails }: any) {
  const router = useRouter();
  const { upload } = useFileUpload();
  const productBannerRef = useRef<HTMLInputElement>(null);
  const variantBannerRefs = useRef<Array<HTMLInputElement | null>>([]);
  const productMediaRefs = useRef<Array<HTMLInputElement | null>>([]);

  const variantsList =
    productDetails.productVariants || productDetails.prodcutVarientBoxRes || [];

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    (productDetails.categoryRes || []).map((c: any) => c?.categories?.id),
  );
  const [faqs, setFaqs] = useState<any[]>(
    (productDetails?.productFaqRes || []).map((faq: any, index: number) => ({
      id: faq.id,
      question: faq.question || "",
      answer: faq.answer || "",
      priority: faq.priority ?? index,
    })),
  );
  const [productDetailsForm, setProductDetailsForm] =
    useState<ProductDetailsForm>({
      id: productDetails.id || "",
      name: productDetails.name || "",
      description: productDetails.description || "",
      startingPrice: productDetails.startingPrice || "",
      banner: productDetails.bannerImage
        ? { key: productDetails.bannerImage, preview: productDetails.bannerImage }
        : null,
      highlights: productDetails.highlights || [],
      allowCycleSync: Boolean(productDetails.allowCycleSync),
      allowSubscription: Boolean(productDetails.allowSubscription),
      isMixBox: Boolean(productDetails.isMixBox),
      brand: productDetails.brand || "ovy",
      custimizeBoxInfo: productDetails.custimizeBoxInfo || "",
      priority: productDetails.priority || 0,
      subscribeMonthlyDiscount: productDetails.subscribeMonthlyDiscount || 0,
      subscribeBiMontlyDiscount: productDetails.subscribeBiMontlyDiscount || 0,
      cycleSyncDiscount: productDetails.cycleSyncDiscount || 0,
      maxQuantityPurchase: productDetails.maxQuantityPurchase || 6,
      freeShippingOver: productDetails.freeShippingOver || 599,
    });
  const [productVariants, setProductVariants] = useState<ProductVariantForm[]>(
    variantsList.length
      ? variantsList.map((variant: any, index: number) => ({
          id: variant.id,
          name: variant.name || "",
          sku: variant.sku || "",
          price: variant.price ?? "",
          strikethroughPrice: variant.strikethroughPrice ?? "",
          boxQuantity: variant.boxQuantity ?? "",
          priority: variant.priority ?? index,
          banner: variant.bannerImage
            ? { key: variant.bannerImage, preview: variant.bannerImage }
            : null,
          flowType: variant.flowType || "",
          isInStock: variant.isInStock ?? true,
        }))
      : [emptyVariant()],
  );
  const [productMedia, setProductMedia] = useState<ProductMediaForm[]>(() => {
    const variantIndexById = new Map(
      variantsList.map((variant: any, index: number) => [variant.id, index]),
    );

    return (productDetails.productMediaRes || []).map((media: any) => ({
      variantIndex: variantIndexById.get(media.productVariantId) ?? 0,
      mediaType: media.mediaType || "image",
      mediaURL: media.mediaURL || "",
    }));
  });

  const updateProductDetails = <K extends keyof ProductDetailsForm>(
    key: K,
    value: ProductDetailsForm[K],
  ) => {
    setProductDetailsForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateVariant = <K extends keyof ProductVariantForm>(
    index: number,
    key: K,
    value: ProductVariantForm[K],
  ) => {
    setProductVariants((prev) =>
      prev.map((variant, i) =>
        i === index ? { ...variant, [key]: value } : variant,
      ),
    );
  };

  const addVariant = () => {
    setProductVariants((prev) => [...prev, emptyVariant(prev.length)]);
  };

  const removeVariant = (index: number) => {
    setProductVariants((prev) => {
      if (prev.length === 1) return prev;

      setProductMedia((mediaRows) =>
        mediaRows
          .filter((media) => media.variantIndex !== index)
          .map((media) => ({
            ...media,
            variantIndex:
              media.variantIndex > index ? media.variantIndex - 1 : media.variantIndex,
          })),
      );

      return prev.filter((_, i) => i !== index);
    });
  };

  const addProductMedia = () => {
    setProductMedia((prev) => [
      ...prev,
      { variantIndex: 0, mediaType: "image", mediaURL: "" },
    ]);
  };

  const updateProductMedia = <K extends keyof ProductMediaForm>(
    index: number,
    key: K,
    value: ProductMediaForm[K],
  ) => {
    setProductMedia((prev) =>
      prev.map((media, i) => (i === index ? { ...media, [key]: value } : media)),
    );
  };

  const removeProductMedia = (index: number) => {
    setProductMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFaq = (index: number, key: string, value: string) => {
    setFaqs((prev) =>
      prev.map((faq, i) => (i === index ? { ...faq, [key]: value } : faq)),
    );
  };

  const addFaq = () => {
    setFaqs((prev) => [...prev, { question: "", answer: "", priority: prev.length }]);
  };

  const removeFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProductBanner = async (file?: File) => {
    if (!file) return;

    try {
      await validateImage(file, {
        maxSizeMB: 2,
        maxWidth: 2000,
        maxHeight: 2000,
        ratio: 1,
      });

      const { fileKey, fileUrl } = await upload(file, "product");
      updateProductDetails("banner", { key: fileKey, preview: fileUrl as any });
      toast.success("Product banner uploaded");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleVariantBanner = async (file: File | undefined, index: number) => {
    if (!file) return;

    try {
      await validateImage(file, {
        maxSizeMB: 2,
        maxWidth: 2000,
        maxHeight: 2000,
        ratio: 1,
      });

      const { fileKey, fileUrl } = await upload(file, "product");
      updateVariant(index, "banner", { key: fileKey, preview: fileUrl as any });
      toast.success("Variant banner uploaded");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleProductMediaUpload = async (
    file: File | undefined,
    index: number,
  ) => {
    if (!file) return;

    try {
      await validateImage(file, {
        maxSizeMB: 2,
        maxWidth: 2000,
        maxHeight: 2000,
        ratio: 1,
      });

      const { fileKey } = await upload(file, "product");
      updateProductMedia(index, "mediaURL", fileKey);
      updateProductMedia(index, "mediaType", "image");
      toast.success("Product media uploaded");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", productDetailsForm.id);
    selectedCategories.forEach((catId) => formData.append("category[]", catId));

    const payload = {
      ...productDetailsForm,
      bannerImage: productDetailsForm.banner?.key,
      highlights: productDetailsForm.highlights.filter(
        (highlight) => highlight.trim().length > 0,
      ),
      hasVarientBox: productDetailsForm.isMixBox,
      productVariants: productVariants.map((variant) => ({
        ...variant,
        bannerImage: variant.banner?.key,
      })),
      productMedia,
      faqs,
    };

    formData.append("variants", JSON.stringify(payload));

    try {
      await updateProduct(formData);
      toast.success("Product updated successfully!");
      router.push("/admin/product");
    } catch (err) {
      toast.error("Failed to update product");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <form onSubmit={handleUpdateProduct}>
        <div className="flex justify-between items-center sticky top-0 z-10 py-4 bg-white border-b">
          <div>
            <h1 className="text-2xl font-bold">Edit Product</h1>
            <p className="text-sm text-gray-500">{productDetails.slug}</p>
          </div>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/product")}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Category</CardTitle>
              </CardHeader>
              <CardContent>
                <MultiCategorySelect
                  selectedCategories={selectedCategories}
                  onCategoriesChange={setSelectedCategories}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>
                  Fields stored on the products table.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input
                      required
                      value={productDetailsForm.name}
                      onChange={(e) => updateProductDetails("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Starting Price</Label>
                    <Input
                      value={productDetailsForm.startingPrice}
                      onChange={(e) =>
                        updateProductDetails("startingPrice", e.target.value)
                      }
                      placeholder="e.g. Starting at Rs. 299"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Input
                      type="number"
                      value={productDetailsForm.priority}
                      onChange={(e) =>
                        updateProductDetails("priority", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Brand</Label>
                    <RadioGroup
                      value={productDetailsForm.brand}
                      onValueChange={(value: "ovy" | "loway") =>
                        updateProductDetails("brand", value)
                      }
                      className="flex h-10 items-center gap-6"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="ovy" id="brand-ovy" />
                        <Label htmlFor="brand-ovy">Ovy</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="loway" id="brand-loway" />
                        <Label htmlFor="brand-loway">Loway</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={productDetailsForm.description}
                    onChange={(e) =>
                      updateProductDetails("description", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Customize Box Info</Label>
                  <Textarea
                    value={productDetailsForm.custimizeBoxInfo}
                    onChange={(e) =>
                      updateProductDetails("custimizeBoxInfo", e.target.value)
                    }
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Monthly Discount</Label>
                    <Input
                      type="number"
                      value={productDetailsForm.subscribeMonthlyDiscount}
                      onChange={(e) =>
                        updateProductDetails(
                          "subscribeMonthlyDiscount",
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bi-Monthly Discount</Label>
                    <Input
                      type="number"
                      value={productDetailsForm.subscribeBiMontlyDiscount}
                      onChange={(e) =>
                        updateProductDetails(
                          "subscribeBiMontlyDiscount",
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cycle Sync Discount</Label>
                    <Input
                      type="number"
                      value={productDetailsForm.cycleSyncDiscount}
                      onChange={(e) =>
                        updateProductDetails(
                          "cycleSyncDiscount",
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Quantity Purchase</Label>
                    <Input
                      type="number"
                      value={productDetailsForm.maxQuantityPurchase}
                      onChange={(e) =>
                        updateProductDetails(
                          "maxQuantityPurchase",
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Free Shipping Over</Label>
                    <Input
                      type="number"
                      value={productDetailsForm.freeShippingOver}
                      onChange={(e) =>
                        updateProductDetails(
                          "freeShippingOver",
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between rounded-xl border p-4">
                    <Label>Allow Subscription</Label>
                    <Switch
                      checked={productDetailsForm.allowSubscription}
                      onCheckedChange={(checked) => {
                        updateProductDetails("allowSubscription", checked);
                        if (!checked) updateProductDetails("allowCycleSync", false);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border p-4">
                    <Label>Allow Cycle Sync</Label>
                    <Switch
                      checked={productDetailsForm.allowCycleSync}
                      onCheckedChange={(checked) => {
                        updateProductDetails("allowCycleSync", checked);
                        if (checked) updateProductDetails("allowSubscription", true);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border p-4">
                    <Label>Mix Box</Label>
                    <Switch
                      checked={productDetailsForm.isMixBox}
                      onCheckedChange={(checked) =>
                        updateProductDetails("isMixBox", checked)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Highlights</Label>
                  <div className="flex flex-col gap-2">
                    {productDetailsForm.highlights.map((highlight, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={highlight}
                          onChange={(e) => {
                            const highlights = [...productDetailsForm.highlights];
                            highlights[index] = e.target.value;
                            updateProductDetails("highlights", highlights);
                          }}
                          placeholder="Enter highlight"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() =>
                            updateProductDetails(
                              "highlights",
                              productDetailsForm.highlights.filter(
                                (_, i) => i !== index,
                              ),
                            )
                          }
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        updateProductDetails("highlights", [
                          ...productDetailsForm.highlights,
                          "",
                        ])
                      }
                    >
                      <Plus size={16} className="mr-2" />
                      Add Highlight
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Product Banner Image</Label>
                  <div
                    onClick={() => productBannerRef.current?.click()}
                    className="border-2 border-dashed rounded-xl h-48 flex items-center justify-center cursor-pointer relative overflow-hidden"
                  >
                    {!productDetailsForm.banner ? (
                      <p>Click to upload banner</p>
                    ) : (
                      <Image
                        src={getImageUrl(productDetailsForm.banner.preview)}
                        alt="Product banner preview"
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="w-full h-full object-contain"
                        unoptimized
                      />
                    )}
                  </div>
                  <input
                    ref={productBannerRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleProductBanner(e.target.files?.[0])}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Product Variants</span>
                  <Button type="button" variant="outline" onClick={addVariant}>
                    <Plus size={16} className="mr-2" />
                    Add Variant
                  </Button>
                </CardTitle>
                <CardDescription>
                  Fields stored on the product_variants table.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {productVariants.map((variant, index) => (
                  <div
                    key={variant.id || index}
                    className="rounded-xl border p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <Label>Variant {index + 1}</Label>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        disabled={productVariants.length === 1}
                        onClick={() => removeVariant(index)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Variant Name</Label>
                        <Input
                          required
                          value={variant.name}
                          onChange={(e) =>
                            updateVariant(index, "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>SKU</Label>
                        <Input
                          required
                          value={variant.sku}
                          onChange={(e) =>
                            updateVariant(index, "sku", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Flow Type</Label>
                        <Input
                          value={variant.flowType}
                          onChange={(e) =>
                            updateVariant(index, "flowType", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input
                          required
                          type="number"
                          value={variant.price}
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "price",
                              e.target.value === "" ? "" : Number(e.target.value),
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Strikethrough Price</Label>
                        <Input
                          type="number"
                          value={variant.strikethroughPrice}
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "strikethroughPrice",
                              e.target.value === "" ? "" : Number(e.target.value),
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Box Quantity</Label>
                        <Input
                          type="number"
                          value={variant.boxQuantity}
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "boxQuantity",
                              e.target.value === "" ? "" : Number(e.target.value),
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Priority</Label>
                        <Input
                          type="number"
                          value={variant.priority}
                          onChange={(e) =>
                            updateVariant(index, "priority", Number(e.target.value))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between rounded-xl border p-4">
                        <Label>In Stock</Label>
                        <Switch
                          checked={variant.isInStock}
                          onCheckedChange={(checked) =>
                            updateVariant(index, "isInStock", checked)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Variant Banner Image</Label>
                      <div
                        onClick={() => variantBannerRefs.current[index]?.click()}
                        className="relative flex h-32 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed"
                      >
                        {variant.banner ? (
                          <Image
                            src={getImageUrl(variant.banner.preview)}
                            alt={`${variant.name || "Variant"} banner preview`}
                            fill
                            sizes="(min-width: 768px) 33vw, 100vw"
                            className="object-contain"
                            unoptimized
                          />
                        ) : (
                          <p className="text-sm text-gray-500">
                            Click to upload variant banner
                          </p>
                        )}
                      </div>
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        ref={(el) => {
                          variantBannerRefs.current[index] = el;
                        }}
                        onChange={(e) =>
                          handleVariantBanner(e.target.files?.[0], index)
                        }
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Product Media</span>
                  <Button type="button" variant="outline" onClick={addProductMedia}>
                    <Plus size={16} className="mr-2" />
                    Add Media
                  </Button>
                </CardTitle>
                <CardDescription>
                  Rows stored on the product_media table. Each media item belongs
                  to a product variant.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {productMedia.length ? (
                  productMedia.map((media, index) => (
                    <div
                      key={index}
                      className="grid gap-4 rounded-xl border p-4 md:grid-cols-[120px_1fr_140px_1.5fr_auto]"
                    >
                      <div
                        onClick={() => productMediaRefs.current[index]?.click()}
                        className="relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-md border bg-gray-50"
                      >
                        {media.mediaURL ? (
                          <Image
                            src={getImageUrl(media.mediaURL)}
                            alt="Product media preview"
                            fill
                            sizes="96px"
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <span className="text-xs text-gray-500">Upload</span>
                        )}
                      </div>
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        ref={(el) => {
                          productMediaRefs.current[index] = el;
                        }}
                        onChange={(e) =>
                          handleProductMediaUpload(e.target.files?.[0], index)
                        }
                      />

                      <div className="space-y-2">
                        <Label>Variant</Label>
                        <select
                          className="h-10 w-full rounded-md border bg-white px-3 text-sm"
                          value={media.variantIndex}
                          onChange={(e) =>
                            updateProductMedia(
                              index,
                              "variantIndex",
                              Number(e.target.value),
                            )
                          }
                        >
                          {productVariants.map((variant, variantIndex) => (
                            <option key={variant.id || variantIndex} value={variantIndex}>
                              {variant.name || variant.sku || `Variant ${variantIndex + 1}`}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label>Media Type</Label>
                        <Input
                          value={media.mediaType}
                          onChange={(e) =>
                            updateProductMedia(index, "mediaType", e.target.value)
                          }
                          placeholder="image"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Media URL / Key</Label>
                        <Input
                          value={media.mediaURL}
                          onChange={(e) =>
                            updateProductMedia(index, "mediaURL", e.target.value)
                          }
                        />
                      </div>

                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeProductMedia(index)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
                    No product media added.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product FAQs</CardTitle>
                <CardDescription>
                  Questions and answers are stored separately from product data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={faq.id || index} className="rounded-xl border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>FAQ {index + 1}</Label>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeFaq(index)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    <Input
                      placeholder="Question"
                      value={faq.question}
                      onChange={(event) =>
                        updateFaq(index, "question", event.target.value)
                      }
                    />
                    <Textarea
                      placeholder="Answer"
                      value={faq.answer}
                      onChange={(event) =>
                        updateFaq(index, "answer", event.target.value)
                      }
                    />
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={addFaq}>
                  <Plus size={16} className="mr-2" />
                  Add FAQ
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
