import Image from "next/image";
import { CheckCircle2, HeartPulse, Award, Shield } from "lucide-react";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

export const revalidate = 3600; // ISR cache for 1 hour

export const metadata = {
  title: "About Us | TrueCare Health At Home",
  description: "Learn about our mission to provide the best home healthcare services.",
};

export default async function AboutPage() {
  const { data: settings } = await supabase.from("site_settings").select("key, value");
  
  const getSetting = (key: string, fallback: string) => {
    return settings?.find(s => s.key === key)?.value || fallback;
  };

  const aboutTitle = getSetting("about_title", "About TrueCare");
  const aboutSubtitle = getSetting("about_subtitle", "Committed to bringing professional, compassionate, and reliable healthcare directly to your home.");
  const aboutMissionP1 = getSetting("about_mission_p1", "At TrueCare, our mission is simple: to improve the quality of life for our patients by providing exceptional medical and non-medical care in the comfort of their own homes. We believe that healing happens best where you feel most comfortable.");
  const aboutMissionP2 = getSetting("about_mission_p2", "Founded by a team of dedicated healthcare professionals, we saw a gap between hospital discharge and full recovery. We bridge that gap by offering 24/7 support, highly trained staff, and personalized care plans tailored to every individual's unique needs.");
  const aboutImageUrl = getSetting("about_image_url", "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&q=80");

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-primary-900 py-16 lg:py-24 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">{aboutTitle}</h1>
          <p className="text-xl text-primary-200 max-w-2xl mx-auto">
            {aboutSubtitle}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {aboutMissionP1}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                {aboutMissionP2}
              </p>
              
              <div className="pt-4 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-gray-700 font-medium">
                  <CheckCircle2 className="w-6 h-6 text-green-500" /> Licensed & Certified Professionals
                </div>
                <div className="flex items-center gap-3 text-gray-700 font-medium">
                  <CheckCircle2 className="w-6 h-6 text-green-500" /> Personalized Care Plans
                </div>
                <div className="flex items-center gap-3 text-gray-700 font-medium">
                  <CheckCircle2 className="w-6 h-6 text-green-500" /> 24/7 Availability & Support
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-gray-100 relative">
                <Image 
                  src={aboutImageUrl}
                  alt="Nurse holding patient's hands" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-primary-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <HeartPulse className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Compassion</h3>
              <p className="text-gray-600">We treat every patient like our own family, delivering care with empathy, respect, and deep understanding.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-primary-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Safety & Trust</h3>
              <p className="text-gray-600">Your safety is our priority. All our staff undergo rigorous background checks and continuous medical training.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-primary-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Excellence</h3>
              <p className="text-gray-600">We strive for the highest standards in healthcare, constantly updating our protocols to ensure the best outcomes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-accent text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to join the TrueCare family?</h2>
          <p className="text-lg text-accent-100 mb-8 max-w-2xl mx-auto">
            Whether you need care for yourself or a loved one, we are here to help. Reach out to schedule a consultation.
          </p>
          <Link href="/contact" className="inline-block bg-white text-accent font-bold py-4 px-8 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  );
}