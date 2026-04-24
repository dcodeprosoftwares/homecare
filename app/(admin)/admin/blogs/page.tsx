import { getBlogs } from "@/app/actions/blogs";
import BlogsClient from "./BlogsClient";

export default async function BlogsAdminPage() {
  const blogs = await getBlogs();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Blogs</h1>
      </div>
      
      <BlogsClient initialBlogs={blogs} />
    </div>
  );
}