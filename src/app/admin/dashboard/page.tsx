'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  LogOut,
  Bell,
  Settings,
  BarChart3,
  MapPin,
  Calendar,
  Activity
} from 'lucide-react';

interface DashboardStats {
  total_issues: number;
  pending_issues: number;
  in_progress_issues: number;
  resolved_issues: number;
  rejected_issues: number;
  total_citizens: number;
  total_admins: number;
  issues_today: number;
  resolved_today: number;
}

interface Issue {
  id: string;
  title: string;
  status: string;
  priority: string;
  city: string;
  created_at: string;
  department: string;
}

interface AdminProfile {
  id: string;
  full_name: string;
  email: string;
  role: 'admin';
  department: 'electric' | 'road' | 'water' | 'forest';
  is_active: boolean;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);

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
      await loadDashboardStats(user);
      await loadRecentIssues(user);
      
      setLoading(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    }
  };

  const loadDashboardStats = async (profile: AdminProfile) => {
    try {
      // For now, we can fetch basic stats
      // You can expand this to use the admin stats endpoint
      const statsData: DashboardStats = {
        total_issues: 0,
        pending_issues: 0,
        in_progress_issues: 0,
        resolved_issues: 0,
        total_citizens: 0,
        total_admins: 0,
        issues_today: 0,
        resolved_today: 0
      };
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadRecentIssues = async (profile: AdminProfile) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/issues/admin/department?department=${profile.department}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const issues = data.data.issues || [];
          setRecentIssues(issues.slice(0, 10)); // Show latest 10
          
          // Calculate stats from issues
          setStats({
            total_issues: issues.length,
            pending_issues: issues.filter((i: Issue) => i.status === 'pending').length,
            in_progress_issues: issues.filter((i: Issue) => i.status === 'in_progress').length,
            resolved_issues: issues.filter((i: Issue) => i.status === 'resolved').length,
            rejected_issues: issues.filter((i: Issue) => i.status === 'rejected').length,
            total_citizens: 0,
            total_admins: 0,
            issues_today: issues.filter((i: Issue) => 
              new Date(i.created_at).toDateString() === new Date().toDateString()
            ).length,
            resolved_today: issues.filter((i: Issue) => 
              i.status === 'resolved' && 
              new Date(i.created_at).toDateString() === new Date().toDateString()
            ).length
          });
        }
      }
    } catch (error) {
      console.error('Failed to load issues:', error);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear all stored data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('adminRole');
      localStorage.removeItem('adminDepartment');
      localStorage.removeItem('adminEmail');
      
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getDepartmentDisplayName = (dept: string) => {
    const names: Record<string, string> = {
      electric: '⚡ Electricity',
      road: '🛣️ Road',
      water: '💧 Water',
      forest: '🌳 Forest'
    };
    return names[dept] || dept;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Issues',
      value: stats?.total_issues || 0,
      change: '+12.5%',
      trend: 'up',
      icon: FileText,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      title: 'Pending Issues',
      value: stats?.pending_issues || 0,
      change: '-3.1%',
      trend: 'down',
      icon: Clock,
      color: 'bg-yellow-500',
      lightColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    },
    {
      title: 'In Progress',
      value: stats?.in_progress_issues || 0,
      change: '+8.2%',
      trend: 'up',
      icon: Activity,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      title: 'Resolved',
      value: stats?.resolved_issues || 0,
      change: '+15.3%',
      trend: 'up',
      icon: CheckCircle,
      color: 'bg-green-500',
      lightColor: 'bg-green-100',
      textColor: 'text-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">
                  {admin?.department ? getDepartmentDisplayName(admin.department) : 'Department'}
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                <Settings className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{admin?.full_name}</p>
                  <p className="text-xs text-gray-500 capitalize">{admin?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all group"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome back, {admin?.full_name}! 👋</h2>
              <p className="text-primary-100">Here's what's happening with your platform today.</p>
            </div>
            <Activity className="w-16 h-16 text-white opacity-20" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.lightColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  stat.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Charts & Recent Issues */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Issues */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Recent Issues</h3>
                <button className="text-sm text-primary-600 hover:text-primary-700 font-semibold">
                  View All →
                </button>
              </div>

              <div className="space-y-4">
                {recentIssues.length > 0 ? (
                  recentIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {issue.title}
                          </h4>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStatusColor(issue.status)}`}>
                            {issue.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{issue.city || 'Unknown'}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                          </span>
                          {issue.department && (
                            <span className="capitalize">
                              {getDepartmentDisplayName(issue.department)}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No issues found</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & System Status */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push('/admin/issues')}
                  className="w-full px-4 py-3 bg-primary-50 text-primary-600 rounded-lg font-semibold hover:bg-primary-100 transition-all text-sm flex items-center justify-between group"
                >
                  <span>View All Issues</span>
                  <FileText className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="w-full px-4 py-3 bg-purple-50 text-purple-600 rounded-lg font-semibold hover:bg-purple-100 transition-all text-sm flex items-center justify-between group">
                  <span>View Reports</span>
                  <BarChart3 className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="flex items-center space-x-2 text-sm font-semibold text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span>Connected</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API</span>
                  <span className="flex items-center space-x-2 text-sm font-semibold text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span>Active</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">AI Service</span>
                  <span className="flex items-center space-x-2 text-sm font-semibold text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span>Running</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
