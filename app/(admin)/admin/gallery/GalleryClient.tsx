"use client";
import { useRouter } from 'next/navigation';

import { useState } from "react";
import { createGalleryItem, deleteGalleryItem } from "@/app/actions/gallery";
import { Trash2, Plus, X } from "lucide-react";

type GalleryItem = {
  id: string;
  title: string | null;
  image_url: string;
  category: string | null;
};

export default function GalleryClient({ initialItems }: { initialItems: GalleryItem[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    
    const result = await createGalleryItem(formData);
    setIsSaving(false);
    
    if (result.error) { alert(result.error); } else {
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this image?")) {
      const result = await deleteGalleryItem(id);
      if (result.error) alert("Error: " + result.error);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Image
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {initialItems.length === 0 ? (
          <div className="col-span-full py-8 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
            No images found.
          </div>
        ) : (
          initialItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
              <div className="aspect-square bg-gray-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image_url} alt={item.title || "Gallery image"} className="w-full h-full object-cover" />
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3">
                <p className="font-medium text-sm truncate">{item.title || "Untitled"}</p>
                <p className="text-xs text-gray-500">{item.category}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Add Image</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                <input type="url" name="image_url" required className="w-full px-4 py-2 rounded-lg border border-gray-300" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" name="title" className="w-full px-4 py-2 rounded-lg border border-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input type="text" name="category" defaultValue="General" className="w-full px-4 py-2 rounded-lg border border-gray-300" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="submit" disabled={isSaving} className="bg-primary text-white px-6 py-2 rounded-lg disabled:opacity-50">
                  {isSaving ? "Saving..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
