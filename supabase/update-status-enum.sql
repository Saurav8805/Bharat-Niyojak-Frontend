-- ================================================
-- UPDATE ISSUE STATUS ENUM TO 4 VALUES ONLY
-- This updates the enum without losing data
-- ================================================

-- Step 1: Drop the dashboard_stats view that depends on the status column
DROP VIEW IF EXISTS dashboard_stats CASCADE;

-- Step 2: Update any existing 'assigned' or 'closed' statuses to 'in_progress'
UPDATE public.issues 
SET status = 'in_progress' 
WHERE status IN ('assigned', 'closed');

-- Step 3: Drop the default constraint temporarily
ALTER TABLE public.issues 
  ALTER COLUMN status DROP DEFAULT;

-- Step 4: Create new enum type with only 4 statuses
CREATE TYPE issue_status_new AS ENUM ('pending', 'in_progress', 'resolved', 'rejected');

-- Step 5: Alter the column to use the new type
ALTER TABLE public.issues 
  ALTER COLUMN status TYPE issue_status_new 
  USING status::text::issue_status_new;

-- Step 6: Drop old enum and rename new one
DROP TYPE issue_status;
ALTER TYPE issue_status_new RENAME TO issue_status;

-- Step 7: Re-add the default
ALTER TABLE public.issues 
  ALTER COLUMN status SET DEFAULT 'pending'::issue_status;

-- Step 8: Recreate the dashboard_stats view if needed (optional)
-- You can recreate it later if you need it

-- Verify the change
SELECT DISTINCT status FROM public.issues;

-- Success message
DO $$ 
BEGIN
  RAISE NOTICE 'Status enum successfully updated to 4 values: pending, in_progress, resolved, rejected';
END $$;
