"use client";
import { useRouter } from 'next/navigation';

import { useState } from "react";
import { createBlog, updateBlog, deleteBlog } from "@/app/actions/blogs";
import { Edit, Trash2, Plus, X } from "lucide-react";

type Blog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  author_name: string;
  published_at: string;
};

export default function BlogsClient({ initialBlogs }: { initialBlogs: Blog[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenModal = (blog?: Blog) => {
    if (blog) {
      setEditingBlog(blog);
    } else {
      setEditingBlog(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    
    let result;
    if (editingBlog) {
      result = await updateBlog(editingBlog.id, formData);
    } else {
      result = await createBlog(formData);
    }

    setIsSaving(false);
    if (result.error) { alert(result.error); } else {
      handleCloseModal();
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      const result = await deleteBlog(id);
      if (result.error) { alert(result.error); } else { router.refresh(); }
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Blog Post
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Author</th>
                <th className="px-6 py-4 font-medium hidden lg:table-cell">Published</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {initialBlogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No blogs found. Click "Add New Blog Post" to create one.
                  </td>
                </tr>
              ) : (
                initialBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 max-w-[200px] truncate">{blog.title}</td>
                    <td className="px-6 py-4 text-gray-600 hidden md:table-cell">{blog.author_name}</td>
                    <td className="px-6 py-4 text-gray-600 hidden lg:table-cell">
                      {new Date(blog.published_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleOpenModal(blog)}
                        className="text-primary hover:text-primary-800 p-2 inline-flex"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(blog.id)}
                        className="text-red-500 hover:text-red-700 p-2 inline-flex ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                {editingBlog ? "Edit Blog Post" : "Add New Blog Post"}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Blog Title *</label>
                  <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    required 
                    defaultValue={editingBlog?.title}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                  />
                </div>
                <div>
                  <label htmlFor="author_name" className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                  <input 
                    type="text" 
                    id="author_name" 
                    name="author_name" 
                    defaultValue={editingBlog?.author_name || "TrueCare Team"}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                <input 
                  type="url" 
                  id="cover_image" 
                  name="cover_image" 
                  defaultValue={editingBlog?.cover_image || ""}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">Excerpt *</label>
                <textarea 
                  id="excerpt" 
                  name="excerpt" 
                  required 
                  rows={2}
                  defaultValue={editingBlog?.excerpt || ""}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none" 
                  placeholder="A short summary of the post..."
                ></textarea>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Full Content (HTML allowed) *</label>
                <textarea 
                  id="content" 
                  name="content" 
                  required
                  rows={10}
                  defaultValue={editingBlog?.content || ""}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-y font-mono text-sm" 
                  placeholder="<p>Write your blog post here...</p>"
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Blog Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
