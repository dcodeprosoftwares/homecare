import { getPlans } from "@/app/actions/plans";
import PlansClient from "./PlansClient";

export default async function PlansAdminPage() {
  const plans = await getPlans();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Plans</h1>
      </div>
      
      <PlansClient initialPlans={plans} />
    </div>
  );
}
