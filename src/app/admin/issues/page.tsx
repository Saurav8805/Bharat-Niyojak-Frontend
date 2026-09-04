'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

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
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updateComment, setUpdateComment] = useState('');

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

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

  const handleUpdateStatus = async () => {
    if (!selectedIssue || !newStatus) return;
    
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/issues/${selectedIssue.id}/status`,
        {
          status: newStatus,
          comment: updateComment
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh issues
      if (admin) await fetchIssues(admin);
      setShowUpdateModal(false);
      setSelectedIssue(null);
      setNewStatus('');
      setUpdateComment('');
      alert('Issue status updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update issue');
    } finally {
      setUpdating(false);
    }
  };

  const openUpdateModal = (issue: Issue) => {
    setSelectedIssue(issue);
    setNewStatus(issue.status);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Department Issues
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {admin?.department 
                  ? `${DEPARTMENT_ICONS[admin.department]} ${admin.department.charAt(0).toUpperCase() + admin.department.slice(1)} Department`
                  : 'All Departments'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{issues.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {issues.filter(i => i.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-purple-600">
              {issues.filter(i => i.status === 'in_progress').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-600">Resolved</p>
            <p className="text-2xl font-bold text-green-600">
              {issues.filter(i => i.status === 'resolved').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'in_progress', 'resolved'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All Issues' : status.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Issues List */}
        {filteredIssues.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Issues Found</h3>
            <p className="text-gray-600">No {filter !== 'all' && filter} issues in your department.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIssues.map((issue) => (
              <div key={issue.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Image */}
                    {issue.images && issue.images.length > 0 && (
                      <div className="flex-shrink-0">
                        <img
                          src={issue.images[0]}
                          alt="Issue"
                          className="w-32 h-32 rounded-lg object-cover cursor-pointer hover:scale-105 transition"
                          onClick={() => window.open(issue.images[0], '_blank')}
                        />
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{issue.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{issue.ai_description || issue.description}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[issue.status]}`}>
                            {issue.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[issue.priority]}`}>
                            {issue.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Reported By</p>
                          <p className="font-medium">{issue.citizen.full_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Contact</p>
                          <p className="font-medium">{issue.citizen.phone_number || issue.citizen.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Department</p>
                          <p className="font-medium">{DEPARTMENT_ICONS[issue.department]} {issue.department}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Reported At</p>
                          <p className="font-medium">{formatDate(issue.reported_at)}</p>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{issue.address || `${issue.latitude}, ${issue.longitude}`}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        {issue.status !== 'resolved' && issue.status !== 'rejected' && (
                          <button
                            onClick={() => openUpdateModal(issue)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                          >
                            Update Status
                          </button>
                        )}
                        <a
                          href={`https://www.google.com/maps?q=${issue.latitude},${issue.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                        >
                          View on Map
                        </a>
                      </div>

                      {/* Assignment note - manual process */}
                      {issue.assigned_to && issue.assigned_admin && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                          <span className="text-blue-900">
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
      </main>

      {/* Update Status Modal */}
      {showUpdateModal && selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Update Issue Status</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
              <p className="mt-2 text-xs text-gray-500">
                Note: Work assignment is handled manually by your department
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Comment (Optional)</label>
              <textarea
                value={updateComment}
                onChange={(e) => setUpdateComment(e.target.value)}
                rows={3}
                placeholder="Add a comment about this update..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUpdateStatus}
                disabled={updating}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedIssue(null);
                  setUpdateComment('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
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
