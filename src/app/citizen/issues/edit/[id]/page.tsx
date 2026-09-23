'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  latitude: number;
  longitude: number;
  address?: string;
  images: string[];
}

export default function EditIssuePage() {
  const router = useRouter();
  const params = useParams();
  const issueId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [issue, setIssue] = useState<Issue | null>(null);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    } else {
      const saved = localStorage.getItem('sidebar_collapsed');
      if (saved !== null) {
        setSidebarCollapsed(saved === 'true');
      }
    }
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {}
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
        localStorage.setItem('sidebar_collapsed', String(next));
      }
      return next;
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchIssue();
  }, [issueId]);

  const fetchIssue = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/issues/${issueId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const issueData = response.data.data.issue;
        
        if (issueData.status !== 'pending') {
          setError('Only pending issues can be edited');
          return;
        }

        setIssue(issueData);
        setDescription(issueData.description);
        if (issueData.images && issueData.images.length > 0) {
          setImagePreview(issueData.images[0]);
        }
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load issue');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!description.trim()) {
      setError('Please provide a description');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      formData.append('description', description);
      if (issue) {
        formData.append('latitude', issue.latitude.toString());
        formData.append('longitude', issue.longitude.toString());
        if (issue.address) {
          formData.append('address', issue.address);
        }
      }
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.put(`${API_URL}/issues/${issueId}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setSuccess('Issue updated successfully!');
        setTimeout(() => {
          router.push(`/citizen/issues/${issueId}`);
        }, 1500);
      }
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || 'Failed to update issue');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        role="citizen" 
        collapsed={sidebarCollapsed} 
        onToggle={toggleSidebar}
        onClose={() => setSidebarCollapsed(true)}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader 
          userName={user?.full_name || 'Citizen'}
          userRole="Citizen"
          onToggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
            <div className="mb-4">
              <Link href={`/citizen/issues/${issueId}`} className="text-primary-600 hover:text-primary-700 text-xs flex items-center gap-1.5 mb-1.5 font-medium">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Issue Details
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Issue</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Update your issue details</p>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                <p className="mt-3 text-xs sm:text-sm text-gray-500">Loading issue...</p>
              </div>
            ) : error && !issue ? (
              <div className="py-12 text-center">
                <div className="text-amber-500 text-4xl mb-3">⚠️</div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Error</h2>
                <p className="text-xs sm:text-sm text-gray-500 mb-3">{error}</p>
                <Link href="/citizen/issues" className="text-primary-600 hover:underline text-xs font-semibold">
                  Back to My Issues
                </Link>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 bg-rose-50 border border-rose-200 rounded-lg p-3">
                    <p className="text-xs text-rose-700 font-medium">{error}</p>
                  </div>
                )}

        {success && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <p className="text-xs text-emerald-700 font-medium">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-5 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all duration-200">
            <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">Issue Details</h2>

            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-none bg-white"
                placeholder="Describe the issue in detail..."
                required
              />
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Issue Image
              </label>
              
              {imagePreview && (
                <div className="mb-3 max-w-sm rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Issue preview"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-xs font-medium"
              >
                {image || imagePreview ? 'Change Image' : 'Upload New Image'}
              </button>
              <p className="text-[11px] text-gray-500 mt-1">
                Optional: Upload a new image to replace the existing one
              </p>
            </div>

            {/* Location (read-only) */}
            <div className="bg-gray-50/70 border border-gray-100 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-700 mb-1">Location</p>
              <p className="text-xs text-gray-600">
                {issue?.address || `${issue?.latitude}, ${issue?.longitude}`}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Location cannot be changed</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-xs sm:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
            >
              {submitting ? 'Updating...' : 'Update Issue'}
            </button>
            <Link
              href={`/citizen/issues/${issueId}`}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-xs sm:text-sm font-medium text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
