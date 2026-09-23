'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import Sidebar from '@/components/Sidebar';
import {
  Mail, Phone, Calendar, Shield, Crown, Building2,
  Edit3, CheckCircle, Save, X, Users, FileText, Check,
  AlertTriangle, Lock, Award
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface SuperAdminProfile {
  id: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface SystemStats {
  total_admins: number;
  total_complaints: number;
  total_citizens: number;
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

export default function SuperAdminProfilePage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profile, setProfile] = useState<SuperAdminProfile | null>(null);
  const [stats, setStats] = useState<SystemStats>({ total_admins: 0, total_complaints: 0, total_citizens: 0 });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [form, setForm] = useState({ full_name: '', phone_number: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) { router.push('/login'); return; }
    try {
      const u = JSON.parse(userStr);
      if (u.role !== 'super_admin') { router.push('/login'); return; }
      fetchProfile(u.id, token);
      fetchSystemStats(token);
    } catch { router.push('/login'); }
  }, []);

  const fetchProfile = async (id: string, token: string) => {
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data) {
        setProfile(data.data);
        setForm({
          full_name: data.data.full_name || '',
          phone_number: data.data.phone_number || ''
        });
      }
    } catch (e) {
      console.error('Error fetching super admin profile:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemStats = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/superadmin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data) {
        setStats({
          total_admins: data.data.total_admins || 0,
          total_complaints: data.data.total_complaints || 0,
          total_citizens: data.data.total_citizens || 0,
        });
      }
    } catch (e) {
      console.error('Error fetching system stats:', e);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/users/${profile.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: form.full_name,
          phone_number: form.phone_number || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProfile((prev) => prev ? { ...prev, full_name: form.full_name, phone_number: form.phone_number } : null);
        const stored = localStorage.getItem('user');
        if (stored) {
          const u = JSON.parse(stored);
          localStorage.setItem('user', JSON.stringify({ ...u, full_name: form.full_name }));
        }
        setEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (e) {
      alert('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  const initials = getInitials(profile?.full_name || 'Super Admin');
  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'System Root';

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="super_admin" collapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          userName={profile?.full_name || 'Super Administrator'}
          userRole="Super Admin"
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-5 space-y-4">

            {saveSuccess && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-medium">
                <CheckCircle className="w-4 h-4" /> Profile updated successfully!
              </div>
            )}

            {/* Profile Hero Card */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-5 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-primary-600 flex items-center justify-center text-white font-bold text-2xl shadow-xs shrink-0 ring-2 ring-primary-100">
                    {initials}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                        {profile?.full_name || 'Super Administrator'}
                      </h1>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Crown className="w-3 h-3 text-amber-500" />
                        Super Admin
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Global System Administrator • Full Governance and Oversight Access
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    <span>Apex Authority</span>
                  </div>
                  {editing ? (
                    <>
                      <button
                        onClick={() => setEditing(false)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-60 font-semibold shadow-2xs"
                      >
                        <Save className="w-3.5 h-3.5" /> {saving ? 'Saving…' : 'Save'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Department Admins</span>
                  <div className="w-7 h-7 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900 tracking-tight">{stats.total_admins}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Road, Water, Electricity, Forest</p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Total Complaints</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900 tracking-tight">{stats.total_complaints}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Citizen reported civic issues</p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Citizens Enrolled</span>
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900 tracking-tight">{stats.total_citizens}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Active civic participants</p>
              </div>
            </div>

            {/* Profile Information & System Privileges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Account Details */}
              <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-5 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                  <Shield className="w-4 h-4 text-primary-600" />
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Account Information</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-medium text-gray-500 block mb-1">Full Name</label>
                    {editing ? (
                      <input
                        type="text"
                        value={form.full_name}
                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter full name"
                      />
                    ) : (
                      <p className="text-xs font-semibold text-gray-900">{profile?.full_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-gray-500 block mb-1">Email Address</label>
                    <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-700">
                      <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="font-mono text-[11px]">{profile?.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-gray-500 block mb-1">Phone Number</label>
                    {editing ? (
                      <input
                        type="tel"
                        value={form.phone_number}
                        onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="e.g. 9876543210"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-gray-800">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{profile?.phone_number || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-gray-500 block mb-1">Registered Since</label>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{joinDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Privileges */}
              <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-5 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                  <Lock className="w-4 h-4 text-primary-600" />
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">System Privileges & Scope</h3>
                </div>

                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2 text-xs text-gray-700">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Manage Department Admins</span>
                      <p className="text-[11px] text-gray-500">Create, edit credentials, deactivate, and assign departments.</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-2 text-xs text-gray-700">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Global Complaint Oversight</span>
                      <p className="text-[11px] text-gray-500">Full visibility into all citizen-reported issues across all departments.</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-2 text-xs text-gray-700">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Cross-Department Analytics</span>
                      <p className="text-[11px] text-gray-500">Real-time statistics for Road, Water, Electricity, and Forest operations.</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-2 text-xs text-gray-700">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Root System Configuration</span>
                      <p className="text-[11px] text-gray-500">Unrestricted administrative permissions across the platform.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
