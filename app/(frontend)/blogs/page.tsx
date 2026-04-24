import { getBlogs } from "@/app/actions/blogs";
import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";
import Image from "next/image";

export const revalidate = 3600;

export const metadata = {
  title: "Health & Care Blogs | TrueCare",
  description: "Read the latest news, tips, and insights on health and home care.",
};

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="flex flex-col">
      <section className="bg-primary-900 py-16 lg:py-24 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Health & Care Insights</h1>
          <p className="text-xl text-primary-200 max-w-2xl mx-auto">
            Expert advice, health tips, and company news from the TrueCare team.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {blogs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Articles Yet</h3>
              <p className="text-gray-500">Stay tuned for upcoming insights.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog: any) => (
                <div key={blog.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all">
                  <div className="aspect-[16/10] bg-gray-200 relative overflow-hidden">
                    {blog.cover_image ? (
                      <Image 
                        src={blog.cover_image} 
                        alt={blog.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-300">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 font-medium">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(blog.published_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {blog.author_name}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-3 flex-1">{blog.excerpt}</p>
                    <div className="mt-auto">
                      <div className="text-primary font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                        Read Article <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}