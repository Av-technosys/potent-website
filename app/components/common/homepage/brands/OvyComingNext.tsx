"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, BellRing } from "lucide-react";
import { toast } from "sonner";

export function OvyComingNext() {
  const [email, setEmail] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubscribed(true);
    toast.success("You're on the list! We'll notify you as soon as Super Slim Period Panties land.");
  };

  return (
    <section className="hidden md:block w-full bg-[#e1d5e8] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Period Panty Cover Image */}
          <div className="lg:col-span-5 flex justify-center">
            <Link href="/product-detail/ovy-panty" className="relative w-full max-w-md aspect-square transform -rotate-1.5 transition-transform hover:scale-[1.02] block">
              <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-xl border border-purple-200/60 bg-white">
                <Image
                  src="/ovy/panty-box.jpg"
                  alt="Super Slim Period Panties"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 450px"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Right Column: Title, Subtitle, Checkmarks & Product Notify Box */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
            
            {/* Kicker & Title */}
            <div>
              <span className="text-[11px] font-bold tracking-widest text-[#602E55] uppercase block mb-1.5">
                OUT OF STOCK
              </span>
              <Link href="/product-detail/ovy-panty">
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1915] hover:text-[#602E55] transition-colors leading-tight">
                  Super Slim Period Panties.
                </h2>
              </Link>
              <p className="mt-3 text-xs sm:text-sm text-[#5C524D] leading-relaxed font-normal max-w-2xl">
                Worn like underwear, so nothing shifts. 360° coverage with a leak-resistant back for 10 to 12 hours, and super-thin under leggings, jeans or a saree. Two sizes, M-XL and XXL-XXXL, both the same price.
              </p>
            </div>

            {/* Checkmarks List */}
            <div className="space-y-2.5 text-xs sm:text-sm text-[#1F1915] max-w-xl">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#8C4F7C] shrink-0 stroke-[2.5]" />
                <span>Holds as much as 5 regular pads</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#8C4F7C] shrink-0 stroke-[2.5]" />
                <span>Tear-away sides, its own wrapper to bin it in</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#8C4F7C] shrink-0 stroke-[2.5]" />
                <span>Dermatologically tested, certified non-toxic</span>
              </div>
            </div>

            {/* Product Notify Me Box */}
            <div className="pt-2 max-w-md">
              {subscribed ? (
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#602E55] font-semibold bg-white/90 px-5 py-3 rounded-full border border-purple-300 shadow-sm">
                  <Check className="w-4 h-4 text-[#8C4F7C] stroke-[3]" />
                  <span>You&apos;ll be notified when Super Slim Period Panties land!</span>
                </div>
              ) : showInput ? (
                <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 rounded-full border border-purple-300 px-4 py-3 text-xs sm:text-sm text-[#1F1915] bg-white focus:outline-none focus:ring-2 focus:ring-[#8C4F7C] shadow-sm"
                  />
                  <button
                    type="submit"
                    className="bg-[#8C4F7C] hover:bg-[#763f69] text-white rounded-full px-6 py-3 text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span>Notify Me</span>
                    <BellRing className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowInput(true)}
                  className="bg-[#8C4F7C] hover:bg-[#763f69] text-white rounded-full px-7 py-3 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span>Tell me when it lands</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

