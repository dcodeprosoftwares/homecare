"use client";

import { Save } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { updateSettings } from "@/app/actions/settings";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    logo_url: "",
    whatsapp_number: "1234567890",
    contact_phone: "+1 (234) 567-890",
    contact_email: "info@truecare.com",
    address: "123 Healthcare Ave, Medical District, City, State 12345",
    footer_text: "Providing professional, compassionate, and reliable healthcare services directly in the comfort of your home.",
    about_title: "About TrueCare",
    about_subtitle: "Committed to bringing professional, compassionate, and reliable healthcare directly to your home.",
    about_mission_p1: "At TrueCare, our mission is simple: to improve the quality of life for our patients by providing exceptional medical and non-medical care in the comfort of their own homes. We believe that healing happens best where you feel most comfortable.",
    about_mission_p2: "Founded by a team of dedicated healthcare professionals, we saw a gap between hospital discharge and full recovery. We bridge that gap by offering 24/7 support, highly trained staff, and personalized care plans tailored to every individual's unique needs.",
    about_image_url: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&q=80",
    contact_subtitle: "Have questions about our home care services? We're here to help. Reach out to us today to schedule your free assessment.",
    contact_working_hours: "24/7 Available for Emergencies\nOffice: 9 AM - 6 PM",
    privacy_policy: "This is the Privacy Policy. Update it in the Admin Settings."
  });

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase.from('site_settings').select('key, value');
      if (data && !error) {
        const newSettings = { ...settings };
        data.forEach(item => {
          if (item.key in newSettings) {
            // @ts-ignore
            newSettings[item.key] = item.value;
          }
        });
        setSettings(newSettings);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await updateSettings(settings);
    
    setLoading(false);
    if (result.error) {
      alert("Error: " + result.error + "\nMake sure you ran the SQL RLS bypass script!");
    } else {
      alert("Settings saved successfully!");
      window.location.reload(); // Force full reload to bypass any layout cache
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-gray-500 mt-1">Manage global website settings like contact info and footer details.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <form onSubmit={handleSave}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Contact & Footer Information</h2>
            <p className="text-sm text-gray-500 mt-1">These details will be displayed across the website.</p>
          </div>
          
          <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700 mb-1">Logo URL (Optional)</label>
              <input 
                type="text" 
                id="logo_url" 
                name="logo_url" 
                value={settings.logo_url}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                placeholder="https://example.com/logo.png"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to use the default text logo.</p>
            </div>
            <div>
              <label htmlFor="whatsapp_number" className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input 
                type="text" 
                id="whatsapp_number" 
                name="whatsapp_number" 
                value={settings.whatsapp_number}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
              />
              <p className="text-xs text-gray-500 mt-1">Include country code without +, e.g., 1234567890</p>
            </div>
            <div>
              <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              <input 
                type="text" 
                id="contact_phone" 
                name="contact_phone" 
                value={settings.contact_phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
            <input 
              type="email" 
              id="contact_email" 
              name="contact_email" 
              value={settings.contact_email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
            <input 
              type="text" 
              id="address" 
              name="address" 
              value={settings.address}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
            />
          </div>

          <div>
            <label htmlFor="footer_text" className="block text-sm font-medium text-gray-700 mb-1">Footer Description</label>
            <textarea 
              id="footer_text" 
              name="footer_text" 
              rows={3}
              value={settings.footer_text}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none" 
            ></textarea>
          </div>
        </div>
        </div>
        
        {/* About Page Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">About Us Page</h2>
            <p className="text-sm text-gray-500 mt-1">Manage the content displayed on the About Us page.</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="about_title" className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                <input type="text" id="about_title" name="about_title" value={settings.about_title} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
              </div>
              <div>
                <label htmlFor="about_subtitle" className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                <input type="text" id="about_subtitle" name="about_subtitle" value={settings.about_subtitle} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
              </div>
            </div>
            <div>
              <label htmlFor="about_mission_p1" className="block text-sm font-medium text-gray-700 mb-1">Mission Paragraph 1</label>
              <textarea id="about_mission_p1" name="about_mission_p1" rows={3} value={settings.about_mission_p1} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"></textarea>
            </div>
            <div>
              <label htmlFor="about_mission_p2" className="block text-sm font-medium text-gray-700 mb-1">Mission Paragraph 2</label>
              <textarea id="about_mission_p2" name="about_mission_p2" rows={3} value={settings.about_mission_p2} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"></textarea>
            </div>
            <div>
              <label htmlFor="about_image_url" className="block text-sm font-medium text-gray-700 mb-1">About Us Image URL</label>
              <input type="text" id="about_image_url" name="about_image_url" value={settings.about_image_url} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="https://images.unsplash.com/..." />
            </div>
          </div>
        </div>

        {/* Contact Page Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Contact Us Page</h2>
            <p className="text-sm text-gray-500 mt-1">Manage the specific text on the Contact Us page.</p>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="contact_subtitle" className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
              <textarea id="contact_subtitle" name="contact_subtitle" rows={2} value={settings.contact_subtitle} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"></textarea>
            </div>
            <div>
              <label htmlFor="contact_working_hours" className="block text-sm font-medium text-gray-700 mb-1">Working Hours (Use newline for separate lines)</label>
              <textarea id="contact_working_hours" name="contact_working_hours" rows={2} value={settings.contact_working_hours} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* Legal Pages Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Legal Pages</h2>
            <p className="text-sm text-gray-500 mt-1">Manage Privacy Policy and other legal text.</p>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="privacy_policy" className="block text-sm font-medium text-gray-700 mb-1">Privacy Policy Text</label>
              <textarea id="privacy_policy" name="privacy_policy" rows={10} value={settings.privacy_policy} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-y"></textarea>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="bg-primary text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-primary-700 transition-colors disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            <Save className="w-5 h-5" />
            {loading ? "Saving..." : "Save All Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
