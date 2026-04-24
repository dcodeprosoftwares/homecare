import { getTestimonials } from "@/app/actions/testimonials";
import TestimonialsClient from "./TestimonialsClient";

export default async function TestimonialsAdminPage() {
  const items = await getTestimonials();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Testimonials</h1>
      </div>
      
      <TestimonialsClient initialItems={items} />
    </div>
  );
}