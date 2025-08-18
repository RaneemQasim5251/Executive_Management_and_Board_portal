-- Complete Supabase Database Setup for Board Mark Module
-- Run this entire script in your Supabase SQL Editor

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS public.board_signatories CASCADE;
DROP TABLE IF EXISTS public.board_resolutions CASCADE;

-- Create board_resolutions table
CREATE TABLE public.board_resolutions (
  id text PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  meeting_date date NOT NULL,
  agreement_details text NOT NULL,
  status text NOT NULL CHECK (status IN ('draft','awaiting_signatures','finalized','expired')) DEFAULT 'awaiting_signatures',
  deadline_at timestamptz NOT NULL,
  dabaja_text_ar text NOT NULL,
  dabaja_text_en text NOT NULL,
  preamble_ar text NOT NULL,
  preamble_en text NOT NULL,
  barcode_data text
);

-- Create board_signatories table
CREATE TABLE public.board_signatories (
  id text PRIMARY KEY,
  resolution_id text NOT NULL REFERENCES public.board_resolutions(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  job_title text NOT NULL,
  national_id_last3 text,
  signed_at timestamptz,
  signature_hash text,
  sign_token text,
  otp text,
  otp_expires_at timestamptz,
  signed_ip text,
  signed_user_agent text,
  decision text CHECK (decision IN ('approved','rejected')),
  decision_reason text
);

-- Create indexes for better performance
CREATE INDEX idx_board_signatories_resolution ON public.board_signatories(resolution_id);
CREATE INDEX idx_board_resolutions_status ON public.board_resolutions(status);
CREATE INDEX idx_board_resolutions_created ON public.board_resolutions(created_at DESC);

-- Create trigger function for updating updated_at
CREATE OR REPLACE FUNCTION set_updated_at() 
RETURNS TRIGGER AS $$
BEGIN 
  NEW.updated_at = now(); 
  RETURN NEW; 
END; 
$$ LANGUAGE plpgsql;

-- Create trigger for board_resolutions
DROP TRIGGER IF EXISTS trg_res_updated ON public.board_resolutions;
CREATE TRIGGER trg_res_updated 
  BEFORE UPDATE ON public.board_resolutions 
  FOR EACH ROW 
  EXECUTE FUNCTION set_updated_at();

-- Enable Row Level Security
ALTER TABLE public.board_resolutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_signatories ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for development (REPLACE WITH PROPER POLICIES IN PRODUCTION)
-- These allow all operations for development purposes
DROP POLICY IF EXISTS "board_resolutions_policy" ON public.board_resolutions;
CREATE POLICY "board_resolutions_policy" ON public.board_resolutions
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "board_signatories_policy" ON public.board_signatories;  
CREATE POLICY "board_signatories_policy" ON public.board_signatories
  FOR ALL USING (true) WITH CHECK (true);

-- Insert sample data for testing
INSERT INTO public.board_resolutions (
  id, meeting_date, agreement_details, status, deadline_at,
  dabaja_text_ar, dabaja_text_en, preamble_ar, preamble_en, barcode_data
) VALUES (
  'SAMPLE-RES-001',
  CURRENT_DATE,
  'Sample resolution for testing the Board Mark system functionality.',
  'awaiting_signatures',
  CURRENT_DATE + INTERVAL '7 days',
  'محضر مجلس الإدارة: بناءً على الصلاحيات المخولة للمجلس ووفقاً للأنظمة واللوائح المعمول بها، تم اتخاذ القرار التالي:',
  'Board Minutes: Under the authority vested in the Board and in accordance with applicable laws and regulations, the following resolution was adopted:',
  'تمت مناقشة الموضوع واتخاذ القرار التالي:',
  'The matter was discussed and the Board resolved as follows:',
  'SAMPLE-RES-001'
);

INSERT INTO public.board_signatories (
  id, resolution_id, name, email, job_title, national_id_last3
) VALUES 
  ('SAMPLE-RES-001-bm-1', 'SAMPLE-RES-001', 'Board Chairman', 'chairman@company.com', 'Chairman', '123'),
  ('SAMPLE-RES-001-bm-2', 'SAMPLE-RES-001', 'Chief Executive Officer', 'ceo@company.com', 'CEO', '456'),
  ('SAMPLE-RES-001-bm-3', 'SAMPLE-RES-001', 'Chief Financial Officer', 'cfo@company.com', 'CFO', '789');

-- Verify the setup
SELECT 'Setup completed successfully!' as status;
SELECT COUNT(*) as resolution_count FROM public.board_resolutions;
SELECT COUNT(*) as signatory_count FROM public.board_signatories;
