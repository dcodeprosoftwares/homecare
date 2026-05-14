import { getPlans } from "@/app/actions/plans";
import Link from "next/link";
import { Check, Shield } from "lucide-react";

export const metadata = {
  title: "Subscription Plans | TrueCare Health",
  description: "Explore our flexible and affordable home healthcare subscription plans designed for your needs.",
};

export default async function PlansPage() {
  const allPlans = await getPlans();
  const plans = allPlans.filter((plan) => plan.is_active);

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Choose the Right <span className="text-primary">Plan</span> for You
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Flexible home healthcare subscription plans tailored to provide peace of mind and continuous care.
          </p>
        </div>

        {plans.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <Shield className="w-16 h-16 text-primary/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Check Back Soon</h3>
            <p className="text-gray-600">
              We are currently updating our subscription plans. Please contact us directly for current offerings.
            </p>
            <div className="mt-8">
              <Link
                href="/contact"
                className="bg-primary text-white px-6 py-3 rounded-full font-semibold shadow-sm hover:bg-primary-700 transition-colors"
              >
                Contact Us
              </Link>
            </div>
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
                  className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow flex flex-col relative overflow-hidden group"
                >
                  {/* Decorative background glow */}
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors"></div>

                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    {plan.description && (
                      <p className="text-gray-600 mb-6 min-h-[3rem]">{plan.description}</p>
                    )}
                    
                    <div className="mb-8 flex items-baseline gap-2">
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

                  <div className="mt-auto relative z-10 pt-6 border-t border-gray-100">
                    <Link
                      href={`/contact?subject=Interested in ${encodeURIComponent(plan.name)} Plan`}
                      className="block w-full py-3 px-6 text-center rounded-xl bg-primary text-white font-semibold hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md"
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
    </div>
  );
}
