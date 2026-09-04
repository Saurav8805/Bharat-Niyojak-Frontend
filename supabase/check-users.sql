-- ================================================
-- CHECK IF USERS EXIST IN DATABASE
-- ================================================
-- Run this to verify that test users were created
-- ================================================

-- Check if users table has the correct structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'users'
ORDER BY ordinal_position;

-- Check all users in database
SELECT 
  id,
  email,
  full_name,
  role,
  department,
  is_active,
  created_at,
  -- Show first 10 chars of password hash to verify it exists
  SUBSTRING(password_hash, 1, 10) || '...' as password_hash_preview
FROM public.users
ORDER BY role DESC, department;

-- Count users by role
SELECT 
  role,
  COUNT(*) as count
FROM public.users
GROUP BY role;

-- ================================================
-- Expected Results:
-- ================================================
-- Should see:
-- 1. password_hash column with VARCHAR(255) type
-- 2. 5 users total (4 admins + 1 citizen)
-- 3. Each admin has a department assigned
-- 4. password_hash starts with $2a$10$...
-- ================================================
