'use client';

import { useState } from 'react';
import { X, Building2 } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  admin?: any;
}

export const CIVIC_DEPARTMENTS_LIST = [
  {
    value: 'road_pwd',
    label: 'Municipal Corporation / PWD',
    category: 'Roads & Potholes',
    icon: '🛣️'
  },
  {
    value: 'streetlights',
    label: 'Municipal Corporation – Electrical Department',
    category: 'Streetlights',
    icon: '💡'
  },
  {
    value: 'water_supply',
    label: 'Municipal Water Supply Department',
    category: 'Water Supply',
    icon: '🚰'
  },
  {
    value: 'drainage_sewerage',
    label: 'Municipal Corporation – Drainage Department',
    category: 'Drainage & Sewerage',
    icon: '🕳️'
  },
  {
    value: 'solid_waste',
    label: 'Municipal Corporation – Solid Waste Management Department',
    category: 'Solid Waste / Garbage',
    icon: '🗑️'
  },
  {
    value: 'trees_parks',
    label: 'Municipal Corporation – Garden / Tree Authority Department',
    category: 'Trees & Parks',
    icon: '🌳'
  },
  {
    value: 'traffic_safety',
    label: 'Traffic Police / Municipal Corporation',
    category: 'Traffic & Road Safety',
    icon: '🚦'
  },
  {
    value: 'illegal_construction',
    label: 'Municipal Corporation – Encroachment / Town Planning Dept',
    category: 'Illegal Construction / Encroachment',
    icon: '🏗️'
  },
  {
    value: 'health_sanitation',
    label: 'Municipal Corporation – Public Health Department',
    category: 'Public Health & Sanitation',
    icon: '🦟'
  },
  {
    value: 'pollution_control',
    label: 'State Pollution Control Board (SPCB) / Municipal Corp',
    category: 'Air & Environmental Pollution',
    icon: '🌫️'
  },
  {
    value: 'flooding_disaster',
    label: 'Municipal Corporation / Disaster Management Cell',
    category: 'Flooding & Waterlogging',
    icon: '🌊'
  },
  {
    value: 'stray_animals',
    label: 'Municipal Corporation – Veterinary Department',
    category: 'Stray Animals & Animal Nuisance',
    icon: '🐕'
  },
  {
    value: 'electricity_infra',
    label: 'State Electricity Board (MSEDCL / Electricity Dist.)',
    category: 'Electricity Infrastructure',
    icon: '⚡'
  },
  {
    value: 'fire_emergency',
    label: 'Municipal Fire & Emergency Services',
    category: 'Fire & Emergency Safety',
    icon: '🔥'
  }
];

const resolveInitialDept = (adm?: any) => {
  if (!adm) return 'road_pwd';
  if (adm.dept_key) return adm.dept_key;
  const raw = (adm.department || '').toLowerCase();
  if (raw === 'electric' || raw === 'electricity') return 'electricity_infra';
  if (raw === 'road') return 'road_pwd';
  if (raw === 'water') return 'water_supply';
  if (raw === 'forest') return 'trees_parks';
  const match = CIVIC_DEPARTMENTS_LIST.find(d => d.value === raw);
  if (match) return match.value;
  return 'road_pwd';
};

export default function AdminModal({ isOpen, onClose, onSave, admin }: AdminModalProps) {
  const [formData, setFormData] = useState({
    full_name: admin?.full_name || '',
    email: admin?.email || '',
    phone_number: admin?.phone_number || '',
    department: resolveInitialDept(admin),
    password: '',
    is_active: admin?.is_active ?? true
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const selectedDept = CIVIC_DEPARTMENTS_LIST.find(d => d.value === formData.department) || CIVIC_DEPARTMENTS_LIST[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full p-4 sm:p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {admin ? 'Edit Department Admin' : 'Add New Department Admin'}
                </h3>
                <p className="text-[11px] text-gray-500">Assign civic jurisdiction and administrative credentials</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g. Ramesh Patil"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="admin@dept.gov.in"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="10-digit mobile"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Department / Authority *
              </label>
              <select
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              >
                {CIVIC_DEPARTMENTS_LIST.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.icon} {dept.label} — [{dept.category}]
                  </option>
                ))}
              </select>

              {selectedDept && (
                <div className="mt-1.5 flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{selectedDept.icon}</span>
                    <div>
                      <span className="font-semibold text-gray-900 block">{selectedDept.category}</span>
                      <span className="text-[10px] text-gray-500">{selectedDept.label}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200">
                    Civic Authority
                  </span>
                </div>
              )}
            </div>

            {!admin && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required={!admin}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Minimum 6 characters"
                />
              </div>
            )}

            <div className="flex items-center pt-1">
              <input
                type="checkbox"
                id="modal_is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-3.5 h-3.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="modal_is_active" className="ml-2 text-xs text-gray-700 cursor-pointer">
                Active administrator account
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs font-semibold shadow-2xs"
              >
                {admin ? 'Update Admin' : 'Create Admin'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
