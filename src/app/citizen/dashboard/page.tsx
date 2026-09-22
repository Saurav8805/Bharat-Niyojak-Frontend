'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import Sidebar from '@/components/Sidebar';
import { 
  FileText, Clock, CheckCircle, AlertCircle, PlusCircle, MapPin, Calendar
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  role: string;
}

interface Complaint {
  id: string;
  category: string;
  status: string;
  address: string;
  created_at: string;
  department: any;
}

export default function CitizenDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [myComplaints, setMyComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0
  });

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) { router.push('/login'); return; }
    try {
      const userData = JSON.parse(userStr);
      if (userData.role !== 'citizen') { router.push('/login'); return; }
      setUser(userData);
      fetchMyComplaints();
    } catch (error) { router.push('/login'); }
  };

  const fetchMyComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_URL}/complaints`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const complaints = data.data || [];
          // Filter to show only user's complaints (backend should already do this)
          const userComplaints = complaints.filter((c: any) => c.user_id === user?.id);
          setMyComplaints(userComplaints);
          
          // Calculate stats
          setStats({
            total: userComplaints.length,
            pending: userComplaints.filter((c: any) => c.status === 'pending').length,
            in_progress: userComplaints.filter((c: any) => c.status === 'in_progress').length,
            resolved: userComplaints.filter((c: any) => c.status === 'resolved').length
          });
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
      <Sidebar role="citizen" collapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          userName={user?.full_name || 'Citizen'}
          userRole="Citizen"
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 mb-8 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Welcome, {user?.full_name}! 🌟
                  </h2>
                  <p className="text-green-100">Track and manage your complaints</p>
                </div>
                <FileText className="w-16 h-16 text-white opacity-20" />
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="mb-8">
              <button
                onClick={() => router.push('/submit-complaint')}
                className="w-full md:w-auto flex items-center justify-center gap-3 px-6 py-4 bg-primary-600 text-white rounded-xl shadow-lg hover:bg-primary-700 hover:shadow-xl transition-all transform hover:scale-105"
              >
                <PlusCircle className="w-6 h-6" />
                <span className="font-semibold text-lg">Submit New Complaint</span>
              </button>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total" value={stats.total} icon={FileText} color="bg-blue-500" />
              <StatCard title="Pending" value={stats.pending} icon={Clock} color="bg-yellow-500" />
              <StatCard title="In Progress" value={stats.in_progress} icon={AlertCircle} color="bg-orange-500" />
              <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle} color="bg-green-500" />
            </div>

            {/* My Complaints */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">My Complaints</h3>
                <button 
                  onClick={() => router.push('/my-complaints')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                >
                  View All →
                </button>
              </div>

              {myComplaints.length > 0 ? (
                <div className="space-y-4">
                  {myComplaints.slice(0, 5).map((complaint) => (
                    <div key={complaint.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {complaint.category}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(complaint.status)}`}>
                          {complaint.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {complaint.address}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(complaint.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {complaint.department && (
                        <p className="text-xs text-gray-500 mt-1">
                          {complaint.department.department_name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-600 mb-2">No complaints yet</p>
                  <p className="text-sm text-gray-500 mb-4">Submit your first complaint to get started</p>
                  <button
                    onClick={() => router.push('/submit-complaint')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Submit Complaint</span>
                  </button>
                </div>
              )}
            </div>

            {/* Tips Section */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for Better Results</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Provide clear photos of the issue</li>
                <li>• Include accurate location details</li>
                <li>• Write a brief description of the problem</li>
                <li>• Track your complaint status regularly</li>
              </ul>
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
    submitted: 'bg-gray-100 text-gray-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}
