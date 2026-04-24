"use client";
import { useRouter } from 'next/navigation';

import { useState } from "react";
import { updateInquiryStatus, deleteInquiry } from "@/app/actions/inquiries";
import { Trash2, Eye, X } from "lucide-react";

type Inquiry = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  service_interested: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

export default function InquiriesClient({ initialInquiries }: { initialInquiries: Inquiry[] }) {
  const router = useRouter();
  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const result = await updateInquiryStatus(id, newStatus);
    if (result.error) alert("Error: " + result.error + "\nMake sure you ran the SQL RLS bypass script!");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this inquiry completely?")) {
      const result = await deleteInquiry(id);
      if (result.error) alert("Error: " + result.error);
      if (viewingInquiry?.id === id) setViewingInquiry(null);
    }
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Service</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {initialInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                initialInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">{new Date(inq.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{inq.name}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <div>{inq.phone}</div>
                      <div className="text-xs text-gray-400">{inq.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{inq.service_interested || "General"}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={inq.status} 
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                        className={`text-xs font-bold rounded-full px-2 py-1 outline-none border-0 cursor-pointer ${
                          inq.status === 'new' ? 'bg-blue-100 text-blue-700' :
                          inq.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setViewingInquiry(inq)}
                        className="text-primary hover:text-primary-800 p-2 inline-flex"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(inq.id)}
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

      {viewingInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Inquiry Details</h3>
              <button onClick={() => setViewingInquiry(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 font-medium">Received</p>
                <p className="text-gray-900">{new Date(viewingInquiry.created_at).toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Name</p>
                  <p className="text-gray-900 font-bold">{viewingInquiry.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Service Interested</p>
                  <p className="text-gray-900">{viewingInquiry.service_interested || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Phone</p>
                  <p className="text-gray-900"><a href={`tel:${viewingInquiry.phone}`} className="text-primary hover:underline">{viewingInquiry.phone}</a></p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Email</p>
                  <p className="text-gray-900">{viewingInquiry.email ? <a href={`mailto:${viewingInquiry.email}`} className="text-primary hover:underline">{viewingInquiry.email}</a> : "N/A"}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Message</p>
                <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap text-sm border border-gray-100">
                  {viewingInquiry.message || "No message provided."}
                </div>
              </div>
              
              <div className="pt-4 flex justify-between gap-3 border-t border-gray-100">
                <button 
                  onClick={() => handleDelete(viewingInquiry.id)}
                  className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Delete Inquiry
                </button>
                <button 
                  onClick={() => setViewingInquiry(null)}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
