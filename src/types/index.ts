// User Roles
export type UserRole = 
  | 'citizen' 
  | 'road_admin' 
  | 'water_admin' 
  | 'electricity_admin' 
  | 'forest_admin' 
  | 'super_admin';

// Issue Categories
export type IssueCategory =
  | 'pothole'
  | 'damaged_road'
  | 'garbage'
  | 'overflowing_bin'
  | 'streetlight'
  | 'water_leakage'
  | 'water_pipeline'
  | 'fallen_tree'
  | 'drainage'
  | 'open_manhole'
  | 'damaged_garden'
  | 'traffic_infrastructure'
  | 'other';

// Severity Levels
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

// Complaint Status
export type ComplaintStatus = 'submitted' | 'assigned' | 'in_progress' | 'resolved' | 'rejected';

// User Interface
export interface User {
  id: string;
  full_name: string;
  email: string;
  mobile: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Department Interface
export interface Department {
  id: string;
  department_name: string;
  short_name: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
  created_at: string;
}

// Complaint Interface
export interface Complaint {
  id: string;
  user_id: string;
  image_url: string;
  latitude: number;
  longitude: number;
  address?: string;
  category: IssueCategory;
  severity: SeverityLevel;
  department_id?: string;
  ai_description?: string;
  user_description?: string;
  confidence?: number;
  priority_score?: number;
  status: ComplaintStatus;
  assigned_to?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
  // Relations
  user?: User;
  department?: Department;
  assigned_user?: User;
  support_count?: number;
}

// Status Log Interface
export interface StatusLog {
  id: string;
  complaint_id: string;
  old_status?: ComplaintStatus;
  new_status: ComplaintStatus;
  updated_by?: string;
  remarks?: string;
  created_at: string;
  // Relations
  updated_by_user?: User;
}

// Notification Interface
export interface Notification {
  id: string;
  user_id: string;
  complaint_id?: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// AI Analysis Response
export interface AIAnalysisResult {
  category: IssueCategory;
  severity: SeverityLevel;
  description: string;
  confidence: number;
  recommended_department: string;
  estimated_size?: string;
  safety_risk?: string;
}

// Login Credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Registration Data
export interface RegisterData {
  full_name: string;
  email: string;
  mobile: string;
  password: string;
  role?: UserRole;
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Map Marker
export interface MapMarker {
  id: string;
  position: [number, number];
  category: IssueCategory;
  severity: SeverityLevel;
  status: ComplaintStatus;
  description: string;
}

// Dashboard Statistics
export interface DashboardStats {
  total_complaints: number;
  pending_complaints: number;
  in_progress_complaints: number;
  resolved_complaints: number;
  high_priority_complaints: number;
  critical_complaints: number;
}

// Category Mapping
export const CategoryToDepartment: Record<IssueCategory, string> = {
  pothole: 'Public Works Department',
  damaged_road: 'Public Works Department',
  garbage: 'Solid Waste Management',
  overflowing_bin: 'Solid Waste Management',
  streetlight: 'Electrical Department',
  water_leakage: 'Water Supply Department',
  water_pipeline: 'Water Supply Department',
  fallen_tree: 'Forest Department',
  drainage: 'Drainage Department',
  open_manhole: 'Drainage Department',
  damaged_garden: 'Forest Department',
  traffic_infrastructure: 'Public Works Department',
  other: 'Public Works Department',
};

// Department to Role Mapping
export const DepartmentToRole: Record<string, UserRole> = {
  'Public Works Department': 'road_admin',
  'Water Supply Department': 'water_admin',
  'Electrical Department': 'electricity_admin',
  'Forest Department': 'forest_admin',
  'Solid Waste Management': 'road_admin', // Can be mapped to specific role
  'Drainage Department': 'water_admin', // Can be mapped to specific role
};

// Severity Colors
export const SeverityColors: Record<SeverityLevel, string> = {
  low: '#10B981', // Green
  medium: '#F59E0B', // Amber
  high: '#EF4444', // Red
  critical: '#DC2626', // Dark Red
};

// Status Colors
export const StatusColors: Record<ComplaintStatus, string> = {
  submitted: '#6B7280', // Gray
  assigned: '#3B82F6', // Blue
  in_progress: '#F59E0B', // Amber
  resolved: '#10B981', // Green
  rejected: '#EF4444', // Red
};
