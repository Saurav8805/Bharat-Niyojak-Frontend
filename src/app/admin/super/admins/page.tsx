'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import Sidebar from '@/components/Sidebar';
import AdminModal from '@/components/AdminModal';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';

interface User {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  role: string;
  department?: string;
  dept_key?: string;
  department_display?: string;
  civic_category?: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
}

export default function ManageAdminsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [admins, setAdmins] = useState<User[]>([]);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null);

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
      fetchAdmins();
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${API_URL}/superadmin/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setAdmins(data.data || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admins:', error);
      setLoading(false);
    }
  };

  const handleAddAdmin = async (formData: any) => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/superadmin/admins`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        fetchAdmins();
        setShowAddAdminModal(false);
        alert('Admin created successfully!');
      } else {
        alert(data.message || 'Failed to add admin');
      }
    } catch (error) {
      alert('Failed to add admin');
    }
  };

  const handleUpdateAdmin = async (id: string, formData: any) => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/superadmin/admins/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        fetchAdmins();
        setEditingAdmin(null);
        alert('Admin updated successfully!');
      } else {
        alert(data.message || 'Failed to update admin');
      }
    } catch (error) {
      alert('Failed to update admin');
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/superadmin/admins/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        fetchAdmins();
        alert('Admin deleted successfully!');
      } else {
        alert(data.message || 'Failed to delete admin');
      }
    } catch (error) {
      alert('Failed to delete admin');
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
          <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-5">
            {/* Header */}
            <div className="mb-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">Manage Admins</h1>
              <p className="text-xs sm:text-sm text-gray-500">Create, update, and manage department administrators</p>
            </div>

            {/* Add Admin Button */}
            <div className="mb-4">
              <button
                onClick={() => setShowAddAdminModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-xs text-xs sm:text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Admin</span>
              </button>
            </div>

            {/* Admins Table */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all duration-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/80 border-b border-gray-100">
                    <tr>
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-700">Name</th>
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-700">Email</th>
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-700">Phone</th>
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-700">Department</th>
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-700">Status</th>
                      <th className="text-right py-2.5 px-3 text-xs font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.length > 0 ? (
                      admins.map((admin) => (
                        <tr key={admin.id} className="border-t border-gray-100 hover:bg-primary-50/40 transition-colors">
                          <td className="py-2.5 px-3 text-xs font-medium text-gray-900">{admin.full_name}</td>
                          <td className="py-2.5 px-3 text-xs text-gray-600">{admin.email}</td>
                          <td className="py-2.5 px-3 text-xs text-gray-600">{admin.phone_number || 'N/A'}</td>
                          <td className="py-2.5 px-3 text-xs">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-medium text-gray-900 flex items-center gap-1.5">
                                <span className="text-sm shrink-0">{admin.icon || '🏛️'}</span>
                                <span className="truncate max-w-[260px] font-semibold">{admin.department_display || admin.department}</span>
                              </span>
                              {admin.civic_category && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary-50 text-primary-700 border border-primary-100 w-fit">
                                  {admin.civic_category}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                admin.is_active
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {admin.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setEditingAdmin(admin)}
                                className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteAdmin(admin.id)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-500">
                          <Shield className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                          <p className="text-lg font-medium mb-1">No admins found</p>
                          <p className="text-sm">Click "Add New Admin" to create one</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {showAddAdminModal && (
        <AdminModal
          isOpen={showAddAdminModal}
          onClose={() => setShowAddAdminModal(false)}
          onSave={handleAddAdmin}
        />
      )}
      {editingAdmin && (
        <AdminModal
          isOpen={!!editingAdmin}
          onClose={() => setEditingAdmin(null)}
          onSave={(data) => handleUpdateAdmin(editingAdmin.id, data)}
          admin={editingAdmin}
        />
      )}
    </div>
  );
}
