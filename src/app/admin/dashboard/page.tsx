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
      if (!role.endsWith('_admin') || role === 'super_admin') {
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
      
      // Get department ID first
      const deptsRes = await fetch(`${API_URL}/departments`);
      const deptsData = await deptsRes.json();
      
      let departmentId = null;
      if (deptsData.success) {
        const dept = deptsData.data.departments?.find((d: any) => 
          d.department_name.toLowerCase().includes(user.role.replace('_admin', ''))
        );
        departmentId = dept?.id;
      }

      if (departmentId) {
        // Fetch department complaints
        const complaintsRes = await fetch(
          `${API_URL}/complaints/department/${departmentId}`,
          { headers: { 'Authorization': `Bearer ${token}` }}
        );
        
        if (complaintsRes.ok) {
          const complaintsData = await complaintsRes.json();
          if (complaintsData.success) {
            const complaints = complaintsData.data || [];
            setRecentComplaints(complaints.slice(0, 10));
            
            // Calculate stats
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

  const getDepartmentDisplayName = (role: string) => {
    const dept = role.replace('_admin', '');
    const names: Record<string, string> = {
      road: '🛣️ Road Department',
      water: '💧 Water Department',
      electricity: '⚡ Electricity Department',
      forest: '🌳 Forest Department'
    };
    return names[dept] || dept;
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
          userRole={admin ? getDepartmentDisplayName(admin.role) : 'Admin'}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 mb-8 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Welcome, {admin?.full_name}! 👋
                  </h2>
                  <p className="text-blue-100">{getDepartmentDisplayName(admin?.role || '')}</p>
                </div>
                <Shield className="w-16 h-16 text-white opacity-20" />
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
              <StatCard title="Total" value={stats.total_complaints} icon={FileText} color="bg-blue-500" />
              <StatCard title="Pending" value={stats.pending} icon={Clock} color="bg-yellow-500" />
              <StatCard title="In Progress" value={stats.in_progress} icon={Activity} color="bg-orange-500" />
              <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle} color="bg-green-500" />
              <StatCard title="Rejected" value={stats.rejected} icon={XCircle} color="bg-red-500" />
            </div>

            {/* Recent Complaints */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Recent Complaints</h3>
                <button 
                  onClick={() => router.push('/admin/complaints')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                >
                  View All →
                </button>
              </div>

              {recentComplaints.length > 0 ? (
                <div className="space-y-4">
                  {recentComplaints.map((complaint) => (
                    <div key={complaint.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {complaint.category || 'Complaint'}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{complaint.address}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(complaint.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No complaints yet</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function getStatusColor(status: string) {
  const colors: any = {
    pending: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-blue-100 text-blue-700',
    resolved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}
