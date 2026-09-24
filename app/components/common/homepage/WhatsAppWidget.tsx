"use client";

import Link from "next/link";

export function WhatsAppWidget() {
  const phoneNumber = "91987";
  const message = "Hi! I have a question about your products.";

  return (
    <Link
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-24 right-4 z-50 transition-all hover:scale-110 active:scale-95 sm:right-6 md:right-3"
      aria-label="Chat on WhatsApp"
    >
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#60D669] text-white shadow-[0_8px_30px_rgb(37,211,102,0.4)] md:h-12 md:w-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-brand-whatsapp"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
          <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
        </svg>
      </div>
    </Link>
  );
}
