import { getCareers } from "@/app/actions/careers";
import Link from "next/link";
import { Briefcase, MapPin, Clock } from "lucide-react";

export const revalidate = 3600;

export const metadata = {
  title: "Careers | TrueCare Health At Home",
  description: "Join our team of dedicated healthcare professionals.",
};

export default async function CareerPage() {
  const careers = await getCareers();
  const activeCareers = careers.filter((c: any) => c.is_active);

  return (
    <div className="flex flex-col">
      <section className="bg-primary-900 py-16 lg:py-24 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Join Our Team</h1>
          <p className="text-xl text-primary-200 max-w-2xl mx-auto">
            Make a difference in people's lives every day. We are always looking for compassionate professionals.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {activeCareers.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Open Positions Currently</h3>
                <p>Please check back later or send us your resume to be considered for future openings.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {activeCareers.map((job: any) => (
                  <div key={job.id} className="p-6 md:p-8 hover:bg-primary-50 transition-colors flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.job_title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.employment_type}</span>
                      </div>
                      <p className="text-gray-700">{job.description}</p>
                      {job.requirements && (
                        <div className="mt-4">
                          <strong className="text-sm text-gray-900">Requirements:</strong>
                          <p className="text-sm text-gray-600 mt-1">{job.requirements}</p>
                        </div>
                      )}
                    </div>
                    <div className="md:w-auto w-full">
                      <Link 
                        href={`mailto:careers@truecare.com?subject=Application for ${job.job_title}`}
                        className="block w-full md:w-auto text-center px-6 py-3 bg-accent text-white font-bold rounded-lg hover:bg-accent-dark transition-colors"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}