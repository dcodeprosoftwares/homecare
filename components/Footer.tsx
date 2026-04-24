import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function Footer() {
  const { data: settings } = await supabase
    .from("site_settings")
    .select("key, value");

  const getSetting = (key: string, fallback: string) => {
    return settings?.find(s => s.key === key)?.value || fallback;
  };

  const footerText = getSetting("footer_text", "Providing professional, compassionate, and reliable healthcare services directly in the comfort of your home.");
  const address = getSetting("address", "123 Healthcare Ave, Medical District, City, State 12345");
  const phone = getSetting("contact_phone", "+1 (234) 567-890");
  const email = getSetting("contact_email", "info@truecare.com");
  const logoUrl = getSetting("logo_url", "");

  return (
    <footer className="bg-primary-900 text-white pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              {logoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={logoUrl} alt="TrueCare Logo" className="h-12 w-auto object-contain brightness-0 invert" />
              ) : (
                <div className="text-2xl font-bold flex items-center text-white">
                  <span className="text-accent text-3xl mr-1">+</span> TrueCare
                </div>
              )}
            </Link>
            <p className="text-primary-200 text-sm leading-relaxed max-w-xs">
              {footerText}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "About Us", href: "/about" },
                { name: "Services", href: "/services" },
                { name: "Career", href: "/career" },
                { name: "Gallery", href: "/gallery" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-primary-200 hover:text-accent transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-3">
              {[
                { name: "Blogs", href: "/blogs" },
                { name: "Testimonials", href: "/testimonials" },
                { name: "Contact Us", href: "/contact" },
                { name: "Privacy Policy", href: "/privacy" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-primary-200 hover:text-accent transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-primary-200 text-sm">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3 text-primary-200 text-sm">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">{phone}</a>
              </li>
              <li className="flex items-center gap-3 text-primary-200 text-sm">
                {/* Custom WhatsApp Icon using SVG to avoid extra imports, or just use Phone icon */}
                <svg className="w-5 h-5 text-green-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                <a href={`https://wa.me/${getSetting("whatsapp_number", "1234567890").replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  WhatsApp Us
                </a>
              </li>
              <li className="flex items-center gap-3 text-primary-200 text-sm">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-300 text-sm">
            &copy; {new Date().getFullYear()} TrueCare Health At Home. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
