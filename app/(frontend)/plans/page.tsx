import { getPlans } from "@/app/actions/plans";
import Link from "next/link";
import { Check, Shield, PhoneCall } from "lucide-react";
import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Subscription Plans | TrueCare Health",
  description: "Explore our flexible and affordable home healthcare subscription plans designed for your needs.",
  alternates: {
    canonical: canonicalUrl("/plans"),
  },
};

export default async function PlansPage() {
  const allPlans = await getPlans();
  const plans = allPlans.filter((plan) => plan.is_active);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-primary-900 py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Subscription Plans</h1>
          <p className="text-xl text-primary-200 max-w-2xl mx-auto">
            Flexible home healthcare subscription plans tailored to provide peace of mind and continuous care.
          </p>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {plans.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
              <Shield className="w-16 h-16 text-primary/20 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Check Back Soon</h3>
              <p className="text-gray-500">
                We are currently updating our subscription plans. Please contact us directly for current offerings.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans.map((plan) => {
                const featuresList = plan.features
                  ? plan.features.split("\n").filter((f: string) => f.trim() !== "")
                  : [];

                return (
                  <div
                    key={plan.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-shadow relative group"
                  >
                    {/* Decorative background glow */}
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors"></div>

                    <div className="p-8 flex-1 flex flex-col relative z-10">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      {plan.description && (
                        <p className="text-gray-600 mb-6 min-h-[3rem]">{plan.description}</p>
                      )}
                      
                      <div className="mb-8 flex items-baseline gap-2 pb-6 border-b border-gray-100">
                        <span className="text-4xl font-extrabold text-primary">{plan.price}</span>
                      </div>

                      <ul className="space-y-4 mb-8 flex-1">
                        {featuresList.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                            <span className="text-gray-700">{feature.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gray-50 p-6 border-t border-gray-100 mt-auto relative z-10">
                      <Link
                        href={`/contact?subject=Interested in ${encodeURIComponent(plan.name)} Plan`}
                        className="flex items-center justify-center w-full py-3 px-4 bg-primary text-white border border-transparent rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md"
                      >
                        Choose Plan
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Not sure which plan is right for you?</h2>
          <p className="text-lg text-gray-600 mb-8">Contact our medical consultants to help you decide.</p>
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
