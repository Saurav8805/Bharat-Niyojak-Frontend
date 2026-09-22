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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Admins</h1>
              <p className="text-gray-600">Create, update, and manage department administrators</p>
            </div>

            {/* Add Admin Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowAddAdminModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Admin</span>
              </button>
            </div>

            {/* Admins Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Phone</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Department</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.length > 0 ? (
                      admins.map((admin) => (
                        <tr key={admin.id} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-900">{admin.full_name}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{admin.email}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{admin.phone_number || 'N/A'}</td>
                          <td className="py-3 px-4 text-sm text-gray-600 capitalize">
                            {admin.department || admin.role.replace('_admin', '')}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                admin.is_active
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {admin.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingAdmin(admin)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAdmin(admin.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
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
