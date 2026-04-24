import { getCareers } from "@/app/actions/careers";
import CareersClient from "./CareersClient";

export default async function CareersAdminPage() {
  const careers = await getCareers();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Careers</h1>
      </div>
      
      <CareersClient initialCareers={careers} />
    </div>
  );
}