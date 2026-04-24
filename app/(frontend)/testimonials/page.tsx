import { getTestimonials } from "@/app/actions/testimonials";
import { Star, Quote } from "lucide-react";

export const revalidate = 3600;

export const metadata = {
  title: "Testimonials | TrueCare Health At Home",
  description: "Read what our patients and their families have to say about our care.",
};

export default async function TestimonialsPage() {
  const items = await getTestimonials();

  return (
    <div className="flex flex-col">
      <section className="bg-primary-900 py-16 lg:py-24 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Patient Testimonials</h1>
          <p className="text-xl text-primary-200 max-w-2xl mx-auto">
            Real stories from the families we've had the privilege to serve.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Testimonials Yet</h3>
              <p className="text-gray-500">Check back soon for patient stories.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item: any) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col relative">
                  <Quote className="absolute top-6 right-6 w-12 h-12 text-primary-50 opacity-50" />
                  <div className="flex gap-1 mb-6 text-accent">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-8 flex-1 text-lg leading-relaxed">"{item.content}"</p>
                  <div className="border-t border-gray-100 pt-6">
                    <p className="font-bold text-gray-900 text-lg">{item.author_name}</p>
                    <p className="text-sm text-gray-500">TrueCare Patient/Family</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}