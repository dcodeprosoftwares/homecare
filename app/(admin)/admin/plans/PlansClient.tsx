"use client";
import { useRouter } from 'next/navigation';

import { useState } from "react";
import { createPlan, updatePlan, deletePlan } from "@/app/actions/plans";
import { Edit, Trash2, Plus, X } from "lucide-react";

type Plan = {
  id: string;
  name: string;
  price: string;
  description: string | null;
  features: string | null;
  is_active: boolean;
};

export default function PlansClient({ initialPlans }: { initialPlans: Plan[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenModal = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan);
    } else {
      setEditingPlan(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    
    let result;
    if (editingPlan) {
      result = await updatePlan(editingPlan.id, formData);
    } else {
      result = await createPlan(formData);
    }

    setIsSaving(false);
    if (result.error) { alert(result.error); } else {
      handleCloseModal();
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      const result = await deletePlan(id);
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
          <Plus className="w-4 h-4" /> Add New Plan
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Description</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {initialPlans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No plans found. Click "Add New Plan" to create one.
                  </td>
                </tr>
              ) : (
                initialPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{plan.name}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{plan.price}</td>
                    <td className="px-6 py-4 text-gray-600 hidden md:table-cell max-w-xs truncate">
                      {plan.description}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        plan.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {plan.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleOpenModal(plan)}
                        className="text-primary hover:text-primary-800 p-2 inline-flex"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(plan.id)}
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
                {editingPlan ? "Edit Plan" : "Add New Plan"}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    defaultValue={editingPlan?.name}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                    placeholder="e.g. Basic Plan"
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input 
                    type="text" 
                    id="price" 
                    name="price" 
                    required 
                    defaultValue={editingPlan?.price}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                    placeholder="e.g. ₹999 / month"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <textarea 
                  id="description" 
                  name="description" 
                  rows={2}
                  defaultValue={editingPlan?.description || ""}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none" 
                  placeholder="Brief summary of the plan"
                ></textarea>
              </div>

              <div>
                <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-1">Features (One per line)</label>
                <textarea 
                  id="features" 
                  name="features" 
                  rows={5}
                  defaultValue={editingPlan?.features || ""}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-y" 
                  placeholder="24/7 Support&#10;Monthly Checkup&#10;Free Medicines"
                ></textarea>
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="is_active" 
                  name="is_active" 
                  defaultChecked={editingPlan ? editingPlan.is_active : true}
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
                  {isSaving ? "Saving..." : "Save Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
