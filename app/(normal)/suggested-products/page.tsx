"use client";
import AddToWishlist from "@/app/components/common/category/addToWishlist";
import { Button } from "@/components/ui/button";
import { getQuizSuggestedProducts } from "@/helper";
import Image from "next/image";
import { getImageUrl } from "@/lib/imageUrl";
import Link from "next/link";
import React, { useEffect } from "react";
import { addToCart as addToCartAction } from "@/store/cartActions";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const SuggestedProducts = () => {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const userAnswers = JSON.parse(
          localStorage.getItem("quizAnswers") || "[]",
        );
        const data: any = await getQuizSuggestedProducts(userAnswers);
        setProducts(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const addToCart = async (product: any) => {
    await addToCartAction({
      productId: product.id,
      sku: "default",
      slug: product.slug || "",
      title: product.name,
      image: product.bannerImage || "/product.png",
      price: product.basePrice || 0,
      originalPrice: product.strikethroughPrice,
      quantity: 1,
      isQuantityChangable: true,
    });
  };

  return (
    <div className="mx-auto mb-5 max-w-6xl">
      <button
        type="button"
        className="my-2 flex cursor-pointer items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-gray-700 hover:bg-gray-100"
        onClick={() => {
          localStorage.removeItem("quizAnswers");
          setProducts([]);
          setLoading(true);

          router.push("/quiz");
        }}
      >
        <ArrowLeft />
        Retake Quiz
      </button>
      <div className="my-5 text-xl font-semibold text-gray-600">
        Showing {products.length} Products for Result “All Products”
      </div>
      <div className="grid h-full flex-1 grid-cols-2 gap-6 md:grid-cols-4">
        {loading ? (
          <div className="py-20 text-center text-gray-500">
            Fetching your personalised product picks...
          </div>
        ) : products.length > 0 ? (
          products?.map((value: any) => {
            const startingPrice = String(value.startingPrice || "").trim();

            return (
              <div
                key={value.id}
                className="relative flex flex-col rounded-md bg-white p-3 shadow-md"
              >
                {/* Wishlist */}
                <AddToWishlist product={value} />
                {/* Discount */}
                {value.strikethroughPrice && (
                  <div className="absolute top-2 right-2 z-10">
                    <div className="rounded-xl bg-[#016271] px-2 py-1 text-[10px] font-bold text-white">
                      SALE
                    </div>
                  </div>
                )}

                {/* Image */}
                <Link
                  className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-50"
                  href={`/product-detail/${value.slug}`}
                >
                  <Image
                    src={getImageUrl(value.bannerImage || "/product.png")}
                    alt={value.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    unoptimized
                  />
                </Link>

                {/* Badge */}
                <span className="absolute bottom-31 left-1 w-fit rounded-full bg-[#10B981] px-2 py-0.5 text-[10px] text-white">
                  Bestseller
                </span>

                {/* Content */}
                <div className="mt-4 flex flex-col space-y-3 rounded-lg px-1">
                  <h3 className="line-clamp-1 text-sm font-bold text-gray-800">
                    {value.name}
                  </h3>

                  {startingPrice ? (
                    <p className="text-xs font-semibold text-gray-700">
                      {startingPrice}
                    </p>
                  ) : null}

                  {value.hasVarientBox ? (
                    <Link href={`/product-detail/${value.slug}`}>
                      <Button className="w-full rounded-md bg-[#016271] py-5 text-sm font-semibold text-white hover:bg-[#146e71]">
                        Add to Cart
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      className="w-full rounded-md bg-[#016271] py-5 text-sm font-semibold text-white hover:bg-[#146e71]"
                      onClick={() => addToCart(value)}
                    >
                      Add to Cart
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center text-gray-500">
            No products found
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestedProducts;
