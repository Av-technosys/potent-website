"use client";

import { useRef } from "react";
import { ArrowRight, Play } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from "next/link";

const categories = [
  { id: 1, title: "Menstrual Cup", video: "/landingVideos/choose_cup.mp4", thumb: "/thumb1.png", slug: "fe019833-ad10-4c33-921e-09b46a98c413" },
  { id: 2, title: "Ovy pads", video: "/landingVideos/ovy_pads.mp4", thumb: "/thumb2.png", slug: "50efdc35-a00d-4186-bd98-854c27d21521" },
  { id: 3, title: "Pee & Puke Bags", video: "/landingVideos/pee_gel.mp4", thumb: "/thumb3.png", slug: "5d282a01-1620-4c4c-b16f-b2510c7311aa" },
  { id: 4, title: "Big Pads", video: "/landingVideos/pads.mp4", thumb: "/thumb3.png", slug: "50efdc35-a00d-4186-bd98-854c27d21521" },
];

export function ProductCategories() {
  return (
    <section className="py-12 md:bg-[#F8F6F1]">
      <div className="container">
        <Carousel opts={{ align: "start", loop: true }}>
          <CarouselContent>
            {categories.map((cat) => (
              <CarouselItem key={cat.id} className=" basis-[75%] md:basis-1/4">
                <VideoCard category={cat} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-between mt-6 md:hidden">
            <CarouselPrevious className="static translate-y-0 h-10 w-10 bg-[#D1E9EC] border-none text-[#1A8D91]" />
            <CarouselNext className="static translate-y-0 h-10 w-10 bg-[#D1E9EC] border-none text-[#1A8D91]" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}

function VideoCard({ category }: { category: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div
      className="group overflow-hidden rounded-md border bg-white transition-all"
      onMouseEnter={() => videoRef.current?.play()}
      onMouseLeave={() => { videoRef.current?.pause(); if (videoRef.current) videoRef.current.currentTime = 0; }}
    >
      <div className="relative">
        <video
          src={category.video}

          muted loop autoPlay
          className="h-full w-full object-cover"
        />
        {/* <div className="absolute inset-0 flex items-center justify-center bg-black/10 ">
          <Play className="h-10 w-10 text-white fill-current " />
        </div> */}
      </div>

      <div className="p-5 text-center">
        <Link href={`/shop?category=${category.slug}`}>
          <h3 className="text-lg font-bold text-gray-800">{category.title}</h3>
        </Link>
        <Link href={`/shop?category=${category.slug}`}>
          <button className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#1A8D91]">
            Shop Now <ArrowRight className="h-3 w-3" />
          </button></Link>
      </div>
    </div>
  );
}