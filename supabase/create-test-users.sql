-- ================================================
-- CREATE TEST USERS WITH BCRYPT PASSWORDS
-- ================================================
-- Run this AFTER running clean-install.sql
-- These are test accounts - change passwords in production!
-- ================================================

-- Password: admin123 (bcrypt hash with salt rounds = 10)
-- Hash generated using: bcrypt.hash('admin123', 10)
-- You can generate your own at: https://bcrypt-generator.com/

-- ================================================
-- ELECTRIC DEPARTMENT ADMIN
-- ================================================
INSERT INTO public.users (
  email,
  password_hash,
  full_name,
  phone_number,
  role,
  department,
  is_active
) VALUES (
  'electric@admin.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMye.IWN6eRFoAWZlPnKHJmzqH0r0lFGUy2',
  'Electric Department Admin',
  '+91-9876543210',
  'admin',
  'electric',
  true
)
ON CONFLICT (email) 
DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  is_active = EXCLUDED.is_active;

-- ================================================
-- ROAD DEPARTMENT ADMIN
-- ================================================
INSERT INTO public.users (
  email,
  password_hash,
  full_name,
  phone_number,
  role,
  department,
  is_active
) VALUES (
  'road@admin.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMye.IWN6eRFoAWZlPnKHJmzqH0r0lFGUy2',
  'Road Department Admin',
  '+91-9876543211',
  'admin',
  'road',
  true
)
ON CONFLICT (email) 
DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  is_active = EXCLUDED.is_active;

-- ================================================
-- WATER DEPARTMENT ADMIN
-- ================================================
INSERT INTO public.users (
  email,
  password_hash,
  full_name,
  phone_number,
  role,
  department,
  is_active
) VALUES (
  'water@admin.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMye.IWN6eRFoAWZlPnKHJmzqH0r0lFGUy2',
  'Water Department Admin',
  '+91-9876543212',
  'admin',
  'water',
  true
)
ON CONFLICT (email) 
DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  is_active = EXCLUDED.is_active;

-- ================================================
-- FOREST DEPARTMENT ADMIN
-- ================================================
INSERT INTO public.users (
  email,
  password_hash,
  full_name,
  phone_number,
  role,
  department,
  is_active
) VALUES (
  'forest@admin.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMye.IWN6eRFoAWZlPnKHJmzqH0r0lFGUy2',
  'Forest Department Admin',
  '+91-9876543213',
  'admin',
  'forest',
  true
)
ON CONFLICT (email) 
DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  is_active = EXCLUDED.is_active;

-- ================================================
-- TEST CITIZEN
-- ================================================
INSERT INTO public.users (
  email,
  password_hash,
  full_name,
  phone_number,
  role,
  is_active
) VALUES (
  'citizen@test.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMye.IWN6eRFoAWZlPnKHJmzqH0r0lFGUy2',
  'Test Citizen',
  '+91-9876543214',
  'citizen',
  true
)
ON CONFLICT (email) 
DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- ================================================
-- VERIFY USERS CREATED
-- ================================================
SELECT 
  email,
  full_name,
  role,
  department,
  is_active,
  created_at
FROM public.users
ORDER BY role DESC, department;

-- ================================================
-- SUCCESS!
-- ================================================
-- ✅ 5 test users created:
--    - 4 Department Admins (electric, road, water, forest)
--    - 1 Citizen
--
-- 🔐 Login credentials for ALL accounts:
--    Email: [see above]
--    Password: admin123
--
-- ⚠️ IMPORTANT: Change these passwords in production!
-- ================================================
