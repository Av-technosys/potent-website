import { getBlogs, deleteBlog } from "@/helper/blog/action";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, FileText, Pencil, Trash2, Eye } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminBlogPage() {
  const allBlogs = await getBlogs();

  // Inline Server Action for Delete
  async function deleteAction(id: string) {
    "use server";
    const res = await deleteBlog(id);
    if (res.success) {
      revalidatePath("/admin/blog");
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6 text-[#2D5A5D]" /> Manage Blogs
        </h1>
        <Link href="/admin/blog/new">
          <Button className="bg-[#2D5A5D] hover:bg-[#234749]">
            <PlusCircle className="w-4 h-4 mr-2" /> Add New Blog
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {allBlogs.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl text-gray-400">
            No blogs found. Create your first post!
          </div>
        ) : (
          allBlogs.map((blog) => (
            <div key={blog.id} className="bg-white p-4 rounded-lg border shadow-sm flex justify-between items-center hover:shadow-md transition">
              <div>
                <h3 className="font-semibold text-lg">{blog.title}</h3>
                <p className="text-sm text-gray-500">{blog.blogCategory} | {blog.date}</p>
              </div>
              
              <div className="flex gap-2">
                {/* EDIT - Yeh user ko edit page pe le jayega */}
                <Link href={`/admin/blog/edit/${blog.id}`}>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 border-amber-200 hover:bg-amber-50 text-amber-600">
                    <Pencil className="w-4 h-4" /> Edit
                  </Button>
                </Link>

                {/* DELETE - Direct Server Action call */}
                <form action={deleteAction.bind(null, blog.id)}>
                  <Button 
                    type="submit"
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1 border-red-200 hover:bg-red-50 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </Button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}