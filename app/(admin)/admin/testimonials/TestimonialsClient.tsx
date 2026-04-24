"use client";
import { useRouter } from 'next/navigation';

import { useState } from "react";
import { createTestimonial, deleteTestimonial } from "@/app/actions/testimonials";
import { Trash2, Plus, X, Star } from "lucide-react";

type Testimonial = {
  id: string;
  author_name: string;
  content: string;
  rating: number;
};

export default function TestimonialsClient({ initialItems }: { initialItems: Testimonial[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    
    const result = await createTestimonial(formData);
    setIsSaving(false);
    
    if (result.error) { alert(result.error); } else {
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this testimonial?")) {
      const result = await deleteTestimonial(id);
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
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialItems.length === 0 ? (
          <div className="col-span-full py-8 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
            No testimonials found.
          </div>
        ) : (
          initialItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <div className="flex gap-1 mb-4 text-accent">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-6 flex-1">"{item.content}"</p>
              <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                <p className="font-bold text-gray-900">- {item.author_name}</p>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Add Testimonial</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author Name *</label>
                <input type="text" name="author_name" required className="w-full px-4 py-2 rounded-lg border border-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea name="content" required rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-300 resize-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                <input type="number" name="rating" min="1" max="5" defaultValue="5" required className="w-full px-4 py-2 rounded-lg border border-gray-300" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="submit" disabled={isSaving} className="bg-primary text-white px-6 py-2 rounded-lg disabled:opacity-50">
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
