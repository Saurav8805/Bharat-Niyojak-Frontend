'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { Camera, X, Lock, CheckCircle, Upload, Eye, AlertCircle, ArrowRight } from 'lucide-react';

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
  latitude: number;
  longitude: number;
  reported_at: string;
  citizen: {
    full_name: string;
    email: string;
    phone_number?: string;
  };
  assigned_to?: string;
  assigned_admin?: {
    full_name: string;
  };
}

interface AdminProfile {
  id: string;
  role: 'admin';
  department: 'electric' | 'road' | 'water' | 'forest';
  full_name: string;
}

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  in_progress: 'bg-purple-100 text-purple-800 border-purple-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200'
};

const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700'
};

const DEPARTMENT_ICONS = {
  electric: '⚡',
  road: '🛣️',
  water: '💧',
  forest: '🌳'
};

export default function AdminIssuesPage() {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved' | 'rejected'>('all');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updateComment, setUpdateComment] = useState('');
  const [resolvedImageFile, setResolvedImageFile] = useState<File | null>(null);
  const [resolvedImagePreview, setResolvedImagePreview] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    } else {
      const saved = localStorage.getItem('sidebar_collapsed');
      if (saved !== null) setSidebarCollapsed(saved === 'true');
    }
    checkAuthAndLoadData();
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

  const checkAuthAndLoadData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        router.push('/login');
        return;
      }

      const user = JSON.parse(userStr);
      
      if (user.role !== 'admin') {
        router.push('/login');
        return;
      }

      setAdmin(user);
      await fetchIssues(user);
      setLoading(false);
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/admin/login');
    }
  };

  const fetchIssues = async (adminUser: AdminProfile) => {
    try {
      const token = localStorage.getItem('token');
      
      // Admin sees only their department issues
      const url = `${API_URL}/issues/admin/department?department=${adminUser.department}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setIssues(response.data.data.issues || []);
      }
    } catch (error) {
      console.error('Fetch issues error:', error);
    }
  };

  const filteredIssues = issues.filter(issue => {
    if (filter === 'all') return true;
    return issue.status === filter;
  });

  const promptConfirmation = () => {
    if (!selectedIssue || !newStatus) return;
    
    // Validate required resolution image when status is resolved
    if (newStatus === 'resolved' && !resolvedImageFile && !resolvedImagePreview) {
      alert('Proof of resolution image is required when marking an issue as resolved.');
      return;
    }

    setShowConfirmModal(true);
  };

  const executeStatusUpdate = async () => {
    if (!selectedIssue || !newStatus) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('status', newStatus);
      if (updateComment) formData.append('comment', updateComment);
      if (resolvedImageFile) {
        formData.append('resolved_image', resolvedImageFile);
      }

      await axios.patch(
        `${API_URL}/issues/${selectedIssue.id}/status`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );

      // Refresh issues
      if (admin) await fetchIssues(admin);
      setShowConfirmModal(false);
      setShowUpdateModal(false);
      setSelectedIssue(null);
      setNewStatus('');
      setUpdateComment('');
      setResolvedImageFile(null);
      setResolvedImagePreview(null);
      alert('Issue status updated successfully!');
    } catch (error: any) {
      console.error('Update error:', error);
      alert(error.response?.data?.message || 'Failed to update issue');
    } finally {
      setUpdating(false);
    }
  };

  const openUpdateModal = (issue: Issue) => {
    setSelectedIssue(issue);
    setNewStatus(issue.status);
    setUpdateComment('');
    setResolvedImageFile(null);
    const existingProof = issue.resolved_image || (issue.status === 'resolved' && issue.images && issue.images.length > 1 ? issue.images[issue.images.length - 1] : null);
    setResolvedImagePreview(existingProof);
    setShowConfirmModal(false);
    setShowUpdateModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        role={admin?.role || 'admin'}
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        onClose={() => setSidebarCollapsed(true)}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader 
          userName={admin?.full_name || 'Admin'}
          userRole="Department Admin"
          onToggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-5">
            <div className="mb-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Department Issues
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {admin?.department 
                  ? `${DEPARTMENT_ICONS[admin.department]} ${admin.department.charAt(0).toUpperCase() + admin.department.slice(1)} Department`
                  : 'All Departments'}
              </p>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                <p className="mt-3 text-xs sm:text-sm text-gray-500">Loading issues...</p>
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 mb-4">
                  <div className="bg-white rounded-xl shadow-xs p-3 border border-gray-200 border-l-4 border-l-primary-500 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 hover:shadow-sm transition-all duration-200">
                    <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">Total</p>
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

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-2.5 mb-4">
                  <div className="flex gap-1.5 flex-wrap">
                    {(['all', 'pending', 'in_progress', 'resolved', 'rejected'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          filter === status
                            ? 'bg-primary-600 text-white shadow-xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700'
                        }`}
                      >
                        {status === 'all' ? 'All Issues' : status.replace('_', ' ').toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Issues List */}
                {filteredIssues.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-8 sm:p-12 text-center hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all">
                    <svg className="mx-auto h-10 w-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">No Issues Found</h3>
                    <p className="text-xs text-gray-500">No {filter !== 'all' && filter} issues in your department.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredIssues.map((issue) => (
                      <div key={issue.id} className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden hover:border-primary-400 hover:ring-2 hover:ring-primary-50 hover:shadow-sm transition-all duration-200">
                        <div className="p-4 sm:p-5">
                          <div className="flex flex-col sm:flex-row items-start gap-3.5">
                            {/* Images */}
                            <div className="shrink-0 flex flex-row sm:flex-col gap-2">
                              {(issue.reported_image || (issue.images && issue.images.length > 0)) && (
                                <div className="relative group">
                                  <img
                                    src={issue.reported_image || issue.images[0]}
                                    alt="Reported Issue"
                                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover cursor-pointer hover:scale-102 transition border border-gray-200"
                                    onClick={() => window.open(issue.reported_image || issue.images[0], '_blank')}
                                  />
                                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 py-0.5 rounded font-medium backdrop-blur-xs">
                                    Reported
                                  </span>
                                </div>
                              )}
                              {(issue.resolved_image || (issue.status === 'resolved' && issue.images && issue.images.length > 1)) && (
                                <div className="relative group">
                                  <img
                                    src={issue.resolved_image || issue.images[issue.images.length - 1]}
                                    alt="Resolution Proof"
                                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover cursor-pointer hover:scale-102 transition border-2 border-green-500 shadow-xs"
                                    onClick={() => window.open(issue.resolved_image || issue.images[issue.images.length - 1], '_blank')}
                                  />
                                  <span className="absolute bottom-1 left-1 bg-green-700 text-white text-[9px] px-1 py-0.5 rounded font-bold flex items-center gap-0.5 shadow-xs">
                                    <CheckCircle className="w-2.5 h-2.5" /> Proof
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0 w-full">
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div>
                                  <h3 className="text-base font-semibold text-gray-900 mb-0.5">{issue.title}</h3>
                                  <p className="text-xs text-gray-600 line-clamp-2">{issue.ai_description || issue.description}</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-1.5 shrink-0">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_COLORS[issue.status]}`}>
                                    {issue.status.replace('_', ' ').toUpperCase()}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${PRIORITY_COLORS[issue.priority]}`}>
                                    {issue.priority.toUpperCase()}
                                  </span>
                                </div>
                              </div>

                              {/* Meta Info */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600 mb-3 bg-gray-50/70 p-2.5 rounded-lg border border-gray-100">
                                <div>
                                  <p className="text-[10px] text-gray-500 uppercase font-medium">Reported By</p>
                                  <p className="font-semibold text-gray-800 truncate">{issue.citizen.full_name}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] text-gray-500 uppercase font-medium">Contact</p>
                                  <p className="font-semibold text-gray-800 truncate">{issue.citizen.phone_number || issue.citizen.email}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] text-gray-500 uppercase font-medium">Department</p>
                                  <p className="font-semibold text-gray-800 truncate">{DEPARTMENT_ICONS[issue.department]} {issue.department}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] text-gray-500 uppercase font-medium">Reported At</p>
                                  <p className="font-semibold text-gray-800 truncate">{formatDate(issue.reported_at)}</p>
                                </div>
                              </div>

                              {/* Location */}
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                                <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="truncate">{issue.address || `${issue.latitude}, ${issue.longitude}`}</span>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openUpdateModal(issue)}
                                  className={`px-3 py-1.5 text-white rounded-lg transition text-xs font-semibold shadow-2xs ${
                                    issue.status === 'resolved'
                                      ? 'bg-emerald-600 hover:bg-emerald-700'
                                      : issue.status === 'rejected'
                                      ? 'bg-rose-600 hover:bg-rose-700'
                                      : 'bg-primary-600 hover:bg-primary-700'
                                  }`}
                                >
                                  {issue.status === 'resolved' 
                                    ? 'Edit / Update Status' 
                                    : issue.status === 'rejected'
                                    ? 'Re-open / Update'
                                    : 'Update Status'}
                                </button>
                                <a
                                  href={`https://www.google.com/maps?q=${issue.latitude},${issue.longitude}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-xs font-semibold shadow-2xs"
                                >
                                  View on Map
                                </a>
                              </div>

                              {/* Assignment note - manual process */}
                              {issue.assigned_to && issue.assigned_admin && (
                                <div className="mt-2.5 p-2 bg-primary-50/70 border border-primary-100 rounded-lg text-xs">
                                  <span className="text-primary-900">
                                    <strong>Assigned to:</strong> {issue.assigned_admin.full_name} (Manual Assignment)
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Update Status Modal */}
      {showUpdateModal && selectedIssue && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 sm:p-5 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">Update Issue Status</h3>
            
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Update Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewStatus(val);
                  if (val !== 'resolved') {
                    setResolvedImageFile(null);
                    setResolvedImagePreview(null);
                  }
                }}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
              <p className="mt-1 text-[11px] text-gray-500">
                Note: Work assignment is handled manually by your department
              </p>
            </div>

            {/* Resolution Proof Image Upload - Required ONLY when status is 'resolved' */}
            {newStatus === 'resolved' ? (
              <div className="mb-3 p-3 bg-green-50/80 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-green-900 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                    Proof of Resolution Photo <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-green-700 font-medium">Required for Resolved</span>
                </div>
                
                {resolvedImagePreview ? (
                  <div className="relative mt-2 rounded-lg overflow-hidden border border-green-300 bg-white">
                    <img
                      src={resolvedImagePreview}
                      alt="Resolution preview"
                      className="w-full h-36 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setResolvedImageFile(null);
                        setResolvedImagePreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-md transition"
                      title="Remove / replace image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="p-1.5 text-[11px] text-green-800 font-medium text-center bg-green-50 flex items-center justify-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      {resolvedImageFile ? 'Proof photo attached successfully' : 'Existing resolution proof on file (Click X to replace)'}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-green-300 rounded-lg cursor-pointer bg-white hover:bg-green-50/50 transition">
                      <div className="flex flex-col items-center justify-center pt-2 pb-2 text-center px-2">
                        <Camera className="w-6 h-6 text-green-600 mb-1" />
                        <p className="text-xs font-medium text-gray-700">
                          <span className="text-green-600 font-semibold">Click to upload photo</span> or capture
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG, WebP up to 10MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setResolvedImageFile(file);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setResolvedImagePreview(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                )}
                <p className="mt-1.5 text-[10px] text-green-700">
                  Upload a clear on-site photo demonstrating the resolution. Visible to citizen and super admin.
                </p>
              </div>
            ) : (
              <div className="mb-3 p-2.5 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2 text-gray-500">
                <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="text-[11px]">
                  Resolution proof photo is <strong className="text-gray-600">locked</strong>. Accessible and required only when status is <strong>Resolved</strong>.
                </span>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Comment (Optional)</label>
              <textarea
                value={updateComment}
                onChange={(e) => setUpdateComment(e.target.value)}
                rows={3}
                placeholder="Add a comment about this update..."
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={promptConfirmation}
                disabled={updating}
                className="flex-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-xs font-semibold disabled:opacity-50"
              >
                Update Status
              </button>
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedIssue(null);
                  setUpdateComment('');
                  setResolvedImageFile(null);
                  setResolvedImagePreview(null);
                  setShowConfirmModal(false);
                }}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-xs font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal - strictly required before updating status */}
      {showConfirmModal && selectedIssue && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-4 sm:p-5 border border-gray-100 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">Confirm Status Update</h3>
                <p className="text-[11px] text-gray-500">Please review before confirming changes</p>
              </div>
            </div>

            <div className="space-y-2.5 my-3 p-3 bg-gray-50/80 rounded-xl border border-gray-200 text-xs">
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-semibold block mb-0.5">Issue</span>
                <span className="font-semibold text-gray-900 line-clamp-1">{selectedIssue.title}</span>
              </div>

              <div>
                <span className="text-[10px] text-gray-500 uppercase font-semibold block mb-1">Status Transition</span>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_COLORS[selectedIssue.status]}`}>
                    {selectedIssue.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_COLORS[newStatus as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800'}`}>
                    {newStatus.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              {newStatus === 'resolved' && (
                <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-[11px] flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Resolution proof photo will be verified and published to the citizen and super admin.</span>
                </div>
              )}

              {selectedIssue.status === 'resolved' && newStatus !== 'resolved' && (
                <div className="p-2 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 text-[11px] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>This issue will be re-opened from Resolved to {newStatus.replace('_', ' ')}.</span>
                </div>
              )}

              {updateComment && (
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-semibold block mb-0.5">Remarks</span>
                  <p className="text-gray-700 italic bg-white p-2 rounded border border-gray-100 line-clamp-2">
                    "{updateComment}"
                  </p>
                </div>
              )}
            </div>

            <p className="text-[11px] text-gray-600 mb-3 text-center">
              Are you sure you want to proceed with this status update?
            </p>

            <div className="flex gap-2">
              <button
                onClick={executeStatusUpdate}
                disabled={updating}
                className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-xs font-semibold shadow-xs disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Confirm Update'}
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={updating}
                className="px-3.5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-xs font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
