import { getServices } from "@/app/actions/services";
import ServicesClient from "./ServicesClient";

export default async function ServicesAdminPage() {
  const services = await getServices();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Services</h1>
      </div>
      
      <ServicesClient initialServices={services} />
    </div>
  );
}