'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { formatDateTime, formatRelativeTime } from '@/lib/dateUtils';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { CheckCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Issue {
  id: string;
  title: string;
  description: string;
  ai_description: string;
  category: string;
  department: 'electric' | 'road' | 'water' | 'forest';
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  images: string[];
  reported_image?: string;
  resolved_image?: string | null;
  address: string;
  reported_at: string;
  resolved_at?: string;
  is_duplicate: boolean;
  duplicate_of?: string;
}

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200'
};

const PRIORITY_COLORS = {
  low: 'text-gray-600',
  medium: 'text-blue-600',
  high: 'text-orange-600',
  critical: 'text-red-600'
};

const DEPARTMENT_LABELS = {
  electric: '⚡ Electricity',
  road: '🛣️ Road',
  water: '💧 Water',
  forest: '🌳 Forest'
};

export default function MyIssuesPage() {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
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
    const userId = localStorage.getItem('userId');
    
    if (!token) {
      router.push('/login');
      return;
    }

    fetchIssues(userId);
  }, []);

  const fetchIssues = async (userId: string | null) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/issues/my-issues?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setIssues(response.data.data.issues || []);
      }
    } catch (error) {
      console.error('Fetch issues error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesFilter = filter === 'all' || issue.status === filter;
    
    const matchesSearch = searchQuery === '' || 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.address?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'in_progress':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'resolved':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeSince = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
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
          <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Reported Issues</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Track the progress of your reported issues</p>
              </div>
              <Link
                href="/citizen/issues/new"
                className="px-3.5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-1.5 text-xs sm:text-sm font-semibold self-start sm:self-auto shadow-2xs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Report New Issue
              </Link>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                <p className="mt-3 text-xs sm:text-sm text-gray-500">Loading your issues...</p>
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 mb-4">
                  <div className="bg-white rounded-xl shadow-xs p-3 border border-gray-200 border-l-4 border-l-primary-500 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 hover:shadow-sm transition-all duration-200">
                    <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">Total Issues</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">{issues.length}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-xs p-3 border border-gray-200 border-l-4 border-l-amber-500 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 hover:shadow-sm transition-all duration-200">
                    <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">Pending</p>
                    <p className="text-xl sm:text-2xl font-bold text-amber-600 tracking-tight">
                      {issues.filter(i => i.status === 'pending').length}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl shadow-xs p-3 border border-gray-200 border-l-4 border-l-blue-500 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 hover:shadow-sm transition-all duration-200">
                    <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">In Progress</p>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600 tracking-tight">
                      {issues.filter(i => i.status === 'in_progress').length}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl shadow-xs p-3 border border-gray-200 border-l-4 border-l-emerald-500 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 hover:shadow-sm transition-all duration-200">
                    <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">Resolved</p>
                    <p className="text-xl sm:text-2xl font-bold text-emerald-600 tracking-tight">
                      {issues.filter(i => i.status === 'resolved').length}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl shadow-xs p-3 border border-gray-200 border-l-4 border-l-rose-500 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 hover:shadow-sm transition-all duration-200">
                    <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">Rejected</p>
                    <p className="text-xl sm:text-2xl font-bold text-rose-600 tracking-tight">
                      {issues.filter(i => i.status === 'rejected').length}
                    </p>
                  </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-2.5 sm:p-3 mb-4">
                  <div className="flex flex-col md:flex-row gap-2.5">
                    {/* Filter Buttons */}
                    <div className="flex gap-1.5 flex-wrap">
                      <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          filter === 'all'
                            ? 'bg-primary-600 text-white shadow-xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700'
                        }`}
                      >
                        All Issues
                      </button>
                      <button
                        onClick={() => setFilter('pending')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          filter === 'pending'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-700'
                        }`}
                      >
                        Pending
                      </button>
                      <button
                        onClick={() => setFilter('in_progress')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          filter === 'in_progress'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => setFilter('resolved')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          filter === 'resolved'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                      >
                        Resolved
                      </button>
                      <button
                        onClick={() => setFilter('rejected')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          filter === 'rejected'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-700'
                        }`}
                      >
                        Rejected
                      </button>
                    </div>

                    {/* Search */}
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search issues by title or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Issues List */}
                {filteredIssues.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-8 sm:p-12 text-center hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all">
                    <svg className="mx-auto h-10 w-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">No Issues Found</h3>
                    <p className="text-xs text-gray-500 mb-4">
                      {filter === 'all' 
                        ? "You haven't reported any issues yet."
                        : `No ${filter} issues found.`}
                    </p>
                    <Link
                      href="/citizen/issues/new"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-xs font-semibold shadow-2xs"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Report Your First Issue
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredIssues.map((issue) => (
                      <Link
                        key={issue.id}
                        href={`/citizen/issues/${issue.id}`}
                        className="block bg-white rounded-xl shadow-xs border border-gray-200 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 hover:shadow-sm transition-all duration-200 overflow-hidden"
                      >
                        <div className="p-4 sm:p-5">
                          <div className="flex flex-col sm:flex-row items-start gap-3.5">
                            {/* Image Thumbnail */}
                            <div className="shrink-0 flex flex-row sm:flex-col gap-1.5">
                              {(issue.reported_image || (issue.images && issue.images.length > 0)) && (
                                <div className="relative">
                                  <img
                                    src={issue.reported_image || issue.images[0]}
                                    alt="Reported Issue"
                                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border border-gray-200"
                                  />
                                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 py-0.5 rounded font-medium backdrop-blur-xs">
                                    Reported
                                  </span>
                                </div>
                              )}
                              {(issue.resolved_image || (issue.status === 'resolved' && issue.images && issue.images.length > 1)) && (
                                <div className="relative">
                                  <img
                                    src={issue.resolved_image || issue.images[issue.images.length - 1]}
                                    alt="Resolution Proof"
                                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border-2 border-green-500 shadow-2xs"
                                  />
                                  <span className="absolute bottom-1 left-1 bg-green-700 text-white text-[9px] px-1 py-0.5 rounded font-bold shadow-2xs flex items-center gap-0.5">
                                    ✓ Proof
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Issue Details */}
                            <div className="flex-1 min-w-0 w-full">
                              <div className="flex items-start justify-between gap-3 mb-1.5">
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-base font-semibold text-gray-900 mb-0.5 truncate">{issue.title}</h3>
                                  <p className="text-xs text-gray-600 line-clamp-2">{issue.ai_description || issue.description}</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-1.5 items-end sm:items-center shrink-0">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${STATUS_COLORS[issue.status]}`}>
                                    {getStatusIcon(issue.status)}
                                    {issue.status.replace('_', ' ').toUpperCase()}
                                  </span>
                                  {(issue.status === 'resolved' && (issue.resolved_image || (issue.images && issue.images.length > 1))) && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                      <CheckCircle className="w-2.5 h-2.5 text-emerald-600" /> Proof Attached
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Meta Info */}
                              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-2.5">
                                <div className="flex items-center gap-1">
                                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                  </svg>
                                  <span>{DEPARTMENT_LABELS[issue.department]}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>{formatRelativeTime(issue.reported_at)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <span className="truncate max-w-[200px]">{issue.address || 'Location captured'}</span>
                                </div>
                                <div className={`flex items-center gap-1 font-semibold ${PRIORITY_COLORS[issue.priority]}`}>
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                  </svg>
                                  <span className="capitalize">{issue.priority}</span>
                                </div>
                              </div>

                              {/* Duplicate Badge */}
                              {issue.is_duplicate && (
                                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-full text-[10px] font-medium text-amber-700">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                  </svg>
                                  Possible Duplicate Detected
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
