-- Supabase Schema for TrueCare Health At Home

-- 1. Services Table
CREATE TABLE public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon TEXT, -- e.g., 'HeartPulse'
    content TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Careers Table
CREATE TABLE public.careers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    location TEXT NOT NULL,
    employment_type TEXT DEFAULT 'Full-time',
    description TEXT NOT NULL,
    requirements TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Gallery Table
CREATE TABLE public.gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    title TEXT,
    category TEXT DEFAULT 'General',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Blogs Table
CREATE TABLE public.blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image TEXT,
    author_name TEXT DEFAULT 'TrueCare Team',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Testimonials Table
CREATE TABLE public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Contact Inquiries Table
CREATE TABLE public.contact_inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    service_interested TEXT,
    message TEXT,
    status TEXT DEFAULT 'new', -- new, contacted, resolved
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Setup Row Level Security (RLS)
-- By default, for a CMS, we often want public read access and authenticated write access.
-- We'll enable RLS on all tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public read access to content
CREATE POLICY "Public profiles are viewable by everyone." ON public.services FOR SELECT USING (true);
CREATE POLICY "Public profiles are viewable by everyone." ON public.careers FOR SELECT USING (true);
CREATE POLICY "Public profiles are viewable by everyone." ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Public profiles are viewable by everyone." ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Public profiles are viewable by everyone." ON public.testimonials FOR SELECT USING (true);

-- Allow public to insert contact inquiries
CREATE POLICY "Anyone can submit an inquiry" ON public.contact_inquiries FOR INSERT WITH CHECK (true);

-- 7. Site Settings Table (For CMS Footer/WhatsApp changes)
CREATE TABLE public.site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Default Settings
INSERT INTO public.site_settings (key, value, description) VALUES
    ('whatsapp_number', '1234567890', 'Phone number for WhatsApp chat button'),
    ('contact_phone', '+1 (234) 567-890', 'Main contact phone number in footer'),
    ('contact_email', 'info@truecare.com', 'Main contact email address'),
    ('address', '123 Healthcare Ave, Medical District, City, State 12345', 'Company physical address'),
    ('footer_text', 'Providing professional, compassionate, and reliable healthcare services directly in the comfort of your home.', 'Short description in the footer');

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);

-- NOTE: For Admin operations (INSERT/UPDATE/DELETE), we will use the Supabase Service Role Key 
-- server-side, which bypasses RLS. So no further RLS policies are strictly necessary for the MVP.

-- ==========================================
-- MVP ADMIN RLS BYPASS (Run this for MVP admin functionality with anon key)
-- ==========================================
CREATE POLICY "MVP Admin Update Settings" ON public.site_settings FOR UPDATE USING (true);

CREATE POLICY "MVP Admin Insert Services" ON public.services FOR INSERT WITH CHECK (true);
CREATE POLICY "MVP Admin Update Services" ON public.services FOR UPDATE USING (true);
CREATE POLICY "MVP Admin Delete Services" ON public.services FOR DELETE USING (true);

CREATE POLICY "MVP Admin Insert Careers" ON public.careers FOR INSERT WITH CHECK (true);
CREATE POLICY "MVP Admin Update Careers" ON public.careers FOR UPDATE USING (true);
CREATE POLICY "MVP Admin Delete Careers" ON public.careers FOR DELETE USING (true);

CREATE POLICY "MVP Admin Insert Blogs" ON public.blogs FOR INSERT WITH CHECK (true);
CREATE POLICY "MVP Admin Update Blogs" ON public.blogs FOR UPDATE USING (true);
CREATE POLICY "MVP Admin Delete Blogs" ON public.blogs FOR DELETE USING (true);

CREATE POLICY "MVP Admin Insert Gallery" ON public.gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "MVP Admin Update Gallery" ON public.gallery FOR UPDATE USING (true);
CREATE POLICY "MVP Admin Delete Gallery" ON public.gallery FOR DELETE USING (true);

CREATE POLICY "MVP Admin Update Testimonials" ON public.testimonials FOR UPDATE USING (true);
CREATE POLICY "MVP Admin Insert Testimonials" ON public.testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "MVP Admin Delete Testimonials" ON public.testimonials FOR DELETE USING (true);

CREATE POLICY "MVP Admin Update Inquiries" ON public.contact_inquiries FOR UPDATE USING (true);
CREATE POLICY "MVP Admin Delete Inquiries" ON public.contact_inquiries FOR DELETE USING (true);

