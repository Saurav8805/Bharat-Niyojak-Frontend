-- ================================================
-- CREATE ADMIN USERS FOR ALL 4 DEPARTMENTS
-- Run this AFTER creating users via the registration page
-- ================================================

-- Instructions:
-- 1. First, register 4 users normally via the website at /register
-- 2. Note down their email addresses
-- 3. Replace the email addresses below with the actual emails
-- 4. Run this SQL in Supabase SQL Editor

-- ================================================
-- MAKE USERS AS DEPARTMENT ADMINS
-- ================================================

-- Electric Department Admin
UPDATE public.users 
SET 
  role = 'admin', 
  department = 'electric',
  is_active = true
WHERE email = 'electric.admin@example.com';  -- REPLACE WITH ACTUAL EMAIL

-- Road Department Admin
UPDATE public.users 
SET 
  role = 'admin', 
  department = 'road',
  is_active = true
WHERE email = 'road.admin@example.com';  -- REPLACE WITH ACTUAL EMAIL

-- Water Department Admin
UPDATE public.users 
SET 
  role = 'admin', 
  department = 'water',
  is_active = true
WHERE email = 'water.admin@example.com';  -- REPLACE WITH ACTUAL EMAIL

-- Forest Department Admin
UPDATE public.users 
SET 
  role = 'admin', 
  department = 'forest',
  is_active = true
WHERE email = 'forest.admin@example.com';  -- REPLACE WITH ACTUAL EMAIL

-- ================================================
-- VERIFY THE ADMINS WERE CREATED
-- ================================================

SELECT 
  id,
  email,
  full_name,
  role,
  department,
  is_active,
  created_at
FROM public.users
WHERE role = 'admin'
ORDER BY department;

-- ================================================
-- Expected Result:
-- You should see 4 users with role='admin' and their respective departments
-- ================================================
