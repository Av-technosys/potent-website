"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const hiddenPathPrefixes = [
  "/admin",
  "/dashboard",
  "/login",
  "/signup",
  "/reset-password",
  "/email-verification",
];

export function WhatsAppWidget() {
  const pathname = usePathname();
  const phoneNumber = "916375881514";
  const message = "Hi! I have a question about your products.";

  const [hasStickyBar, setHasStickyBar] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const checkSticky = () => {
      const activeEl = document.querySelector(".pdp-sticky-active");
      setHasStickyBar(!!activeEl);
    };

    const checkChat = () => {
      setIsChatOpen(document.body.classList.contains("chatbot-open"));
    };

    checkSticky();
    checkChat();

    const observer = new MutationObserver(() => {
      checkSticky();
      checkChat();
    });
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });

    const handleChatToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ isOpen: boolean }>;
      if (typeof customEvent.detail?.isOpen === "boolean") {
        setIsChatOpen(customEvent.detail.isOpen);
      } else {
        checkChat();
      }
    };

    window.addEventListener("chatbot-toggle", handleChatToggle);
    window.addEventListener("scroll", checkSticky, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("chatbot-toggle", handleChatToggle);
      window.removeEventListener("scroll", checkSticky);
    };
  }, [pathname]);

  const isHidden = hiddenPathPrefixes.some((prefix) =>
    pathname?.startsWith(prefix)
  );

  if (isHidden) {
    return null;
  }

  return (
    <Link
      key={isChatOpen ? "wa-left" : "wa-right"}
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`whatsapp-floating-widget animate-pop-in group fixed z-50 ${
        isChatOpen
          ? `left-4 right-auto sm:left-6 md:left-auto md:right-[416px] ${
              hasStickyBar ? "bottom-[138px]" : "bottom-20"
            } md:bottom-6`
          : `right-4 left-auto sm:right-6 ${
              hasStickyBar ? "bottom-[204px]" : "bottom-[148px]"
            } md:bottom-24`
      }`}
      aria-label="Chat on WhatsApp"
    >
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#60D669] text-white shadow-[0_8px_30px_rgb(37,211,102,0.4)] transition-transform duration-200 group-hover:scale-110 group-active:scale-95 md:h-12 md:w-12">
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
