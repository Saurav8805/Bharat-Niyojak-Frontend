/**
 * Authentication utilities for persistent login
 */

export interface UserData {
  id: string;
  email: string;
  full_name: string;
  role: 'citizen' | 'admin' | 'super_admin' | 'road_admin' | 'water_admin' | 'electricity_admin' | 'forest_admin';
  department?: 'electric' | 'road' | 'water' | 'forest';
  is_active: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | null;
}

/**
 * Get authentication state from localStorage
 */
export const getAuthState = (): AuthState => {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, user: null, token: null };
  }

  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      return { isAuthenticated: false, user: null, token: null };
    }

    const user = JSON.parse(userStr);

    // Check if token is expired (optional - if your backend sends expiry)
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
      const hoursSinceLogin = (Date.now() - parseInt(loginTime)) / (1000 * 60 * 60);
      // Auto-logout after 7 days
      if (hoursSinceLogin > 168) {
        clearAuthState();
        return { isAuthenticated: false, user: null, token: null };
      }
    }

    return {
      isAuthenticated: true,
      user,
      token
    };
  } catch (error) {
    console.error('Error reading auth state:', error);
    return { isAuthenticated: false, user: null, token: null };
  }
};

/**
 * Save authentication state to localStorage
 */
export const setAuthState = (user: UserData, token: string): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userId', user.id);
    localStorage.setItem('loginTime', Date.now().toString());

    // Store admin-specific data
    if (user.role.includes('admin')) {
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminDepartment', user.department || '');
      localStorage.setItem('adminEmail', user.email);
    }
  } catch (error) {
    console.error('Error saving auth state:', error);
  }
};

/**
 * Clear authentication state from localStorage
 */
export const clearAuthState = (): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminDepartment');
    localStorage.removeItem('adminEmail');
  } catch (error) {
    console.error('Error clearing auth state:', error);
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getAuthState().isAuthenticated;
};

/**
 * Get current user
 */
export const getCurrentUser = (): UserData | null => {
  return getAuthState().user;
};

/**
 * Get auth token
 */
export const getAuthToken = (): string | null => {
  return getAuthState().token;
};

/**
 * Get redirect path based on user role
 */
export const getRedirectPath = (role: string): string => {
  if (role === 'super_admin') {
    return '/admin/super';
  }
  if (role.includes('admin')) {
    return '/admin/dashboard';
  }
  return '/citizen/dashboard';
};
