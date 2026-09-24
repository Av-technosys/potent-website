"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <div className="w-full ">
            <div className="container mx-auto px-6 py-5">
                <nav className="flex items-center text-sm text-gray-500">
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1;

                        return (
                            <div key={index} className="flex items-center ml-4">
                                {item.href && !isLast ? (
                                    <Link
                                        href={item.href}
                                        className="hover:text-gray-700 transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span
                                        className={`${isLast
                                            ? "text-gray-800 font-medium"
                                            : "text-gray-500"
                                            }`}
                                    >
                                        {item.label}
                                    </span>
                                )}

                                {!isLast && (
                                    <ChevronRight className="w-4 h-4 mx-1  text-gray-400" />
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}