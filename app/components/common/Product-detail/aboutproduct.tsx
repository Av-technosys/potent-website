/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  HelpCircle,
  Leaf,
  Sparkles,
} from "lucide-react";
import {
  getProductStaticContent,
  getStaticSpecs,
  getStaticTabCopy,
  resolveStaticSizeKey,
  type ProductTabKey,
} from "@/lib/productStaticContent";

const DETAIL_SECTIONS: Array<{
  key: ProductTabKey;
  title: string;
  eyebrow: string;
  icon: any;
}> = [
  {
    key: "Description",
    title: "What this variant is made for",
    eyebrow: "Overview",
    icon: Sparkles,
  },
  {
    key: "Usage",
    title: "How it fits into use",
    eyebrow: "Usage",
    icon: ClipboardList,
  },
  {
    key: "Benefits",
    title: "Why customers choose it",
    eyebrow: "Benefits",
    icon: CheckCircle2,
  },
  {
    key: "Ingredients",
    title: "Materials and composition",
    eyebrow: "Inside",
    icon: Leaf,
  },
  {
    key: "Safety",
    title: "Care and safety notes",
    eyebrow: "Safety",
    icon: AlertTriangle,
  },
];

export default function AboutProduct({
  variant,
  themeColor,
}: {
  variant?: any;
  themeColor?: any;
}) {
  const pageTheme =
    typeof themeColor === "string"
      ? {
          darkColor: themeColor,
          lightColor: "#F3F4F6",
          textColor: themeColor,
        }
      : themeColor || {
          darkColor: "#016271",
          lightColor: "#E8F7FA",
          textColor: "#016271",
        };
  const [selectedHash, setSelectedHash] = useState("");

  const staticContent = useMemo(
    () => getProductStaticContent(variant),
    [variant],
  );
  const activeSizeKey = resolveStaticSizeKey(
    selectedHash,
    variant,
    staticContent,
  );
  const staticSpecs = getStaticSpecs(staticContent, activeSizeKey);
  const productFaqs = Array.isArray(variant?.productFaqRes)
    ? variant.productFaqRes.filter((faq: any) => faq.question && faq.answer)
    : [];
  const sections = DETAIL_SECTIONS.map((section) => ({
    ...section,
    content:
      getStaticTabCopy(staticContent, activeSizeKey, section.key) ||
      variant?.productAttributeRes?.find(
        (a: any) => a.attribute === section.key,
      )?.value,
  })).filter((section) => hasContent(section.content));

  useEffect(() => {
    const syncHash = () => setSelectedHash(window.location.hash);

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  return (
    <main className="py-8">
      <section className="rounded-3xl border-gray-200 bg-white sm:border sm:p-5 sm:shadow-sm md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
              {activeSizeKey
                ? `Variant ${activeSizeKey}`
                : "Product intelligence"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-950">
              Details that matter before buying
            </h2>
          </div>
          {staticSpecs.length > 0 && (
            <span
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: pageTheme.lightColor,
                color: pageTheme.textColor,
              }}
            >
              {staticSpecs.length} specs
            </span>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid grid-cols-1 gap-4">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <article
                  key={section.key}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className="grid h-9 w-9 place-items-center rounded-xl"
                      style={{
                        backgroundColor: pageTheme.lightColor,
                        color: pageTheme.darkColor,
                      }}
                    >
                      <Icon size={18} />
                    </span>
                    <div>
                      <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                        {section.eyebrow}
                      </p>
                      <h3 className="text-base font-semibold text-gray-950">
                        {section.title}
                      </h3>
                    </div>
                  </div>
                  {renderContent(section.content)}
                </article>
              );
            })}
          </div>

          {staticSpecs.length > 0 && (
            <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-base font-semibold text-gray-950">
                Variant specifications
              </h3>
              <div className="mt-4 divide-y divide-gray-100">
                {staticSpecs.map((spec: any, index: number) => {
                  const label = Array.isArray(spec)
                    ? spec[0]
                    : spec?.label || spec?.name;
                  const value = Array.isArray(spec) ? spec[1] : spec?.value;

                  return (
                    <div key={`${label}-${index}`} className="py-3">
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="mt-1 text-sm leading-5 font-medium text-gray-900">
                        {value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </aside>
          )}
        </div>

        {productFaqs.length > 0 && (
          <section className="mt-8 rounded-2xl border-gray-100 sm:border sm:bg-gray-50 sm:p-5">
            <div className="mb-4 flex items-center gap-3">
              <span
                className="grid h-9 w-9 place-items-center rounded-xl"
                style={{
                  backgroundColor: pageTheme.lightColor,
                  color: pageTheme.darkColor,
                }}
              >
                <HelpCircle size={18} />
              </span>
              <div>
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                  FAQs
                </p>
                <h3 className="text-base font-semibold text-gray-950">
                  Common questions about this product
                </h3>
              </div>
            </div>

            <div className="divide-y divide-gray-200 rounded-2xl bg-white">
              {productFaqs.map((faq: any, index: number) => (
                <details key={faq.id || index} className="group px-4 py-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-gray-950">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-gray-700">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

function renderContent(content: any) {
  if (Array.isArray(content)) {
    return (
      <ul className="grid gap-2 text-sm leading-6 text-gray-700">
        {content.map((item: any, index: number) => (
          <li key={index} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
            <span>{String(item)}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (typeof content === "string" && content.trim().startsWith("<")) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        className="text-sm leading-6 text-gray-700 [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5"
      />
    );
  }

  return <p className="text-sm leading-6 text-gray-700">{String(content)}</p>;
}

function hasContent(content: any) {
  if (Array.isArray(content)) return content.length > 0;
  return Boolean(typeof content === "string" ? content.trim() : content);
}
