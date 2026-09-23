'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import Sidebar from '@/components/Sidebar';
import { 
  FileText, Clock, CheckCircle, AlertCircle, XCircle, PlusCircle, MapPin, Calendar, Zap, Droplets, TreePine, Route
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  role: string;
}

interface Issue {
  id: string;
  title: string;
  category: string;
  department: 'electric' | 'road' | 'water' | 'forest';
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  address: string;
  reported_at: string;
  is_duplicate: boolean;
}

const DEPARTMENT_ICONS: Record<string, any> = {
  electric: Zap,
  road: Route,
  water: Droplets,
  forest: TreePine,
};

const DEPARTMENT_LABELS: Record<string, string> = {
  electric: '⚡ Electricity',
  road: '🛣️ Road',
  water: '💧 Water',
  forest: '🌳 Forest',
};

export default function CitizenDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [myIssues, setMyIssues] = useState<Issue[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
    rejected: 0
  });

  useEffect(() => { 
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    } else {
      const saved = localStorage.getItem('sidebar_collapsed');
      if (saved !== null) {
        setSidebarCollapsed(saved === 'true');
      }
    }
    checkAuth(); 
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

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) { router.push('/login'); return; }
    try {
      const userData = JSON.parse(userStr);
      if (userData.role !== 'citizen') { router.push('/login'); return; }
      setUser(userData);
      // Pass userId directly — React state (user) is not set yet at this point
      fetchMyIssues(userData.id);
    } catch (error) { router.push('/login'); }
  };

  const fetchMyIssues = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');

      // Correct endpoint: /api/issues/my-issues (table: issues, field: citizen_id)
      const response = await fetch(`${API_URL}/issues/my-issues?userId=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Response shape: { success: true, data: { issues: [...] } }
          const issues: Issue[] = data.data?.issues || [];
          setMyIssues(issues);

          setStats({
            total: issues.length,
            pending: issues.filter((i) => i.status === 'pending').length,
            in_progress: issues.filter((i) => i.status === 'in_progress').length,
            resolved: issues.filter((i) => i.status === 'resolved').length,
            rejected: issues.filter((i) => i.status === 'rejected').length,
          });
        }
      } else {
        console.error('Failed to fetch issues, status:', response.status);
        const errText = await response.text();
        console.error('Response body:', errText);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching issues:', error);
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        role="citizen" 
        collapsed={sidebarCollapsed} 
        onToggle={toggleSidebar}
        onClose={() => setSidebarCollapsed(true)}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader 
          userName={user?.full_name || 'Citizen'}
          userRole="Citizen"
          onToggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-5">
            {/* Welcome Banner - Compact with official outline hover */}
            <div className="bg-white rounded-xl p-4 sm:p-5 mb-4 border border-gray-200 shadow-2xs hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all duration-200 group">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-0.5 group-hover:text-primary-700 transition-colors">
                    Welcome, {user?.full_name || 'Citizen'}! 👋
                  </h2>
                  <p className="text-gray-500 text-xs sm:text-sm">Track and manage your reported issues</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-primary-600 group-hover:border-primary-200 transition-all">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="mb-4">
              <button
                onClick={() => router.push('/citizen/issues/new')}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-xs sm:text-sm transition-all shadow-xs hover:shadow"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report New Issue</span>
              </button>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4">
              <StatCard title="Total" value={stats.total} icon={FileText} iconBg="bg-gray-100" iconColor="text-gray-700" />
              <StatCard title="Pending" value={stats.pending} icon={Clock} iconBg="bg-amber-50" iconColor="text-amber-600" />
              <StatCard title="In Progress" value={stats.in_progress} icon={AlertCircle} iconBg="bg-blue-50" iconColor="text-blue-600" />
              <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
              <StatCard title="Rejected" value={stats.rejected} icon={XCircle} iconBg="bg-rose-50" iconColor="text-rose-600" />
            </div>

            {/* My Issues */}
            <div className="bg-white rounded-xl shadow-2xs border border-gray-200 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm sm:text-base font-bold text-gray-900">My Issues</h3>
                <button 
                  onClick={() => router.push('/citizen/issues')}
                  className="text-xs text-primary-600 hover:text-primary-700 hover:underline font-semibold"
                >
                  View All →
                </button>
              </div>

              {myIssues.length > 0 ? (
                <div className="space-y-2.5">
                  {myIssues.slice(0, 5).map((issue) => (
                    <div
                      key={issue.id}
                      onClick={() => router.push(`/citizen/issues/${issue.id}`)}
                      className="p-3 bg-gray-50/70 border border-gray-100 rounded-lg hover:bg-white hover:border-primary-300 hover:ring-1 hover:ring-primary-50 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                            {issue.title || issue.category}
                          </span>
                          {issue.is_duplicate && (
                            <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.2 rounded font-medium">
                              Duplicate
                            </span>
                          )}
                        </div>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getStatusColor(issue.status)}`}>
                          {issue.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-gray-500">
                        {issue.address && (
                          <span className="flex items-center gap-1 truncate max-w-xs">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">{issue.address}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1 shrink-0">
                          <Calendar className="w-3 h-3" />
                          {new Date(issue.reported_at).toLocaleDateString()}
                        </span>
                      </div>
                      {issue.department && (
                        <p className="text-[10px] text-gray-400 mt-1">
                          {DEPARTMENT_LABELS[issue.department] || issue.department}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm font-medium text-gray-600 mb-1">No issues reported yet</p>
                  <p className="text-xs text-gray-500 mb-3">Report your first civic issue to get started</p>
                  <button
                    onClick={() => router.push('/citizen/issues/new')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-xs font-medium transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Report Issue</span>
                  </button>
                </div>
              )}
            </div>

            {/* Tips Section */}
            <div className="mt-4 bg-primary-50/40 border border-primary-100 rounded-xl p-3.5">
              <h4 className="font-semibold text-primary-900 text-xs mb-1">💡 Tips for Better Results</h4>
              <ul className="text-xs text-primary-800 space-y-0.5">
                <li>• Provide clear photos of the issue</li>
                <li>• Include accurate location details</li>
                <li>• Write a brief description of the problem</li>
                <li>• Track your issue status regularly</li>
              </ul>
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
  const colors: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    in_progress: 'bg-blue-50 text-blue-700 border border-blue-200',
    resolved: 'bg-green-50 text-green-700 border border-green-200',
    rejected: 'bg-rose-50 text-rose-700 border border-rose-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}
