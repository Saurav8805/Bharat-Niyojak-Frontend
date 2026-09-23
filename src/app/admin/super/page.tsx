'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import Sidebar from '@/components/Sidebar';
import { 
  Users, FileText, Clock, CheckCircle, AlertCircle, XCircle, Shield, ArrowRight,
  TrendingUp, BarChart3, Building2, Activity
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

const DEPT_ICONS: Record<string, string> = {
  Road: '🛣️',
  Water: '💧',
  Electricity: '⚡',
  Forest: '🌳',
};

const DEPT_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  Road: { bg: 'bg-orange-50', text: 'text-orange-700', bar: 'bg-orange-500' },
  Water: { bg: 'bg-cyan-50', text: 'text-cyan-700', bar: 'bg-cyan-500' },
  Electricity: { bg: 'bg-amber-50', text: 'text-amber-700', bar: 'bg-amber-500' },
  Forest: { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-500' },
};

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
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Calculate resolution rate
  const resolutionRate = stats.total_complaints > 0
    ? Math.round((stats.resolved / stats.total_complaints) * 100)
    : 0;

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
          <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-5">
            {/* Welcome Banner */}
            <div className="bg-white rounded-xl p-4 sm:p-5 mb-4 border border-gray-200 shadow-xs hover:border-primary-400 hover:ring-2 hover:ring-primary-50 hover:shadow-sm transition-all duration-200 group">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 group-hover:text-primary-700 transition-colors">
                    Super Admin Dashboard 👑
                  </h2>
                  <p className="text-gray-500 text-xs sm:text-sm">Real-time system health, cross-department governance, and civic telemetry</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 group-hover:border-primary-300 group-hover:text-primary-600 transition-all">
                  <Shield className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4">
              <button
                onClick={() => router.push('/admin/super/admins')}
                className="bg-white p-3.5 sm:p-4 rounded-xl shadow-xs border border-gray-200 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 hover:shadow-sm transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="w-8 h-8 bg-primary-50 border border-primary-100 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Users className="w-4 h-4 text-primary-600" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5 tracking-tight">{stats.total_admins}</h3>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Department Admins</p>
                <p className="text-[10px] text-gray-400 mt-1">Road, Water, Electricity, Forest</p>
              </button>

              <button
                onClick={() => router.push('/admin/super/complaints')}
                className="bg-white p-3.5 sm:p-4 rounded-xl shadow-xs border border-gray-200 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 hover:shadow-sm transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="w-8 h-8 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5 tracking-tight">{stats.total_complaints}</h3>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Citizen Complaints</p>
                <p className="text-[10px] text-gray-400 mt-1">{stats.pending} pending verification</p>
              </button>

              <div className="bg-white p-3.5 sm:p-4 rounded-xl shadow-xs border border-gray-200 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 hover:shadow-sm transition-all duration-200 group">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="w-8 h-8 bg-purple-50 border border-purple-100 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    Active
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5 tracking-tight">{stats.total_citizens}</h3>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Registered Citizens</p>
                <p className="text-[10px] text-gray-400 mt-1">Platform community members</p>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4">
              <StatCard title="Total" value={stats.total_complaints} icon={FileText} tint="bg-gray-50 text-gray-700 border-gray-200" />
              <StatCard title="Pending" value={stats.pending} icon={Clock} tint="bg-amber-50 text-amber-600 border-amber-100" />
              <StatCard title="In Progress" value={stats.in_progress} icon={AlertCircle} tint="bg-blue-50 text-blue-600 border-blue-100" />
              <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle} tint="bg-emerald-50 text-emerald-600 border-emerald-100" />
              <StatCard title="Rejected" value={stats.rejected} icon={XCircle} tint="bg-rose-50 text-rose-600 border-rose-100" />
            </div>

            {/* Department-wise Statistics & Visual Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              {/* Left: Department List Breakdown */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-5 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all duration-200">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary-600" />
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">Department Status Distribution</h3>
                  </div>
                  <span className="text-[11px] font-medium text-gray-400">All 4 Departments</span>
                </div>

                <div className="space-y-3">
                  {departmentStats.length > 0 ? (
                    departmentStats.map((dept, i) => <DepartmentStatBar key={i} {...dept} />)
                  ) : (
                    <p className="text-gray-500 text-center py-4 text-xs">No department data available</p>
                  )}
                </div>
              </div>

              {/* Right: Quick Performance Summary Graph / Ring */}
              <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-5 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                    <Activity className="w-4 h-4 text-primary-600" />
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">System Telemetry</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-gray-700">Resolution Rate</span>
                        <span className="text-xs font-bold text-primary-600">{resolutionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div className="bg-primary-600 h-full rounded-full transition-all duration-500" style={{ width: `${resolutionRate}%` }}></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100">
                        <p className="text-[10px] text-amber-700 font-medium uppercase">Pending Action</p>
                        <p className="text-lg font-bold text-amber-800">{stats.pending}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-primary-50/60 border border-primary-100">
                        <p className="text-[10px] text-primary-700 font-medium uppercase">In Progress</p>
                        <p className="text-lg font-bold text-primary-800">{stats.in_progress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 mt-3">
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span>Active Departments</span>
                    <span className="font-semibold text-gray-800">4 / 4 Online</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, tint }: { title: string; value: number; icon: any; tint: string }) {
  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-3 sm:p-3.5 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${tint}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <h3 className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">{title}</h3>
      <p className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
    </div>
  );
}

function DepartmentStatBar({ name, total, pending, in_progress, resolved, rejected = 0 }: any) {
  const resolvedPercent = total > 0 ? (resolved / total) * 100 : 0;
  const inProgressPercent = total > 0 ? (in_progress / total) * 100 : 0;
  const pendingPercent = total > 0 ? (pending / total) * 100 : 0;
  const rejectedPercent = total > 0 ? (rejected / total) * 100 : 0;
  const icon = DEPT_ICONS[name] || '🏢';
  const color = DEPT_COLORS[name] || { bg: 'bg-gray-50', text: 'text-gray-700', bar: 'bg-gray-400' };

  return (
    <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{icon}</span>
          <span className="text-xs font-semibold text-gray-900">{name} Department</span>
        </div>
        <span className="text-[11px] font-bold text-gray-600 bg-white px-2 py-0.5 rounded-md border border-gray-200">
          {total} {total === 1 ? 'issue' : 'issues'}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden flex">
        <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${resolvedPercent}%` }} title={`Resolved: ${resolved}`} />
        <div className="bg-primary-500 h-full transition-all duration-300" style={{ width: `${inProgressPercent}%` }} title={`In Progress: ${in_progress}`} />
        <div className="bg-amber-400 h-full transition-all duration-300" style={{ width: `${pendingPercent}%` }} title={`Pending: ${pending}`} />
        <div className="bg-rose-500 h-full transition-all duration-300" style={{ width: `${rejectedPercent}%` }} title={`Rejected: ${rejected}`} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-1.5 mt-1.5 text-[10px] text-gray-500 font-medium">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
          {resolved} resolved
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 inline-block"></span>
          {in_progress} in progress
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
          {pending} pending
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block"></span>
          {rejected} rejected
        </span>
      </div>
    </div>
  );
}
