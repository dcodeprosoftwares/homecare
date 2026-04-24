import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, HeartPulse, Activity, Users, Star, PhoneCall, Shield, Clock } from "lucide-react";
import { getServices } from "@/app/actions/services";

export const revalidate = 3600;

// Fallback icons map
const IconMap: Record<string, any> = {
  HeartPulse, Activity, Users, Shield, Clock
};

export default async function Home() {
  const services = await getServices();
  const activeServices = services.filter((s: any) => s.is_active);

  // Fetch settings for the contact phone
  const { supabase } = await import("@/lib/supabase");
  const { data: settings } = await supabase.from("site_settings").select("key, value");
  const contactPhone = settings?.find(s => s.key === "contact_phone")?.value || "1234567890";

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-primary-50 py-20 lg:py-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-800 font-medium text-sm mb-4">
              <HeartPulse className="w-4 h-4" />
              Trusted Care at Home
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
              Professional healthcare, right in your <span className="text-primary">comfort zone.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
              We bring hospital-quality healthcare to your doorstep. Experience compassionate, personalized care from certified professionals without leaving your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link
                href="/contact"
                className="inline-flex justify-center items-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-accent-dark transition-all hover:-translate-y-1"
              >
                Book Free Assessment <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/services"
                className="inline-flex justify-center items-center gap-2 rounded-full bg-white border-2 border-primary-100 px-8 py-4 text-base font-bold text-primary shadow-sm hover:bg-primary-50 transition-all"
              >
                Explore Services
              </Link>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-8 text-sm font-medium text-gray-500">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> 24/7 Support
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> Certified Staff
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> 500+ Happy Patients
              </div>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative bg-primary-200 group">
              <Image 
                src="/hero-nurse.png"
                alt="Female Indian nurse caring for male elderly patient at home"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent"></div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce">
              <div className="bg-accent-100 p-3 rounded-full text-accent-700">
                <Star className="w-8 h-8 fill-accent" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">4.9/5 Rating</p>
                <p className="text-xs text-gray-500">Based on 200+ reviews</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-primary-100 rounded-full blur-3xl opacity-50 -z-10"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-accent-100 rounded-full blur-3xl opacity-50 -z-10"></div>
      </section>

      {/* Quick Services Overview */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-2">Our Expertise</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Comprehensive Home Care Services</h3>
            <p className="text-lg text-gray-600">We offer a wide range of medical and non-medical services tailored to meet your specific needs in the comfort of your home.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeServices.slice(0, 3).map((service: any) => {
              const IconComponent = IconMap[service.icon || 'HeartPulse'] || HeartPulse;
              return (
                <div key={service.id} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow group flex flex-col">
                  <div className="w-14 h-14 bg-primary-50 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h4>
                  <p className="text-gray-600 mb-6 flex-1">{service.description}</p>
                  <Link href="/services" className="text-primary font-semibold flex items-center gap-2 group-hover:text-accent transition-colors mt-auto">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Link href="/services" className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary-800 underline underline-offset-4">
              View all services
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="mx-auto max-w-4xl px-4 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to experience better care?</h2>
          <p className="text-xl text-primary-200 mb-10 max-w-2xl mx-auto">
            Schedule a free, no-obligation assessment today and let us create a customized care plan for you or your loved ones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link
                href="/contact"
                className="inline-flex justify-center items-center rounded-full bg-accent px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-accent-dark transition-all"
              >
                Book Free Assessment
              </Link>
              <a
                href={`tel:${contactPhone.replace(/[^0-9+]/g, '')}`}
                className="inline-flex justify-center items-center gap-2 rounded-full bg-white/10 px-8 py-4 text-lg font-bold text-white border border-white/20 hover:bg-white/20 transition-all"
              >
                <PhoneCall className="w-5 h-5" /> Call Us Now
              </a>
          </div>
        </div>
      </section>
    </div>
  );
}
