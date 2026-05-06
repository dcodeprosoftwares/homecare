import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import JsonLd from "@/components/JsonLd";
import { supabase } from "@/lib/supabase";
import {
  generateLocalBusinessJsonLd,
  generateWebsiteJsonLd,
} from "@/lib/seo";

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: settings } = await supabase.from("site_settings").select("key, value");
  const getSetting = (key: string, fallback: string) =>
    settings?.find(s => s.key === key)?.value || fallback;

  const logoUrl = getSetting("logo_url", "");
  const contactPhone = getSetting("contact_phone", "1234567890");
  const contactEmail = getSetting("contact_email", "info@truecare.com");
  const address = getSetting("address", "Dehradun, Uttarakhand");

  // Structured Data for every frontend page
  const localBusinessData = generateLocalBusinessJsonLd({
    phone: contactPhone,
    email: contactEmail,
    address: address,
  });
  const websiteData = generateWebsiteJsonLd();

  return (
    <>
      <JsonLd data={localBusinessData} />
      <JsonLd data={websiteData} />
      <Header logoUrl={logoUrl} contactPhone={contactPhone} />
      <main className="flex-grow flex flex-col">{children}</main>
      <WhatsAppButton />
      <Footer />
    </>
  );
}
