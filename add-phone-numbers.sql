-- Add phone number column to board_signatories table
ALTER TABLE public.board_signatories ADD COLUMN phone_number text;

-- Update existing records with phone numbers
UPDATE public.board_signatories 
SET phone_number = CASE 
  WHEN job_title = 'Chairman' THEN '+966501234567'
  WHEN job_title = 'CEO' THEN '+966501234568' 
  WHEN job_title = 'CFO' THEN '+966501234569'
  ELSE '+966501234567' -- Default fallback
END;

-- Verify the update
SELECT id, name, job_title, email, phone_number FROM public.board_signatories;
