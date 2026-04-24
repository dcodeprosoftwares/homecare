import { getServices } from "@/app/actions/services";
import Link from "next/link";
import { ArrowRight, Activity, HeartPulse, Users, Shield, Clock, PhoneCall } from "lucide-react";

// Fallback icons map
const IconMap: Record<string, any> = {
  HeartPulse, Activity, Users, Shield, Clock
};

export const revalidate = 3600;

export const metadata = {
  title: "Our Services | TrueCare Health At Home",
  description: "Comprehensive home healthcare services tailored to your needs.",
};

export default async function ServicesPage() {
  const services = await getServices();
  const activeServices = services.filter((s: any) => s.is_active);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-primary-900 py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Our Services</h1>
          <p className="text-xl text-primary-200 max-w-2xl mx-auto">
            Professional, compassionate healthcare delivered right to your doorstep. Explore our comprehensive care options.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {activeServices.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Services Available Yet</h3>
              <p className="text-gray-500">Please check back later or contact us directly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeServices.map((service: any) => {
                const IconComponent = IconMap[service.icon || 'HeartPulse'] || HeartPulse;
                return (
                  <div key={service.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-shadow group">
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="w-14 h-14 bg-primary-50 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                      <p className="text-gray-600 mb-6 flex-1">{service.description}</p>
                      
                      {service.content && (
                        <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500 line-clamp-3">
                          {service.content}
                        </div>
                      )}
                    </div>
                    <div className="bg-gray-50 p-6 border-t border-gray-100 mt-auto">
                      <Link 
                        href="/contact" 
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white border border-gray-200 rounded-xl font-semibold text-gray-900 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                      >
                        Book this Service <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Not sure which service you need?</h2>
          <p className="text-lg text-gray-600 mb-8">Contact our medical consultants for a free assessment.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="rounded-full bg-accent px-8 py-3 font-bold text-white shadow hover:bg-accent-dark transition-colors">
              Contact Us
            </Link>
            <a href="tel:+1234567890" className="rounded-full bg-primary-50 px-8 py-3 font-bold text-primary flex items-center justify-center gap-2 hover:bg-primary-100 transition-colors">
              <PhoneCall className="w-5 h-5" /> Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}