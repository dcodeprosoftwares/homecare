"use client";
import { useRouter } from 'next/navigation';

import { useState } from "react";
import { createCareer, updateCareer, deleteCareer } from "@/app/actions/careers";
import { Edit, Trash2, Plus, X } from "lucide-react";

type Career = {
  id: string;
  job_title: string;
  slug: string;
  location: string;
  employment_type: string;
  description: string;
  requirements: string | null;
  is_active: boolean;
};

export default function CareersClient({ initialCareers }: { initialCareers: Career[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenModal = (career?: Career) => {
    if (career) {
      setEditingCareer(career);
    } else {
      setEditingCareer(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCareer(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    
    let result;
    if (editingCareer) {
      result = await updateCareer(editingCareer.id, formData);
    } else {
      result = await createCareer(formData);
    }

    setIsSaving(false);
    if (result.error) { alert(result.error); } else {
      handleCloseModal();
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      const result = await deleteCareer(id);
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
          <Plus className="w-4 h-4" /> Add New Job
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Job Title</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Type</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {initialCareers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No job postings found. Click "Add New Job" to create one.
                  </td>
                </tr>
              ) : (
                initialCareers.map((career) => (
                  <tr key={career.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{career.job_title}</td>
                    <td className="px-6 py-4 text-gray-600">{career.location}</td>
                    <td className="px-6 py-4 text-gray-600 hidden md:table-cell">{career.employment_type}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        career.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {career.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleOpenModal(career)}
                        className="text-primary hover:text-primary-800 p-2 inline-flex"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(career.id)}
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                {editingCareer ? "Edit Job Posting" : "Add New Job"}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="job_title" className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                  <input 
                    type="text" 
                    id="job_title" 
                    name="job_title" 
                    required 
                    defaultValue={editingCareer?.job_title}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input 
                    type="text" 
                    id="location" 
                    name="location" 
                    required 
                    defaultValue={editingCareer?.location}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                  />
                </div>
              </div>

              <div>
                <label htmlFor="employment_type" className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                <select 
                  id="employment_type" 
                  name="employment_type" 
                  defaultValue={editingCareer?.employment_type || "Full-time"}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white" 
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
                <textarea 
                  id="description" 
                  name="description" 
                  required 
                  rows={4}
                  defaultValue={editingCareer?.description}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-y" 
                ></textarea>
              </div>

              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                <textarea 
                  id="requirements" 
                  name="requirements" 
                  rows={4}
                  defaultValue={editingCareer?.requirements || ""}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-y" 
                ></textarea>
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="is_active" 
                  name="is_active" 
                  defaultChecked={editingCareer ? editingCareer.is_active : true}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active (Visible on Career Page)</label>
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
                  {isSaving ? "Saving..." : "Save Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
