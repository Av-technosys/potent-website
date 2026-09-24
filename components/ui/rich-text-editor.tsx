"use client";

import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("react-simple-wysiwyg").then((mod) => mod.DefaultEditor),
  { ssr: false }
);

type Props = {
  value: string;
  onChange: (content: string) => void;
};

export default function RichTextEditor({ value, onChange }: Props) {
  return (
    <div className="bg-white rounded-md mt-2 border overflow-hidden !min-h-[200px]">
      <Editor
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px]"
      />
    </div>
  );
}
