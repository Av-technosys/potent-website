/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/ui/rich-text-editor";

type Props = {
  productAttributes: Record<string, { value: string }>;
  handleValueChange: (attribute: string, value: string) => void;
};

const TABS = ["Description", "Usage", "Benefits", "Ingredients", "Safety"];

export default function AttributeSection({ productAttributes, handleValueChange }: Props) {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <Card className="m-1">
      <CardHeader>
        <CardTitle>Product Details & Specifications</CardTitle>
      </CardHeader>

      <CardContent>
        {/* Tabs Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b pb-4 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(tab);
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-[#1f8297] text-white" // Adjust primary color as needed
                  : "border bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4 bg-[#f8f9fa] p-4 rounded-xl min-h-[300px]">
          <Label className="text-xl font-bold mb-4 block text-gray-800">
            {activeTab === "Usage" ? "How to Use" : activeTab}
          </Label>
          
          <RichTextEditor
            value={productAttributes[activeTab]?.value ?? ""}
            onChange={(val) => handleValueChange(activeTab, val)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
