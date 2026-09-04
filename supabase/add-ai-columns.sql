-- ================================================
-- ADD AI-RELATED COLUMNS TO ISSUES TABLE
-- Run this to add missing columns without losing data
-- ================================================

-- Add ai_description column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'issues' 
    AND column_name = 'ai_description'
  ) THEN
    ALTER TABLE public.issues ADD COLUMN ai_description TEXT;
    RAISE NOTICE 'Added ai_description column';
  ELSE
    RAISE NOTICE 'ai_description column already exists';
  END IF;
END $$;

-- Add is_duplicate column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'issues' 
    AND column_name = 'is_duplicate'
  ) THEN
    ALTER TABLE public.issues ADD COLUMN is_duplicate BOOLEAN DEFAULT false;
    RAISE NOTICE 'Added is_duplicate column';
  ELSE
    RAISE NOTICE 'is_duplicate column already exists';
  END IF;
END $$;

-- Add duplicate_of column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'issues' 
    AND column_name = 'duplicate_of'
  ) THEN
    ALTER TABLE public.issues ADD COLUMN duplicate_of UUID REFERENCES public.issues(id);
    RAISE NOTICE 'Added duplicate_of column';
  ELSE
    RAISE NOTICE 'duplicate_of column already exists';
  END IF;
END $$;
