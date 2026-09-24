"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

type FooterSection = {
  title: string;
  links: { name: string; href: string }[];
};

const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "SHOP",
    links: [
      { name: "All products", href: "/shop" },
      { name: "Ovy period care", href: "/ovy" },
      { name: "Looway travel hygiene", href: "/looway" },
      { name: "Teen kits", href: "/product-detail/ovy-teen" },
      { name: "Build a Yatra Kit", href: "/looway-yatra-kit" },
    ],
  },
  {
    title: "LEARN",
    links: [
      { name: "Journal", href: "/blog" },
      { name: "Period Tracker", href: "/period-log" },
      { name: "Find what I need", href: "/quiz" },
      { name: "About us", href: "/about" },
    ],
  },
  {
    title: "HELP",
    links: [
      { name: "FAQs", href: "/faq" },
      { name: "Contact us", href: "/contact" },
      { name: "Shipping policy", href: "/shipping-policy" },
      { name: "Refund policy", href: "/refund-policy" },
    ],
  },
  {
    title: "LEGAL",
    links: [
      { name: "Privacy policy", href: "/privacy-policy" },
      { name: "Terms and conditions", href: "/terms-condition" },
    ],
  },
];

const PAYMENT_METHODS = [
  "UPI",
  "Visa",
  "Mastercard",
  "RuPay",
  "Net banking",
  "Razorpay",
];

export default function Footer() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <footer className="w-full bg-[#004851] text-white">
      <div className="mx-auto max-w-7xl px-5 pt-12 pb-8 sm:px-8 sm:pt-16 lg:px-16">
        {/* TOP MAIN GRID */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-6 lg:grid-cols-12 lg:gap-10">
          {/* BRAND & CONTACT COLUMN */}
          <div className="space-y-4 md:col-span-2 lg:col-span-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo-white.png"
                alt="Potent Hygiene"
                width={160}
                height={55}
                className="h-9 w-auto object-contain sm:h-11"
              />
            </Link>

            <p className="max-w-sm text-xs leading-relaxed font-normal text-white/80 sm:text-sm">
              India&apos;s first scenario-based hygiene brand. Made in Jaipur,
              built for Indian bodies, Indian toilets and Indian journeys.
            </p>

            <div className="space-y-1.5 pt-2 text-xs text-white/85 sm:text-sm">
              <a
                href="mailto:care@potenthygiene.com"
                className="block transition-colors hover:text-white"
              >
                care@potenthygiene.com
              </a>

              <a
                href="tel:+916375881514"
                className="block transition-colors hover:text-white"
              >
                +91 63758 81514
              </a>

              <a
                href="https://wa.me/916375881514"
                target="_blank"
                rel="noreferrer"
                className="block transition-colors hover:text-white"
              >
                WhatsApp us
              </a>
            </div>
          </div>

          {/* DESKTOP COLUMNS (Hidden on Mobile) */}
          <div className="hidden grid-cols-4 gap-6 md:col-span-4 md:grid lg:col-span-8 lg:gap-8">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-xs font-bold tracking-wider text-white uppercase">
                  {section.title}
                </h3>
                <ul className="space-y-2.5 text-xs text-white/80 sm:text-sm">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="transition-colors hover:text-white hover:underline"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* MOBILE ACCORDIONS (Shown only on Mobile `< md`) */}
          <div className="block space-y-0 border-t border-white/15 pt-2 md:hidden">
            {FOOTER_SECTIONS.map((section) => {
              const isOpen = !!openSections[section.title];
              return (
                <div
                  key={section.title}
                  className="border-b border-white/15 py-3.5"
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(section.title)}
                    className="flex w-full cursor-pointer items-center justify-between py-1 text-left text-xs font-bold tracking-wider text-white uppercase"
                  >
                    <span>{section.title}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-white/80 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <ul className="animate-fadeIn space-y-2.5 pt-3 pb-1 text-sm text-white/80">
                      {section.links.map((link) => (
                        <li key={link.name}>
                          <Link
                            href={link.href}
                            className="block transition-colors hover:text-white"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/15 pt-6 sm:mt-14 sm:gap-6 md:flex-row md:items-center">
          {/* Copyright */}
          <p className="text-xs text-white/70">
            © 2026 Potent Hygiene. All rights reserved.
          </p>

          {/* Payment Method Badges */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method}
                className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90 shadow-2xs backdrop-blur-xs sm:text-xs"
              >
                {method}
              </span>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-5 text-xs text-white/80">
            <a
              href="https://www.instagram.com/potenthygiene/"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/potenthygiene"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
