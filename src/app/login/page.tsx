'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If already logged in, redirect to respective dashboard
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'super_admin') {
          router.replace('/admin/super');
        } else if (user.role === 'admin' || (user.role && user.role.includes('admin'))) {
          router.replace('/admin/dashboard');
        } else if (user.role === 'citizen') {
          router.replace('/citizen/dashboard');
        }
      } catch (e) {
        // Invalid json, ignore
      }
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        const { user, token } = data.data;
        
        // Store authentication data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('loginTime', Date.now().toString());

        if (user.role && user.role.includes('admin')) {
          localStorage.setItem('adminAuth', 'true');
          localStorage.setItem('adminDepartment', user.department || '');
          localStorage.setItem('adminEmail', user.email);
        }

        // Redirect based on role
        if (user.role === 'super_admin') {
          window.location.href = '/admin/super';
        } else if (user.role === 'admin' || (user.role && user.role.includes('admin'))) {
          window.location.href = '/admin/dashboard';
        } else if (user.role === 'citizen') {
          window.location.href = '/citizen/dashboard';
        } else {
          window.location.href = '/citizen/dashboard';
        }
      } else {
        setError(data.message || 'Login failed');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center px-3 py-6 sm:py-10">
      <div className="max-w-sm w-full">
        {/* Logo */}
        <div className="text-center mb-5">
          <div className="flex justify-center mb-3">
            <img 
              src="/logo.png" 
              alt="Bharat Niyojak" 
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Welcome Back</h1>
          <p className="text-xs text-gray-600">Sign in to your Bharat Niyojak account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-xs p-5 sm:p-6 border border-gray-200 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all duration-200">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-9 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex={-1}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-3 bg-primary-600 text-white text-xs sm:text-sm font-semibold rounded-md shadow-xs transition-all duration-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">New to Bharat Niyojak?</span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            href="/register"
            className="block w-full py-2 px-3 bg-white border border-primary-300 text-primary-700 text-xs sm:text-sm font-semibold rounded-md text-center hover:bg-primary-50 transition-all duration-200"
          >
            Create Account
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <Link href="/terms-conditions" className="text-primary-700 hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy-policy" className="text-primary-700 hover:underline">Privacy Policy</Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-3">
          <Link 
            href="/"
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
