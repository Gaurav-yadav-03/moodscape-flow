/*
  # Add AI Features to Journal Entries

  1. Schema Changes
    - Add `ai_summary` column to store AI-generated summaries
    - Add `ai_reflection` column to store AI-generated reflections
    - Update existing entries to have null values for new columns

  2. Security
    - Maintain existing RLS policies
    - No changes to authentication or permissions needed
*/

-- Add AI feature columns to entries table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'entries' AND column_name = 'ai_summary'
  ) THEN
    ALTER TABLE public.entries ADD COLUMN ai_summary TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'entries' AND column_name = 'ai_reflection'
  ) THEN
    ALTER TABLE public.entries ADD COLUMN ai_reflection TEXT;
  END IF;
END $$;

-- Add index for better performance when querying AI features
CREATE INDEX IF NOT EXISTS idx_entries_ai_summary ON public.entries(ai_summary) WHERE ai_summary IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_entries_ai_reflection ON public.entries(ai_reflection) WHERE ai_reflection IS NOT NULL;