'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import Sidebar from '@/components/Sidebar';
import { FileText, Filter } from 'lucide-react';

interface Complaint {
  id: string;
  category: string;
  status: string;
  severity: string;
  address: string;
  created_at: string;
  user: {
    full_name: string;
    email: string;
  };
  department: {
    department_name: string;
  };
}

export default function AllComplaintsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      router.push('/login');
      return;
    }
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'super_admin') {
        router.push('/login');
        return;
      }
      fetchComplaints();
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchComplaints = async (status = '') => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      const url = status
        ? `${API_URL}/superadmin/complaints?status=${status}`
        : `${API_URL}/superadmin/complaints`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setComplaints(data.data || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    fetchComplaints(status);
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-700',
      in_progress: 'bg-blue-100 text-blue-700',
      resolved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      submitted: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="super_admin" collapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          userName="Super Administrator"
          userRole="Super Admin"
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">All Complaints</h1>
              <p className="text-gray-600">View and manage all complaints from all departments</p>
            </div>

            {/* Filters */}
            <div className="mb-6 flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Complaints Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Department</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Citizen</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.length > 0 ? (
                      complaints.map((complaint) => (
                        <tr key={complaint.id} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-600 font-mono">
                            #{complaint.id.slice(0, 8)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900 capitalize">
                            {complaint.category}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {complaint.department?.department_name || 'N/A'}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                complaint.status
                              )}`}
                            >
                              {complaint.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {complaint.user?.full_name || 'Unknown'}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(complaint.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-500">
                          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                          <p className="text-lg font-medium mb-1">No complaints found</p>
                          <p className="text-sm">Complaints will appear here once citizens submit them</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stats Summary */}
            {complaints.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                {['submitted', 'pending', 'in_progress', 'resolved', 'rejected'].map((status) => {
                  const count = complaints.filter((c) => c.status === status).length;
                  return (
                    <div key={status} className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 uppercase mb-1">{status.replace('_', ' ')}</p>
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
