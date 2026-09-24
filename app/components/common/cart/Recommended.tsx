"use client";

import Image from "next/image";
import { getImageUrl } from "@/lib/imageUrl";
import { Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const recommendations = [
  { 
    id: 1, 
    name: "Ultra Soft Sanitary Pads", 
    price: 299, 
    oldPrice: 399, 
    discount: "25% OFF", 
    rating: 5, 
    reviews: "1.4k", 
    tag: "Bestseller", 
    image: "/product.png", 
    bgColor: "bg-[#FDE7E7]" 
  },
  { 
    id: 2, 
    name: "Reusable Menstrual Cup", 
    price: 299, 
    oldPrice: 399, 
    discount: "25% OFF", 
    rating: 5, 
    reviews: "1.4k", 
    tag: "Eco Friendly", 
    image: "/product2.png",
    bgColor: "bg-[#E0F2F1]" 
  },
  { 
    id: 3, 
    name: "Comfort Pantyliners", 
    price: 299, 
    oldPrice: 399, 
    discount: "25% OFF", 
    rating: 5, 
    reviews: "1.4k", 
    tag: "Popular", 
    image: "/product2.png",
    bgColor: "bg-[#FDE7E7]" 
  },
  { id: 4, name: " Comfort Pantyliners", price: 299, oldPrice: 399, discount: "25% OFF", rating: 5, reviews: "1.4k", tag: "Popular", image: "/product3.png", bgColor: "bg-[#FDE7E7]" },
  { id: 5, name: " Comfort Pantyliners", price: 299, oldPrice: 399, discount: "25% OFF", rating: 5, reviews: "1.4k", tag: "Popular", image: "/product4.png", bgColor: "bg-[#FDE7E7]" },
];

export function Recommended() {
  return (
    <section className="mt-16 w-full px-1">
      <h2 className="mb-8 text-xl font-bold text-gray-900">You May Also Like</h2>
      
      <Carousel
        opts={{
          align: "start",
          dragFree: true,
        }}
        // Adding p-2 here ensures the shadow and border are not clipped
        className="w-full"
      >
        <CarouselContent className="-ml-4 p-2 -m-2"> 
          {recommendations.map((product) => (
            <CarouselItem 
              key={product.id} 
              className="pl-4 basis-[78%] md:basis-1/3 lg:basis-1/5 pb-2"
            >
              {/* Card Container - Border visible and no overlay effect */}
              <div className="relative flex flex-col h-full rounded-3xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
                
                {/* 1. Image Container */}
                <div className={`relative aspect-square w-full mb-4 rounded-2xl overflow-hidden ${product.bgColor}`}>
                  <Image 
                    src={getImageUrl(product.image)}
                    alt={product.name} 
                    fill 
                    className="object-cover" 
                  />
                  
                  <button className="absolute left-3 top-3 z-10 rounded-full bg-white p-2 shadow-sm text-gray-400">
                    <Heart className="h-4 w-4" />
                  </button>

                  <div className="absolute right-0 top-0 z-10 rounded-bl-2xl bg-[#1A8D91] px-4 py-1.5 text-[10px] font-bold text-white uppercase tracking-wider">
                    {product.discount}
                  </div>
                </div>

                {/* 2. Content Section */}
                <div className="flex flex-col flex-1">
                  <div className="bg-[#00D27B] text-white text-[10px] font-bold px-3 py-1 rounded-full w-fit mb-3">
                    {product.tag}
                  </div>

                  <h3 className="text-base font-bold text-gray-900 leading-tight mb-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#FFB800] text-[#FFB800]" />
                    ))}
                    <span className="ml-1 text-xs text-gray-400">({product.reviews})</span>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                    <span className="text-sm text-gray-400 line-through">₹{product.oldPrice}</span>
                  </div>

                  <div className="mt-auto pt-5">
                    <Button className="w-full bg-[#1A8D91] hover:bg-[#146e71] text-white font-bold rounded-xl h-12 border-none">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
