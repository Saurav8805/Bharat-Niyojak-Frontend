'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import Sidebar from '@/components/Sidebar';
import { 
  FileText, Clock, CheckCircle, AlertCircle, XCircle, Shield, TrendingUp, Activity
} from 'lucide-react';

interface DashboardStats {
  total_complaints: number;
  pending: number;
  in_progress: number;
  resolved: number;
  rejected: number;
}

interface AdminProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  department: string;
}

export default function DeptAdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    total_complaints: 0, pending: 0, in_progress: 0, resolved: 0, rejected: 0
  });
  const [recentComplaints, setRecentComplaints] = useState<any[]>([]);

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) { router.push('/login'); return; }
    try {
      const user = JSON.parse(userStr);
      const role = user.role as string;
      if (role === 'super_admin') {
        router.push('/admin/super');
        return;
      }
      const isAdmin = role === 'admin' || (typeof role === 'string' && role.includes('admin'));
      if (!isAdmin) {
        router.push('/login');
        return;
      }
      setAdmin(user);
      fetchDashboardData(user);
    } catch (error) { router.push('/login'); }
  };

  const fetchDashboardData = async (user: AdminProfile) => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const deptSlug = (user.department || user.role.replace('_admin', '')).toLowerCase();
      
      // Fetch issues for admin's department
      const issuesRes = await fetch(
        `${API_URL}/issues/admin/department?department=${deptSlug}`,
        { headers: { 'Authorization': `Bearer ${token}` }}
      );
      
      if (issuesRes.ok) {
        const issuesData = await issuesRes.json();
        if (issuesData.success) {
          const issues = issuesData.data?.issues || [];
          setRecentComplaints(issues.slice(0, 10));
          
          setStats({
            total_complaints: issues.length,
            pending: issues.filter((c: any) => c.status === 'pending').length,
            in_progress: issues.filter((c: any) => c.status === 'in_progress').length,
            resolved: issues.filter((c: any) => c.status === 'resolved').length,
            rejected: issues.filter((c: any) => c.status === 'rejected').length
          });
          setLoading(false);
          return;
        }
      }

      // Fallback: Check departments list
      const deptsRes = await fetch(`${API_URL}/departments`);
      const deptsData = await deptsRes.json();
      
      let departmentId = null;
      if (deptsData.success) {
        const dept = deptsData.data?.departments?.find((d: any) => 
          d.department_name?.toLowerCase().includes(deptSlug)
        );
        departmentId = dept?.id;
      }

      if (departmentId) {
        const complaintsRes = await fetch(
          `${API_URL}/complaints/department/${departmentId}`,
          { headers: { 'Authorization': `Bearer ${token}` }}
        );
        
        if (complaintsRes.ok) {
          const complaintsData = await complaintsRes.json();
          if (complaintsData.success) {
            const complaints = complaintsData.data || [];
            setRecentComplaints(complaints.slice(0, 10));
            
            setStats({
              total_complaints: complaints.length,
              pending: complaints.filter((c: any) => c.status === 'pending').length,
              in_progress: complaints.filter((c: any) => c.status === 'in_progress').length,
              resolved: complaints.filter((c: any) => c.status === 'resolved').length,
              rejected: complaints.filter((c: any) => c.status === 'rejected').length
            });
          }
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const getDepartmentDisplayName = (adminProfile: AdminProfile | null) => {
    if (!adminProfile) return 'Department Admin';
    const dept = (adminProfile.department || adminProfile.role.replace('_admin', '')).toLowerCase();
    const names: Record<string, string> = {
      road: '🛣️ Road Department',
      water: '💧 Water Department',
      electric: '⚡ Electricity Department',
      electricity: '⚡ Electricity Department',
      forest: '🌳 Forest Department'
    };
    return names[dept] || `${dept.charAt(0).toUpperCase() + dept.slice(1)} Department`;
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
      <Sidebar role={admin?.role as any} collapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          userName={admin?.full_name || 'Admin'}
          userRole={getDepartmentDisplayName(admin)}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-5">
            {/* Welcome Banner - White with official outline hover */}
            <div className="bg-white rounded-xl p-4 sm:p-5 mb-4 border border-gray-200 shadow-2xs hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all duration-200 group">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-0.5 group-hover:text-primary-700 transition-colors">
                    Welcome, {admin?.full_name || 'Admin'}! 👋
                  </h2>
                  <p className="text-gray-500 text-xs sm:text-sm">{getDepartmentDisplayName(admin)}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-primary-600 group-hover:border-primary-200 transition-all">
                  <Shield className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-4">
              <StatCard title="Total" value={stats.total_complaints} icon={FileText} iconBg="bg-gray-100" iconColor="text-gray-700" />
              <StatCard title="Pending" value={stats.pending} icon={Clock} iconBg="bg-amber-50" iconColor="text-amber-600" />
              <StatCard title="In Progress" value={stats.in_progress} icon={Activity} iconBg="bg-blue-50" iconColor="text-blue-600" />
              <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
              <StatCard title="Rejected" value={stats.rejected} icon={XCircle} iconBg="bg-rose-50" iconColor="text-rose-600" />
            </div>

            {/* Recent Complaints */}
            <div className="bg-white rounded-xl shadow-2xs border border-gray-200 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm sm:text-base font-bold text-gray-900">Recent Complaints</h3>
                <button 
                  onClick={() => router.push('/admin/issues')}
                  className="text-xs text-primary-600 hover:text-primary-700 hover:underline font-semibold"
                >
                  View All →
                </button>
              </div>

              {recentComplaints.length > 0 ? (
                <div className="space-y-2.5">
                  {recentComplaints.map((complaint) => (
                    <div key={complaint.id} className="p-3 bg-gray-50/70 border border-gray-100 rounded-lg hover:bg-white hover:border-primary-300 hover:ring-1 hover:ring-primary-50 transition-all">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs sm:text-sm font-semibold text-gray-900 capitalize">
                          {complaint.category || 'Complaint'}
                        </span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getStatusColor(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{complaint.address}</p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(complaint.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-6 text-sm">No complaints yet</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, iconBg, iconColor }: any) {
  return (
    <div className="bg-white rounded-xl shadow-2xs border border-gray-200 p-3.5 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all duration-200 group">
      <div className={`w-8 h-8 ${iconBg} ${iconColor} rounded-md flex items-center justify-center mb-2 transition-transform group-hover:scale-105 border border-black/5`}>
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">{title}</h3>
      <p className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
    </div>
  );
}

function getStatusColor(status: string) {
  const colors: any = {
    pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    in_progress: 'bg-blue-50 text-blue-700 border border-blue-200',
    resolved: 'bg-green-50 text-green-700 border border-green-200',
    rejected: 'bg-red-50 text-red-700 border border-red-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}
