'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { formatDateTime, formatRelativeTime } from '@/lib/dateUtils';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { CheckCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface IssueUpdate {
  id?: string;
  status: string;
  comment?: string;
  created_at?: string;
}

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
  reported_image?: string;
  resolved_image?: string | null;
  resolved_at?: string;
  updates?: IssueUpdate[];
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    if (saved !== null) {
      setSidebarCollapsed(saved === 'true');
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
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  };

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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="citizen" collapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          userName={user?.full_name || 'Citizen'}
          userRole="Citizen"
          onToggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-5">
            <div className="mb-4">
              <Link href="/citizen/issues" className="text-primary-600 hover:text-primary-700 text-xs flex items-center gap-1.5 mb-1.5 font-medium">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to My Issues
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Issue Details</h1>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                <p className="mt-3 text-xs sm:text-sm text-gray-500">Loading issue details...</p>
              </div>
            ) : error || !issue ? (
              <div className="py-12 text-center">
                <div className="text-amber-500 text-4xl mb-3">⚠️</div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Error</h2>
                <p className="text-xs sm:text-sm text-gray-500 mb-3">{error || 'Issue not found'}</p>
                <Link href="/citizen/issues" className="text-primary-600 hover:underline text-xs font-semibold">
                  Back to My Issues
                </Link>
              </div>
            ) : (
              <>
                {/* Success Message */}
        {issue.is_duplicate && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <div className="flex items-start gap-2.5">
              <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="text-xs font-semibold text-amber-800">Possible Duplicate Detected</h3>
                <p className="mt-0.5 text-xs text-amber-700">
                  This issue may be similar to another report in the same area. We've still recorded your report.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Resolution Proof Card - Shown prominently when issue is resolved */}
        {(issue.status === 'resolved' || issue.resolved_image) && (
          <div className="mb-4 bg-emerald-50/90 border-2 border-emerald-400 rounded-xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-emerald-950">
                  Work Completed & Issue Resolved
                </h3>
                <p className="text-xs text-emerald-700">
                  The concerned department has inspected and verified the resolution on-site.
                </p>
              </div>
            </div>

            {issue.resolved_image && (
              <div className="mt-3 bg-white p-3.5 rounded-lg border border-emerald-200">
                <p className="text-xs font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Department Resolution Proof Photo
                </p>
                <div className="relative group max-w-md">
                  <img
                    src={issue.resolved_image}
                    alt="Resolution Proof"
                    className="w-full h-56 sm:h-64 object-cover rounded-lg border border-emerald-200 cursor-pointer hover:opacity-95 transition"
                    onClick={() => window.open(issue.resolved_image!, '_blank')}
                  />
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-gray-500">
                    <span className="text-primary-600 font-medium cursor-pointer" onClick={() => window.open(issue.resolved_image!, '_blank')}>
                      Click photo to view full size
                    </span>
                    {issue.resolved_at && (
                      <span className="text-emerald-700 font-medium">
                        Resolved: {formatDateTime(issue.resolved_at)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Department resolution comment if any */}
            {issue.updates && issue.updates.find(u => u.status === 'resolved' && u.comment) && (
              <div className="mt-3 bg-emerald-100/70 rounded-lg p-2.5 border border-emerald-200 text-xs text-emerald-900">
                <span className="font-semibold">Department Remarks: </span>
                <span>
                  {issue.updates.find(u => u.status === 'resolved' && u.comment)?.comment?.replace(/\[PROOF_IMAGE:[^\]]+\]/, '').trim() || 'Work completed successfully.'}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all duration-200">
          {/* Issue Header */}
          <div className="p-4 sm:p-5 border-b border-gray-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{issue.title}</h2>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusColor(issue.status)}`}>
                    {issue.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getPriorityColor(issue.priority)}`}>
                    {issue.priority.toUpperCase()} PRIORITY
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-50 text-primary-700 border border-primary-100">
                    {issue.department.toUpperCase()} DEPT
                  </span>
                  {issue.status === 'resolved' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> Proof Attached
                    </span>
                  )}
                </div>
              </div>
              
              {/* Edit/Delete buttons - only show if status is pending */}
              {issue.status === 'pending' && (
                <div className="flex gap-1.5 shrink-0">
                  <Link
                    href={`/citizen/issues/edit/${issue.id}`}
                    className="px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-xs font-semibold flex items-center gap-1 shadow-2xs"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-3 py-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 shadow-2xs"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>

            {/* AI Analysis */}
            {issue.ai_description && (
              <div className="mt-3 bg-primary-50/70 border border-primary-200 rounded-lg p-3">
                <h3 className="text-xs font-semibold text-primary-900 mb-1 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI Analysis
                  {issue.ai_confidence && (
                    <span className="text-[11px] text-primary-700">
                      ({Math.round(issue.ai_confidence * 100)}% confidence)
                    </span>
                  )}
                </h3>
                <p className="text-xs text-primary-800">{issue.ai_description}</p>
              </div>
            )}
          </div>

          {/* Issue Images */}
          {issue.images && issue.images.length > 0 && (
            <div className="p-4 sm:p-5 border-b border-gray-200">
              <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Photos & Documentation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {issue.reported_image || issue.images[0] ? (
                  <div>
                    <span className="text-[11px] font-semibold text-gray-600 block mb-1">Initial Citizen Report</span>
                    <img
                      src={issue.reported_image || issue.images[0]}
                      alt="Reported Issue"
                      className="w-full h-48 sm:h-56 object-cover rounded-lg border border-gray-200 cursor-pointer"
                      onClick={() => window.open(issue.reported_image || issue.images[0], '_blank')}
                    />
                  </div>
                ) : null}
                {(issue.resolved_image || (issue.status === 'resolved' && issue.images.length > 1)) && (
                  <div>
                    <span className="text-[11px] font-semibold text-green-700 flex items-center gap-1 mb-1">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" /> Department Resolution Proof
                    </span>
                    <img
                      src={issue.resolved_image || issue.images[issue.images.length - 1]}
                      alt="Resolution Proof"
                      className="w-full h-48 sm:h-56 object-cover rounded-lg border-2 border-green-500 cursor-pointer shadow-xs"
                      onClick={() => window.open(issue.resolved_image || issue.images[issue.images.length - 1], '_blank')}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="p-4 sm:p-5 border-b border-gray-200">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1.5">Your Description</h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{issue.description}</p>
          </div>

          {/* Location */}
          <div className="p-4 sm:p-5">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1.5">Location</h3>
            {issue.address && (
              <p className="text-xs sm:text-sm text-gray-700 mb-2">{issue.address}</p>
            )}
            <p className="text-xs text-gray-500">
              Coordinates: {issue.latitude.toFixed(6)}, {issue.longitude.toFixed(6)}
            </p>
            <a
              href={`https://www.google.com/maps?q=${issue.latitude},${issue.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2.5 text-primary-600 hover:text-primary-700 text-xs font-semibold"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              View on Google Maps
            </a>
          </div>

          {/* Footer */}
          <div className="bg-gray-50/70 px-4 sm:px-5 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-700 font-medium">
                  Reported on {formatDateTime(issue.reported_at)}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {formatRelativeTime(issue.reported_at)}
                </p>
              </div>
              <div className="text-[10px] text-gray-400 font-mono">
                ID: {issue.id.substring(0, 8)}...
              </div>
            </div>
          </div>
        </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
