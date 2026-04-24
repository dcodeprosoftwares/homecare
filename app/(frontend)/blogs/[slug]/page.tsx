import { getBlogs } from "@/app/actions/blogs";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export async function generateStaticParams() {
  const blogs = await getBlogs();
  return blogs.map((blog: any) => ({ slug: blog.slug }));
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: blog } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!blog) notFound();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-primary-900 py-16 relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 relative z-10">
          <Link href="/blogs" className="inline-flex items-center gap-2 text-primary-200 hover:text-white transition-colors mb-6 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Blogs
          </Link>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            {blog.title}
          </h1>
          <div className="flex items-center gap-6 mt-6 text-primary-200 text-sm font-medium">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(blog.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {blog.author_name}
            </span>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {blog.cover_image && (
        <div className="mx-auto max-w-4xl w-full px-4 lg:px-8 -mt-8 relative z-10">
          <div className="aspect-[16/7] rounded-2xl overflow-hidden shadow-2xl relative">
            <Image
              src={blog.cover_image}
              alt={blog.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 896px"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          {blog.excerpt && (
            <p className="text-xl text-gray-500 italic mb-8 leading-relaxed border-l-4 border-primary pl-6">
              {blog.excerpt}
            </p>
          )}
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {blog.content}
          </div>

          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> All Articles
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-accent text-white px-6 py-3 font-bold hover:bg-accent-dark transition-all shadow-md"
            >
              Book Free Assessment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
