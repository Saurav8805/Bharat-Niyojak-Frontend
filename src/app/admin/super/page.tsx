'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import Sidebar from '@/components/Sidebar';
import { 
  Users, FileText, Clock, CheckCircle, AlertCircle, XCircle, Shield, ArrowRight
} from 'lucide-react';

interface DashboardStats {
  total_complaints: number;
  pending: number;
  in_progress: number;
  resolved: number;
  rejected: number;
  total_admins: number;
  total_citizens: number;
}

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    total_complaints: 0, pending: 0, in_progress: 0, resolved: 0, rejected: 0,
    total_admins: 0, total_citizens: 0
  });
  const [departmentStats, setDepartmentStats] = useState<any[]>([]);

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) { router.push('/login'); return; }
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'super_admin') { router.push('/login'); return; }
      fetchDashboardData();
    } catch (error) { router.push('/login'); }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [statsRes, deptStatsRes] = await Promise.all([
        fetch(`${API_URL}/superadmin/stats`, { headers }),
        fetch(`${API_URL}/superadmin/department-stats`, { headers })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.data);
      }

      if (deptStatsRes.ok) {
        const deptStatsData = await deptStatsRes.json();
        if (deptStatsData.success) {
          const statsArray = Object.entries(deptStatsData.data || {}).map(([name, stats]: [string, any]) => ({
            name, ...stats
          }));
          setDepartmentStats(statsArray);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
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
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 mb-8 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Super Admin Dashboard 👑</h2>
                  <p className="text-purple-100">System overview and real-time statistics</p>
                </div>
                <Shield className="w-16 h-16 text-white opacity-20" />
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <button
                onClick={() => router.push('/admin/super/admins')}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.total_admins}</h3>
                <p className="text-sm text-gray-600">Department Admins</p>
              </button>

              <button
                onClick={() => router.push('/admin/super/complaints')}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.total_complaints}</h3>
                <p className="text-sm text-gray-600">Total Complaints</p>
              </button>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.total_citizens}</h3>
                <p className="text-sm text-gray-600">Total Citizens</p>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <StatCard title="Pending" value={stats.pending} icon={Clock} color="bg-yellow-500" />
              <StatCard title="In Progress" value={stats.in_progress} icon={AlertCircle} color="bg-blue-500" />
              <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle} color="bg-green-500" />
              <StatCard title="Rejected" value={stats.rejected} icon={XCircle} color="bg-red-500" />
            </div>

            {/* Department Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Department-wise Statistics</h3>
              <div className="space-y-4">
                {departmentStats.length > 0 ? (
                  departmentStats.map((dept, i) => <DepartmentStatBar key={i} {...dept} />)
                ) : (
                  <p className="text-gray-500 text-center py-4">No department data available</p>
                )}
              </div>
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
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function DepartmentStatBar({ name, total, pending, resolved }: any) {
  const resolvedPercent = (resolved / total) * 100 || 0;
  const pendingPercent = (pending / total) * 100 || 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <span className="text-sm text-gray-500">{total} total</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div className="flex h-full">
          <div className="bg-green-500" style={{ width: `${resolvedPercent}%` }}></div>
          <div className="bg-yellow-500" style={{ width: `${pendingPercent}%` }}></div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
        <span>✓ {resolved} resolved</span>
        <span>⏱ {pending} pending</span>
      </div>
    </div>
  );
}
