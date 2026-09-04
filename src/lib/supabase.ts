import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Types for database
export type UserRole = 'citizen' | 'admin' | 'super_admin';
export type DepartmentType = 'public_works' | 'sanitation' | 'utilities' | 'traffic' | 'environment';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  role: UserRole;
  department?: DepartmentType;
  is_active: boolean;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

// Helper function to get current user with role
export async function getCurrentUser(): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
  
  return profile;
}

// Helper function to check if user is super admin
export async function isSuperAdmin(): Promise<boolean> {
  const profile = await getCurrentUser();
  return profile?.role === 'super_admin';
}

// Helper function to check if user is admin (including super admin)
export async function isAdmin(): Promise<boolean> {
  const profile = await getCurrentUser();
  return profile?.role === 'admin' || profile?.role === 'super_admin';
}

// Helper function to check if user is citizen
export async function isCitizen(): Promise<boolean> {
  const profile = await getCurrentUser();
  return profile?.role === 'citizen';
}

// Helper function to get user's department (for admins)
export async function getUserDepartment(): Promise<DepartmentType | null> {
  const profile = await getCurrentUser();
  return profile?.department || null;
}

// Helper function to update last login
export async function updateLastLogin(userId: string) {
  await supabase
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', userId);
}

// Helper function to log admin activity
export async function logAdminActivity(
  adminId: string,
  actionType: string,
  actionDescription: string,
  metadata?: any
) {
  await supabase
    .from('admin_activity_log')
    .insert({
      admin_id: adminId,
      action_type: actionType,
      action_description: actionDescription,
      metadata: metadata || {}
    });
}
