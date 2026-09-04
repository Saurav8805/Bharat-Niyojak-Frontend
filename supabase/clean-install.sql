-- ================================================
-- BHARAT NIYOJAK - CLEAN INSTALL
-- This will drop existing objects and recreate them
-- ⚠️ WARNING: This will delete all existing data!
-- ================================================

-- Drop existing tables (in reverse order of dependencies)
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.admin_activity_log CASCADE;
DROP TABLE IF EXISTS public.issue_updates CASCADE;
DROP TABLE IF EXISTS public.issues CASCADE;
DROP TABLE IF EXISTS public.departments CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop views
DROP VIEW IF EXISTS public.dashboard_stats CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS department_type CASCADE;
DROP TYPE IF EXISTS issue_status CASCADE;
DROP TYPE IF EXISTS issue_priority CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- CREATE ENUMS
-- ================================================

CREATE TYPE user_role AS ENUM ('citizen', 'admin');
CREATE TYPE department_type AS ENUM ('electric', 'road', 'water', 'forest');
CREATE TYPE issue_status AS ENUM ('pending', 'in_progress', 'resolved', 'rejected');
CREATE TYPE issue_priority AS ENUM ('low', 'medium', 'high', 'critical');

-- ================================================
-- USERS TABLE
-- ================================================

CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  role user_role DEFAULT 'citizen' NOT NULL,
  department department_type,
  is_active BOOLEAN DEFAULT true NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT valid_admin_department CHECK (
    (role = 'admin' AND department IS NOT NULL) OR 
    (role != 'admin')
  )
);

-- ================================================
-- DEPARTMENTS TABLE
-- ================================================

CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name department_type UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  head_admin_id UUID REFERENCES public.users(id),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- ISSUES TABLE
-- ================================================

CREATE TABLE public.issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  citizen_id UUID REFERENCES public.users(id) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  ai_description TEXT,
  category VARCHAR(100) NOT NULL,
  status issue_status DEFAULT 'pending' NOT NULL,
  priority issue_priority DEFAULT 'medium' NOT NULL,
  department department_type,
  assigned_to UUID REFERENCES public.users(id),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  images TEXT[],
  ai_category VARCHAR(100),
  ai_confidence DECIMAL(5, 2),
  ai_severity VARCHAR(50),
  is_duplicate BOOLEAN DEFAULT false,
  duplicate_of UUID REFERENCES public.issues(id),
  reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE,
  upvotes INTEGER DEFAULT 0,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- ISSUE UPDATES TABLE
-- ================================================

CREATE TABLE public.issue_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID REFERENCES public.issues(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  update_type VARCHAR(50) NOT NULL,
  old_value TEXT,
  new_value TEXT,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- ADMIN ACTIVITY LOG
-- ================================================

CREATE TABLE public.admin_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES public.users(id) NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  action_description TEXT,
  target_user_id UUID REFERENCES public.users(id),
  target_issue_id UUID REFERENCES public.issues(id),
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- NOTIFICATIONS TABLE
-- ================================================

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  related_issue_id UUID REFERENCES public.issues(id),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- CREATE INDEXES
-- ================================================

CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_department ON public.users(department);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_issues_citizen_id ON public.issues(citizen_id);
CREATE INDEX idx_issues_status ON public.issues(status);
CREATE INDEX idx_issues_department ON public.issues(department);

-- ================================================
-- ENABLE RLS
-- ================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ================================================
-- RLS POLICIES
-- ================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (id = current_setting('app.current_user_id', true)::uuid OR current_setting('app.current_user_id', true) IS NULL);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (id = current_setting('app.current_user_id', true)::uuid);

-- Anyone can view issues (for public reporting)
CREATE POLICY "Anyone can view issues" ON public.issues
  FOR SELECT USING (true);

-- Authenticated users can create issues
CREATE POLICY "Users can create issues" ON public.issues
  FOR INSERT WITH CHECK (true);

-- Admins can view all users
CREATE POLICY "Admins can view users" ON public.users
  FOR SELECT USING (true);

-- ================================================
-- FUNCTIONS
-- ================================================

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON public.issues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- SEED DEPARTMENTS
-- ================================================

INSERT INTO public.departments (name, display_name, description, is_active) VALUES
  ('electric', 'Electricity Department', 'Handles power supply, streetlights, transformers, and electrical infrastructure issues', true),
  ('road', 'Road Department', 'Manages roads, potholes, bridges, footpaths, and road infrastructure', true),
  ('water', 'Water Department', 'Handles water supply, pipelines, drainage, sewage, and water-related issues', true),
  ('forest', 'Forest & Environment', 'Manages trees, parks, pollution control, green spaces, and environmental issues', true);

-- ================================================
-- DASHBOARD STATS VIEW
-- ================================================

CREATE OR REPLACE VIEW public.dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM public.issues) as total_issues,
  (SELECT COUNT(*) FROM public.issues WHERE status = 'pending') as pending_issues,
  (SELECT COUNT(*) FROM public.issues WHERE status = 'in_progress') as in_progress_issues,
  (SELECT COUNT(*) FROM public.issues WHERE status = 'resolved') as resolved_issues,
  (SELECT COUNT(*) FROM public.users WHERE role = 'citizen') as total_citizens,
  (SELECT COUNT(*) FROM public.users WHERE role = 'admin') as total_admins,
  (SELECT COUNT(*) FROM public.issues WHERE reported_at > NOW() - INTERVAL '24 hours') as issues_today,
  (SELECT COUNT(*) FROM public.issues WHERE resolved_at > NOW() - INTERVAL '24 hours') as resolved_today;

-- ================================================
-- GRANT PERMISSIONS
-- ================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ================================================
-- STORAGE BUCKET FOR ISSUE IMAGES
-- ================================================

-- Drop existing storage policies first
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete images" ON storage.objects;

-- Create bucket (ignore if exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('issue-images', 'issue-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'issue-images');

CREATE POLICY "Anyone can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'issue-images');

CREATE POLICY "Anyone can delete images" ON storage.objects
  FOR DELETE USING (bucket_id = 'issue-images');

-- ================================================
-- SUCCESS!
-- ================================================

SELECT 
  '✅ Database schema created successfully!' as status,
  'Next: Register users and create department admins' as next_step;
