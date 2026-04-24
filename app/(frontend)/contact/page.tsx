import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ContactForm from "@/components/ContactForm";

export const revalidate = 3600; // ISR cache for 1 hour

export default async function ContactPage() {
  const { data: settings } = await supabase.from("site_settings").select("key, value");
  
  const getSetting = (key: string, fallback: string) => {
    return settings?.find(s => s.key === key)?.value || fallback;
  };

  const contactSubtitle = getSetting("contact_subtitle", "Have questions about our home care services? We're here to help. Reach out to us today to schedule your free assessment.");
  const contactPhone = getSetting("contact_phone", "+1 (234) 567-890");
  const contactEmail = getSetting("contact_email", "info@truecare.com");
  const address = getSetting("address", "123 Healthcare Ave, Medical District, City, State 12345");
  const workingHours = getSetting("contact_working_hours", "24/7 Available for Emergencies\nOffice: 9 AM - 6 PM");

  return (
    <div className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600">{contactSubtitle}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Get In Touch</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4 text-gray-600">
                  <div className="bg-primary-50 p-3 rounded-xl text-primary shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <strong className="block text-gray-900 mb-1">Our Location</strong>
                    <span>
                      {address.split('\n').map((line: string, i: number) => (
                        <span key={i}>{line}<br /></span>
                      ))}
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-4 text-gray-600">
                  <div className="bg-primary-50 p-3 rounded-xl text-primary shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <strong className="block text-gray-900 mb-1">Phone Number</strong>
                    <a href={`tel:${contactPhone.replace(/[^0-9+]/g, '')}`} className="hover:text-primary transition-colors">{contactPhone}</a>
                  </div>
                </li>
                <li className="flex items-start gap-4 text-gray-600">
                  <div className="bg-primary-50 p-3 rounded-xl text-primary shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <strong className="block text-gray-900 mb-1">Email Address</strong>
                    <a href={`mailto:${contactEmail}`} className="hover:text-primary transition-colors">{contactEmail}</a>
                  </div>
                </li>
                <li className="flex items-start gap-4 text-gray-600">
                  <div className="bg-primary-50 p-3 rounded-xl text-primary shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <strong className="block text-gray-900 mb-1">Working Hours</strong>
                    <span>
                      {workingHours.split('\n').map((line: string, i: number) => (
                        <span key={i}>{line}<br /></span>
                      ))}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}