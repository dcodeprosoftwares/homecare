"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { submitInquiry } from "@/app/actions/contact";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    
    const result = await submitInquiry({
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      service: formData.get("service") as string,
      message: formData.get("message") as string,
    });

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } else {
      setError(result.error || "Failed to submit. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-start gap-3 border border-green-100 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Message sent successfully!</p>
            <p className="text-sm opacity-90">We will get back to you as soon as possible.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-start gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Failed to send</p>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
          <input type="text" id="name" name="name" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="John Doe" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
          <input type="tel" id="phone" name="phone" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="+1 (234) 567-890" />
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <input type="email" id="email" name="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="john@example.com" />
      </div>
      
      <div className="mb-6">
        <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">Service Interested In</label>
        <select id="service" name="service" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white">
          <option value="">Select a service</option>
          <option value="Nursing Care">Nursing Care</option>
          <option value="Elderly Care">Elderly Care</option>
          <option value="Physiotherapy">Physiotherapy</option>
          <option value="Post-Surgical Care">Post-Surgical Care</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div className="mb-8">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
        <textarea id="message" name="message" rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none" placeholder="How can we help you?"></textarea>
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-accent text-white font-bold py-4 rounded-xl hover:bg-accent-dark transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending Message...
          </>
        ) : (
          "Submit Inquiry"
        )}
      </button>
    </form>
  );
}
