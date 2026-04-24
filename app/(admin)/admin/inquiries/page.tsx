import { getInquiries } from "@/app/actions/inquiries";
import InquiriesClient from "./InquiriesClient";

export default async function InquiriesAdminPage() {
  const inquiries = await getInquiries();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Contact Inquiries</h1>
      </div>
      
      <InquiriesClient initialInquiries={inquiries} />
    </div>
  );
}