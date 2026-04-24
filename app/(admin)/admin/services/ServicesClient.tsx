"use client";
import { useRouter } from 'next/navigation';

import { useState } from "react";
import { createService, updateService, deleteService } from "@/app/actions/services";
import { Edit, Trash2, Plus, X } from "lucide-react";

type Service = {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string | null;
  content: string | null;
  is_active: boolean;
};

export default function ServicesClient({ initialServices }: { initialServices: Service[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Simplified optimistic UI or just relying on Server Action revalidation
  
  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
    } else {
      setEditingService(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    
    let result;
    if (editingService) {
      result = await updateService(editingService.id, formData);
    } else {
      result = await createService(formData);
    }

    setIsSaving(false);
    if (result.error) { alert(result.error); } else {
      handleCloseModal();
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      const result = await deleteService(id);
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
          <Plus className="w-4 h-4" /> Add New Service
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Description</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {initialServices.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No services found. Click "Add New Service" to create one.
                  </td>
                </tr>
              ) : (
                initialServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{service.title}</td>
                    <td className="px-6 py-4 text-gray-600 hidden md:table-cell max-w-xs truncate">
                      {service.description}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        service.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {service.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleOpenModal(service)}
                        className="text-primary hover:text-primary-800 p-2 inline-flex"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(service.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                {editingService ? "Edit Service" : "Add New Service"}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Service Title *</label>
                <input 
                  type="text" 
                  id="title" 
                  name="title" 
                  required 
                  defaultValue={editingService?.title}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                  placeholder="e.g. Nursing Care"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
                <textarea 
                  id="description" 
                  name="description" 
                  required 
                  rows={2}
                  defaultValue={editingService?.description}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none" 
                  placeholder="Brief summary of the service"
                ></textarea>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Full Details</label>
                <textarea 
                  id="content" 
                  name="content" 
                  rows={5}
                  defaultValue={editingService?.content || ""}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-y" 
                  placeholder="Detailed description for the service page..."
                ></textarea>
              </div>

              <div>
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">Icon Name</label>
                <input 
                  type="text" 
                  id="icon" 
                  name="icon" 
                  defaultValue={editingService?.icon || ""}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                  placeholder="e.g. HeartPulse"
                />
                <p className="text-xs text-gray-500 mt-1">Lucide icon name to display on the frontend.</p>
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="is_active" 
                  name="is_active" 
                  defaultChecked={editingService ? editingService.is_active : true}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active (Visible on website)</label>
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
                  {isSaving ? "Saving..." : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
