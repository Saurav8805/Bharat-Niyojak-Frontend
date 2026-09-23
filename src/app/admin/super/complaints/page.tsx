'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import Sidebar from '@/components/Sidebar';
import { 
  FileText, Filter, Eye, X, MapPin, Calendar, User, Phone, 
  AlertTriangle, Shield, CheckCircle, Clock, AlertCircle, XCircle 
} from 'lucide-react';

interface Complaint {
  id: string;
  title?: string;
  category: string;
  description?: string;
  ai_description?: string;
  status: string;
  priority?: string;
  severity?: string;
  department: {
    id?: string;
    department_name: string;
  } | string;
  address?: string;
  images?: string[];
  reported_image?: string;
  resolved_image?: string | null;
  resolved_at?: string;
  updates?: Array<{
    id?: string;
    status: string;
    comment?: string;
    created_at?: string;
  }>;
  created_at: string;
  reported_at?: string;
  user?: {
    id?: string;
    full_name: string;
    email: string;
    phone_number?: string;
  };
  citizen?: {
    id?: string;
    full_name: string;
    email: string;
    phone_number?: string;
  };
}

export default function AllComplaintsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

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
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    } else {
      const saved = localStorage.getItem('sidebar_collapsed');
      if (saved !== null) setSidebarCollapsed(saved === 'true');
    }
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

  const fetchComplaints = async (department = filterDepartment) => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      const params = new URLSearchParams();
      if (department) params.append('department', department);

      const url = `${API_URL}/superadmin/complaints?${params.toString()}`;

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

  const handleStatusFilterChange = (status: string) => {
    setFilterStatus(status);
  };

  const handleDeptFilterChange = (dept: string) => {
    setFilterDepartment(dept);
    fetchComplaints(dept);
  };

  const counts = {
    all: complaints.length,
    pending: complaints.filter((c) => c.status === 'pending').length,
    in_progress: complaints.filter((c) => c.status === 'in_progress').length,
    resolved: complaints.filter((c) => c.status === 'resolved').length,
    rejected: complaints.filter((c) => c.status === 'rejected').length,
  };

  const displayedComplaints = complaints.filter((c) => {
    if (!filterStatus || filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'resolved':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Resolved</span>;
      case 'in_progress':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">In Progress</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Pending</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">Rejected</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">{status}</span>;
    }
  };

  const getDepartmentName = (dept: any) => {
    if (!dept) return 'General';
    if (typeof dept === 'string') {
      if (dept === 'electric') return 'Electricity';
      return dept.charAt(0).toUpperCase() + dept.slice(1);
    }
    return dept.department_name || 'General';
  };

  const getDepartmentBadge = (deptName: string) => {
    const d = deptName.toLowerCase();
    if (d.includes('road')) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-orange-50 text-orange-700 border border-orange-200">🛣️ Road</span>;
    if (d.includes('water')) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-cyan-50 text-cyan-700 border border-cyan-200">💧 Water</span>;
    if (d.includes('electr')) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">⚡ Electricity</span>;
    if (d.includes('forest')) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">🌳 Forest</span>;
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">🏢 {deptName}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        role="super_admin"
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        onClose={() => setSidebarCollapsed(true)}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader
          userName="Super Administrator"
          userRole="Super Admin"
          onToggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-5">
            {/* Header */}
            <div className="mb-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">All Complaints & Issues</h1>
              <p className="text-xs sm:text-sm text-gray-500">Citizen reported civic problems across all municipal departments</p>
            </div>

            {/* Filters Row */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5 bg-white p-3 rounded-xl border border-gray-200 shadow-xs">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <Filter className="w-3.5 h-3.5 text-gray-400" />
                  <span>Status:</span>
                </div>

                {/* 5 Status Filter Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { key: '', label: 'All' },
                    { key: 'pending', label: 'Pending' },
                    { key: 'in_progress', label: 'In Progress' },
                    { key: 'resolved', label: 'Resolved' },
                    { key: 'rejected', label: 'Rejected' },
                  ].map((s) => {
                    const isSelected = (!filterStatus && s.key === '') || filterStatus === s.key;
                    return (
                      <button
                        key={s.key}
                        onClick={() => handleStatusFilterChange(s.key)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          isSelected
                            ? s.key === 'pending'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : s.key === 'in_progress'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : s.key === 'resolved'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : s.key === 'rejected'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-primary-600 text-white shadow-xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>

                <div className="h-4 w-px bg-gray-200 mx-1 hidden sm:block"></div>

                <select
                  value={filterDepartment}
                  onChange={(e) => handleDeptFilterChange(e.target.value)}
                  className="px-2.5 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-700"
                >
                  <option value="">All Departments</option>
                  <option value="road">Road</option>
                  <option value="water">Water</option>
                  <option value="electric">Electricity</option>
                  <option value="forest">Forest</option>
                </select>
              </div>

              <div className="text-xs text-gray-500 font-medium">
                Total Shown: <span className="font-bold text-gray-900">{displayedComplaints.length}</span> of {complaints.length}
              </div>
            </div>

            {/* Complaints Table */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all duration-200 mb-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/80 border-b border-gray-100">
                    <tr>
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-700">ID</th>
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-700">Title / Category</th>
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-700">Department</th>
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-700">Status</th>
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-700">Reported By</th>
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-700">Date</th>
                      <th className="text-right py-2.5 px-3 text-xs font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedComplaints.length > 0 ? (
                      displayedComplaints.map((complaint) => {
                        const deptName = getDepartmentName(complaint.department);
                        const citizenName = complaint.user?.full_name || complaint.citizen?.full_name || 'Anonymous';
                        const citizenEmail = complaint.user?.email || complaint.citizen?.email || '';
                        const dateStr = complaint.created_at || complaint.reported_at;

                        return (
                          <tr key={complaint.id} className="border-t border-gray-100 hover:bg-primary-50/40 transition-colors">
                            <td className="py-2.5 px-3 text-xs text-gray-600 font-mono font-medium">
                              #{complaint.id.slice(0, 8)}
                            </td>
                            <td className="py-2.5 px-3 text-xs font-medium text-gray-900 max-w-xs truncate">
                              {complaint.title || complaint.category || 'Civic Issue'}
                            </td>
                            <td className="py-2.5 px-3 text-xs">
                              {getDepartmentBadge(deptName)}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex flex-col gap-1 items-start">
                                {getStatusBadge(complaint.status)}
                                {(complaint.status === 'resolved' && (complaint.resolved_image || (complaint.images && complaint.images.length > 1))) && (
                                  <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                    <CheckCircle className="w-2.5 h-2.5" /> Proof Attached
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-xs text-gray-700">
                              <div>{citizenName}</div>
                              {citizenEmail && (
                                <div className="text-[10px] text-gray-400 font-mono">{citizenEmail}</div>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-xs text-gray-500 whitespace-nowrap">
                              {dateStr ? new Date(dateStr).toLocaleDateString('en-IN', {
                                day: '2-digit', month: 'short', year: 'numeric'
                              }) : '—'}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => setSelectedComplaint(complaint)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors border border-primary-200"
                                title="View Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-gray-500">
                          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                          <p className="text-base font-semibold text-gray-800 mb-1">
                            No {filterStatus ? filterStatus.replace('_', ' ') : ''} complaints found
                          </p>
                          <p className="text-xs text-gray-400">
                            {filterStatus 
                              ? `No complaints currently in "${filterStatus.replace('_', ' ')}" status.` 
                              : 'Complaints reported by citizens will appear here'}
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Status Stats Row - 5 Cards (All, Pending, In Progress, Resolved, Rejected) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div 
                onClick={() => handleStatusFilterChange('')}
                className={`p-3 rounded-xl border shadow-xs cursor-pointer transition-all ${
                  !filterStatus || filterStatus === 'all'
                    ? 'bg-primary-50/60 border-primary-400 ring-2 ring-primary-50'
                    : 'bg-white border-gray-200 hover:border-primary-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span className="font-semibold text-gray-700">Total</span>
                  <FileText className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {counts.all}
                </p>
              </div>

              <div 
                onClick={() => handleStatusFilterChange('pending')}
                className={`p-3 rounded-xl border shadow-xs cursor-pointer transition-all ${
                  filterStatus === 'pending'
                    ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-50'
                    : 'bg-white border-gray-200 hover:border-amber-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span className="font-semibold text-amber-700">Pending</span>
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <p className="text-xl font-bold text-amber-600">
                  {counts.pending}
                </p>
              </div>

              <div 
                onClick={() => handleStatusFilterChange('in_progress')}
                className={`p-3 rounded-xl border shadow-xs cursor-pointer transition-all ${
                  filterStatus === 'in_progress'
                    ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-50'
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span className="font-semibold text-blue-700">In Progress</span>
                  <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <p className="text-xl font-bold text-blue-600">
                  {counts.in_progress}
                </p>
              </div>

              <div 
                onClick={() => handleStatusFilterChange('resolved')}
                className={`p-3 rounded-xl border shadow-xs cursor-pointer transition-all ${
                  filterStatus === 'resolved'
                    ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-50'
                    : 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span className="font-semibold text-emerald-700">Resolved</span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <p className="text-xl font-bold text-emerald-600">
                  {counts.resolved}
                </p>
              </div>

              <div 
                onClick={() => handleStatusFilterChange('rejected')}
                className={`p-3 rounded-xl border shadow-xs cursor-pointer transition-all ${
                  filterStatus === 'rejected'
                    ? 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-50'
                    : 'bg-white border-gray-200 hover:border-rose-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span className="font-semibold text-rose-700">Rejected</span>
                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <p className="text-xl font-bold text-rose-600">
                  {counts.rejected}
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setSelectedComplaint(null)}></div>

            <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-4 sm:p-5 border border-gray-100 z-10 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between pb-3 border-b border-gray-100 mb-3">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block mb-0.5">#{selectedComplaint.id}</span>
                  <h3 className="text-base font-bold text-gray-900 leading-snug">
                    {selectedComplaint.title || selectedComplaint.category}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Photo preview section */}
              {((selectedComplaint.images && selectedComplaint.images.length > 0) || selectedComplaint.reported_image || selectedComplaint.resolved_image) && (
                <div className="mb-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(selectedComplaint.reported_image || (selectedComplaint.images && selectedComplaint.images.length > 0)) && (
                      <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 p-2">
                        <span className="text-[10px] font-semibold text-gray-600 block mb-1">
                          Citizen Reported Photo
                        </span>
                        <img
                          src={selectedComplaint.reported_image || selectedComplaint.images![0]}
                          alt="Reported Issue"
                          className="w-full h-36 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-95 transition"
                          onClick={() => window.open(selectedComplaint.reported_image || selectedComplaint.images![0], '_blank')}
                        />
                      </div>
                    )}

                    {(selectedComplaint.resolved_image || (selectedComplaint.status === 'resolved' && selectedComplaint.images && selectedComplaint.images.length > 1)) && (
                      <div className="rounded-xl overflow-hidden border-2 border-emerald-400 bg-emerald-50/50 p-2">
                        <span className="text-[10px] font-bold text-emerald-800 flex items-center gap-1 mb-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Dept Resolution Proof Photo
                        </span>
                        <img
                          src={selectedComplaint.resolved_image || selectedComplaint.images![selectedComplaint.images!.length - 1]}
                          alt="Resolution Proof"
                          className="w-full h-36 object-cover rounded-lg border border-emerald-300 cursor-pointer hover:opacity-95 transition"
                          onClick={() => window.open(selectedComplaint.resolved_image || selectedComplaint.images![selectedComplaint.images!.length - 1], '_blank')}
                        />
                        {selectedComplaint.resolved_at && (
                          <span className="text-[10px] text-emerald-700 block mt-1 font-medium">
                            Resolved: {new Date(selectedComplaint.resolved_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-3 text-xs">
                {/* Status & Department */}
                <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500 font-medium">Department:</span>
                    {getDepartmentBadge(getDepartmentName(selectedComplaint.department))}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500 font-medium">Status:</span>
                    {getStatusBadge(selectedComplaint.status)}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Citizen Description</h4>
                  <p className="text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-100 leading-relaxed">
                    {selectedComplaint.description || 'No detailed text provided.'}
                  </p>
                </div>

                {/* AI Analysis if present */}
                {selectedComplaint.ai_description && (
                  <div>
                    <h4 className="font-semibold text-primary-800 mb-1 flex items-center gap-1">
                      <span>✨ AI Assessment</span>
                    </h4>
                    <p className="text-primary-900 bg-primary-50/70 p-2.5 rounded-lg border border-primary-100 leading-relaxed text-[11px]">
                      {selectedComplaint.ai_description}
                    </p>
                  </div>
                )}

                {/* Resolution Remarks if available */}
                {selectedComplaint.updates && selectedComplaint.updates.find(u => u.status === 'resolved' && u.comment) && (
                  <div>
                    <h4 className="font-semibold text-emerald-800 mb-1 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Department Resolution Remarks</span>
                    </h4>
                    <p className="text-emerald-900 bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200 leading-relaxed text-[11px]">
                      {selectedComplaint.updates.find(u => u.status === 'resolved' && u.comment)?.comment?.replace(/\[PROOF_IMAGE:[^\]]+\]/, '').trim() || 'Work completed successfully.'}
                    </p>
                  </div>
                )}

                {/* Location */}
                {selectedComplaint.address && (
                  <div className="flex items-start gap-2 text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed">{selectedComplaint.address}</span>
                  </div>
                )}

                {/* Citizen Information */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1.5">
                  <h4 className="font-bold text-gray-900 text-xs">Citizen Details</h4>
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>{selectedComplaint.user?.full_name || selectedComplaint.citizen?.full_name || 'Anonymous Citizen'}</span>
                  </div>
                  {(selectedComplaint.user?.phone_number || selectedComplaint.citizen?.phone_number) && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>{selectedComplaint.user?.phone_number || selectedComplaint.citizen?.phone_number}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
