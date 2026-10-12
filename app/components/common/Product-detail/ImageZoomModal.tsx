"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

type ImageZoomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  alt?: string;
};

export default function ImageZoomModal({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNavigate,
  alt = "Product image enlarged",
}: ImageZoomModalProps) {
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Close on Escape & Lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        if (images.length > 1) {
          onNavigate(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
        }
      } else if (e.key === "ArrowRight") {
        if (images.length > 1) {
          onNavigate((currentIndex + 1) % images.length);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    const diffY = e.changedTouches[0].clientY - touchStartYRef.current;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        // Swiped left -> next
        onNavigate((currentIndex + 1) % images.length);
      } else {
        // Swiped right -> prev
        onNavigate(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-black/95 p-4 backdrop-blur-md sm:p-6"
    >
      {/* Top Header Strip */}
      <div className="flex w-full max-w-5xl items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
            <ZoomIn className="h-3.5 w-3.5 text-white/80" />
            <span>
              {currentIndex + 1} of {images.length}
            </span>
          </span>
          <span className="hidden text-xs text-white/60 sm:inline">
            Swipe or use arrows to navigate · Esc to close
          </span>
        </div>

        <button
          onClick={onClose}
          aria-label="Close enlarged view"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white transition-all hover:bg-white/30 active:scale-95"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Main Image Container */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="relative flex h-full max-h-[75vh] w-full max-w-4xl flex-1 items-center justify-center py-4"
      >
        <div className="relative h-full w-full">
          <Image
            src={currentImage}
            alt={alt}
            fill
            sizes="100vw"
            priority
            className="object-contain"
          />
        </div>

        {/* Prev & Next navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
              }}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-xs transition-all hover:bg-white/40 active:scale-95 sm:left-4"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate((currentIndex + 1) % images.length);
              }}
              aria-label="Next image"
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-xs transition-all hover:bg-white/40 active:scale-95 sm:right-4"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div className="no-scrollbar flex max-w-full gap-2.5 overflow-x-auto pb-2 pt-2">
          {images.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(idx);
              }}
              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                currentIndex === idx
                  ? "border-white ring-2 ring-white/50 scale-105"
                  : "border-white/30 opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="60px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

