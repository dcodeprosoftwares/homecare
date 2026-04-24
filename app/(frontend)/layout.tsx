import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { supabase } from "@/lib/supabase";

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: settings } = await supabase.from("site_settings").select("key, value");
  const logoUrl = settings?.find(s => s.key === "logo_url")?.value || "";
  const contactPhone = settings?.find(s => s.key === "contact_phone")?.value || "1234567890";

  return (
    <>
      <Header logoUrl={logoUrl} contactPhone={contactPhone} />
      <main className="flex-grow flex flex-col">{children}</main>
      <WhatsAppButton />
      <Footer />
    </>
  );
}
