'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { formatDateTime, formatRelativeTime } from '@/lib/dateUtils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Issue {
  id: string;
  title: string;
  description: string;
  ai_description?: string;
  category: string;
  status: string;
  priority: string;
  department: string;
  images: string[];
  latitude: number;
  longitude: number;
  address?: string;
  reported_at: string;
  ai_confidence?: number;
  is_duplicate?: boolean;
}

export default function IssueDetailPage() {
  const router = useRouter();
  const params = useParams();
  const issueId = params.id as string;

  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchIssueDetails();
  }, [issueId]);

  const fetchIssueDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/issues/${issueId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setIssue(response.data.data.issue);
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load issue details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this issue? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/issues/${issueId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        alert('Issue deleted successfully');
        router.push('/citizen/dashboard');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete issue');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      critical: 'text-red-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading issue details...</p>
        </div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Issue not found'}</p>
          <Link href="/citizen/dashboard" className="text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/citizen/dashboard" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Issue Details</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {issue.is_duplicate && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Possible Duplicate Detected</h3>
                <p className="mt-1 text-sm text-yellow-700">
                  This issue may be similar to another report in the same area. We've still recorded your report.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Issue Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{issue.title}</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                    {issue.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(issue.priority)}`}>
                    {issue.priority.toUpperCase()} PRIORITY
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {issue.department.toUpperCase()} DEPT
                  </span>
                </div>
              </div>
              
              {/* Edit/Delete buttons - only show if status is pending */}
              {issue.status === 'pending' && (
                <div className="flex gap-2 ml-4">
                  <Link
                    href={`/citizen/issues/edit/${issue.id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>

            {/* AI Analysis */}
            {issue.ai_description && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI Analysis
                  {issue.ai_confidence && (
                    <span className="text-xs text-blue-700">
                      ({Math.round(issue.ai_confidence * 100)}% confidence)
                    </span>
                  )}
                </h3>
                <p className="text-sm text-blue-800">{issue.ai_description}</p>
              </div>
            )}
          </div>

          {/* Issue Images */}
          {issue.images && issue.images.length > 0 && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {issue.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Issue image ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Your Description</h3>
            <p className="text-gray-700">{issue.description}</p>
          </div>

          {/* Location */}
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Location</h3>
            {issue.address && (
              <p className="text-gray-700 mb-3">{issue.address}</p>
            )}
            <p className="text-sm text-gray-500">
              Coordinates: {issue.latitude.toFixed(6)}, {issue.longitude.toFixed(6)}
            </p>
            <a
              href={`https://www.google.com/maps?q=${issue.latitude},${issue.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              View on Google Maps
            </a>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-medium">
                  Reported on {formatDateTime(issue.reported_at)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatRelativeTime(issue.reported_at)}
                </p>
              </div>
              <div className="text-xs text-gray-500">
                Issue ID: {issue.id.substring(0, 8)}...
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
