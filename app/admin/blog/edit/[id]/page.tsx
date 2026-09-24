import EditBlogForm from "@/components/admin/EditBlogForm";
import { getBlogById } from "@/helper/blog/action";
import { notFound } from "next/navigation";

export default async function EditBlogPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const blogData = await getBlogById(id); // Humne pehle action likha tha

  if (!blogData) return notFound();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Blog Post</h1>
      {/* Client Component ko data pass karein */}
      <EditBlogForm initialData={blogData} />
    </div>
  );
}