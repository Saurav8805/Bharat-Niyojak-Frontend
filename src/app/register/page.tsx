'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.phone_number.length !== 10) {
      setError('Mobile number must be 10 digits');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password,
        role: 'citizen' // Default role
      });

      if (response.data.success) {
        const { user, token } = response.data.data;
        
        // Store authentication data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userId', user.id);

        // Redirect to citizen dashboard
        router.push('/citizen/dashboard');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center px-3 py-6 sm:py-8">
      <div className="max-w-sm w-full">
        {/* Logo */}
        <div className="text-center mb-5">
          <Link href="/">
            <Image 
              src="/logo.png" 
              alt="Bharat Niyojak" 
              width={160} 
              height={56}
              className="h-10 sm:h-12 w-auto mx-auto mb-2.5 object-contain"
            />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Create Account</h1>
          <p className="text-xs text-gray-600">Register as a Citizen</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-xl shadow-xs p-5 sm:p-6 border border-gray-200 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all duration-200">
          <form onSubmit={handleRegister} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                placeholder="Your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone_number" className="block text-xs font-semibold text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                required
                maxLength={10}
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                placeholder="10-digit mobile number"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                placeholder="Minimum 6 characters"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                placeholder="Re-enter password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-xs">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-2 px-3 text-xs sm:text-sm rounded-md font-semibold hover:bg-primary-700 transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link 
            href="/login"
            className="block w-full text-center py-2 px-3 border border-primary-300 text-primary-700 text-xs sm:text-sm font-semibold rounded-md hover:bg-primary-50 transition"
          >
            Login
          </Link>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-xs font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
