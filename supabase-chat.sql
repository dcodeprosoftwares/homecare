-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id text NOT NULL,
  status text NOT NULL DEFAULT 'open', -- 'open' or 'closed'
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  sender text NOT NULL, -- 'user' or 'admin'
  text text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on RLS
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert sessions and messages, and select their own
-- We'll just use a simple public policy for the demo, allowing insert/select.
-- In production, you might want tighter RLS.

CREATE POLICY "Allow public insert to chat_sessions" 
ON public.chat_sessions FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public select to chat_sessions" 
ON public.chat_sessions FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow public update to chat_sessions" 
ON public.chat_sessions FOR UPDATE 
TO public 
USING (true);

CREATE POLICY "Allow public insert to chat_messages" 
ON public.chat_messages FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public select to chat_messages" 
ON public.chat_messages FOR SELECT 
TO public 
USING (true);

-- Enable Realtime for both tables
-- NOTE: In Supabase, you also need to ensure Realtime is enabled for these tables
-- in the Dashboard: Database -> Replication -> Source -> Toggle chat_sessions & chat_messages.
alter publication supabase_realtime add table chat_sessions;
alter publication supabase_realtime add table chat_messages;
