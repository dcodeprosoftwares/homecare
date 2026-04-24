import { supabase } from "@/lib/supabase";

export const revalidate = 3600; // ISR cache for 1 hour

export const metadata = {
  title: "Privacy Policy | TrueCare Health At Home",
  description: "Privacy Policy for TrueCare Health At Home.",
};

export default async function PrivacyPage() {
  const { data: settings } = await supabase.from("site_settings").select("key, value");
  
  const privacyPolicy = settings?.find(s => s.key === "privacy_policy")?.value || "This is the Privacy Policy. Update it in the Admin Settings.";

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-primary-900 py-16 relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl font-extrabold text-white">Privacy Policy</h1>
        </div>
      </section>

      <section className="py-16 bg-white flex-1">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 prose prose-lg prose-primary">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {privacyPolicy}
          </div>
        </div>
      </section>
    </div>
  );
}
