'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import Sidebar from '@/components/Sidebar';
import {
  User, Mail, Phone, Calendar, Shield, MapPin,
  Edit3, CheckCircle, Clock, AlertCircle, Save, X, XCircle
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

function getAvatarColor(name: string) {
  const colors = ['bg-violet-500','bg-blue-500','bg-emerald-500','bg-orange-500','bg-rose-500','bg-indigo-500','bg-teal-500','bg-amber-500'];
  return colors[name.charCodeAt(0) % colors.length];
}

export default function CitizenProfilePage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [form, setForm] = useState({ full_name: '', phone_number: '' });
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, resolved: 0, rejected: 0 });

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  };

  useEffect(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    if (saved !== null) {
      setSidebarCollapsed(saved === 'true');
    }
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) { router.push('/login'); return; }
    try {
      const u = JSON.parse(userStr);
      if (u.role !== 'citizen') { router.push('/login'); return; }
      fetchProfile(u.id, token);
      fetchStats(u.id, token);
    } catch { router.push('/login'); }
  }, []);

  const fetchProfile = async (id: string, token: string) => {
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setForm({ full_name: data.data.full_name, phone_number: data.data.phone_number || '' });
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchStats = async (userId: string, token: string) => {
    try {
      const res = await fetch(`${API_URL}/issues/my-issues?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const issues = data.data?.issues || [];
        setStats({
          total: issues.length,
          pending: issues.filter((i: any) => i.status === 'pending').length,
          in_progress: issues.filter((i: any) => i.status === 'in_progress').length,
          resolved: issues.filter((i: any) => i.status === 'resolved').length,
          rejected: issues.filter((i: any) => i.status === 'rejected').length,
        });
      }
    } catch (e) { console.error(e); }
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/users/${profile.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: form.full_name, phone_number: form.phone_number }),
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        // Update localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const u = JSON.parse(userStr);
          localStorage.setItem('user', JSON.stringify({ ...u, full_name: data.data.full_name }));
        }
        setSaveSuccess(true);
        setEditing(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
    </div>
  );

  const initials = getInitials(profile?.full_name || 'U');
  const avatarColor = getAvatarColor(profile?.full_name || 'U');
  const joinDate = profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="citizen" collapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          userName={profile?.full_name || 'Citizen'}
          userRole="Citizen"
          onToggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-5 space-y-4">

            {/* Save success toast */}
            {saveSuccess && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-medium">
                <CheckCircle className="w-4 h-4" /> Profile updated successfully!
              </div>
            )}

            {/* Profile Hero Card */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all duration-200">
              {/* Header gradient */}
              <div className="h-16 bg-gradient-to-r from-emerald-600 to-teal-700" />

              <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                <div className="flex items-end justify-between -mt-8 mb-3">
                  {/* Avatar */}
                  <div className={`w-16 h-16 rounded-xl ${avatarColor} flex items-center justify-center ring-4 ring-white shadow-md`}>
                    <span className="text-white text-xl font-bold">{initials}</span>
                  </div>

                  {/* Edit / Save buttons */}
                  <div className="flex gap-1.5 mt-8">
                    {editing ? (
                      <>
                        <button
                          onClick={() => setEditing(false)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-60 font-semibold shadow-2xs"
                        >
                          <Save className="w-3.5 h-3.5" /> {saving ? 'Saving…' : 'Save'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-primary-600 text-white hover:bg-primary-700 transition-colors font-semibold shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                {/* Name */}
                {editing ? (
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    className="text-lg sm:text-xl font-bold text-gray-900 border-b-2 border-primary-400 focus:outline-none bg-transparent w-full mb-1"
                  />
                ) : (
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">{profile?.full_name}</h2>
                )}
                <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  Citizen
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {/* Contact Information */}
              <div className="md:col-span-2 bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-5 space-y-3.5 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all duration-200">
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2.5">Contact Information</h3>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-0.5">Email Address</p>
                    <p className="text-xs font-semibold text-gray-900">{profile?.email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-500 mb-0.5">Phone Number</p>
                    {editing ? (
                      <input
                        type="tel"
                        value={form.phone_number}
                        onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                        placeholder="Enter phone number"
                        className="text-xs font-semibold text-gray-900 border-b border-primary-400 focus:outline-none bg-transparent w-full"
                      />
                    ) : (
                      <p className="text-xs font-semibold text-gray-900">{profile?.phone_number || <span className="text-gray-400 font-normal">Not provided</span>}</p>
                    )}
                  </div>
                </div>

                {/* Joined */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-0.5">Member Since</p>
                    <p className="text-xs font-semibold text-gray-900">{joinDate}</p>
                  </div>
                </div>

                {/* Account Status */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-0.5">Account Status</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${profile?.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {profile?.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Issue Stats */}
              <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-5 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all duration-200">
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2.5 mb-3">My Issues</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Total', value: stats.total, color: 'bg-primary-600', icon: User },
                    { label: 'Pending', value: stats.pending, color: 'bg-amber-500', icon: Clock },
                    { label: 'In Progress', value: stats.in_progress, color: 'bg-blue-600', icon: AlertCircle },
                    { label: 'Resolved', value: stats.resolved, color: 'bg-emerald-600', icon: CheckCircle },
                    { label: 'Rejected', value: stats.rejected, color: 'bg-rose-600', icon: XCircle },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex items-center justify-between p-2 rounded-lg bg-gray-50/70 border border-gray-100">
                      <span className="text-xs text-gray-600">{label}</span>
                      <span className={`text-xs font-bold text-white px-2 py-0.5 rounded-md ${color}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
