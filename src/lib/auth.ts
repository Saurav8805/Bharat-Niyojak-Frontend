import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Check if user has required role
export function hasRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

// Check if user is admin
export function isAdmin(userRole: UserRole): boolean {
  return [
    'road_admin',
    'water_admin',
    'electricity_admin',
    'forest_admin',
    'super_admin',
  ].includes(userRole);
}

// Check if user is super admin
export function isSuperAdmin(userRole: UserRole): boolean {
  return userRole === 'super_admin';
}

// Get department admin role for category
export function getDepartmentAdminRole(department: string): UserRole | null {
  const mapping: Record<string, UserRole> = {
    'Public Works Department': 'road_admin',
    'Water Supply Department': 'water_admin',
    'Electrical Department': 'electricity_admin',
    'Forest Department': 'forest_admin',
  };
  return mapping[department] || null;
}
