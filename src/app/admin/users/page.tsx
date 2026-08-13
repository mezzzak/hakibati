'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllUsers, createStaffUser, deleteUser, updateUserRole } from '@/lib/admin-actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Trash2,
  Users,
  Search,
  ShieldCheck,
  UserCheck,
  PackageCheck,
  Truck,
  Loader2,
  X,
} from 'lucide-react';

const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'مسؤول', color: 'bg-blue-100 text-blue-700' },
  { value: 'MASTER_ADMIN', label: 'مدير النظام', color: 'bg-purple-100 text-purple-700' },
  { value: 'ORDER_CONFIRMATION_AGENT', label: 'وكيل تأكيد الطلبات', color: 'bg-amber-100 text-amber-700' },
  { value: 'PREP_AGENT', label: 'وكيل تجهيز الطلبات', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'SHIPPING_AGENT', label: 'وكيل الشحن', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'CUSTOMER', label: 'عميل', color: 'bg-muted text-muted-foreground' },
];

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'مسؤول',
  MASTER_ADMIN: 'مدير النظام',
  ORDER_CONFIRMATION_AGENT: 'وكيل تأكيد الطلبات',
  PREP_AGENT: 'وكيل تجهيز الطلبات',
  SHIPPING_AGENT: 'وكيل الشحن',
  CUSTOMER: 'عميل',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    phone: '',
    fullName: '',
    password: '',
    role: 'ORDER_CONFIRMATION_AGENT',
    wilaya: 'الجزائر',
    email: '',
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const result = await getAllUsers({
      search: search || undefined,
      role: roleFilter || undefined,
    });
    if (result.success) {
      setUsers(result.users || []);
    }
    setLoading(false);
  }, [search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const result = await createStaffUser(form);
    setSaving(false);
    if (result.success) {
      setDrawerOpen(false);
      setForm({ phone: '', fullName: '', password: '', role: 'ORDER_CONFIRMATION_AGENT', wilaya: 'الجزائر', email: '' });
      fetchUsers();
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    const result = await deleteUser(id);
    if (result.success) {
      fetchUsers();
    } else {
      alert(result.error);
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    const result = await updateUserRole(id, newRole);
    if (result.success) {
      fetchUsers();
    } else {
      alert(result.error);
    }
  };

  const getRoleBadge = (role: string) => {
    const opt = ROLE_OPTIONS.find((r) => r.value === role);
    return opt ? (
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${opt.color}`}>{opt.label}</span>
    ) : (
      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs">{role}</span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">المستخدمين</h1>
          <p className="text-muted-foreground text-sm">إدارة حسابات المسؤولين والعملاء</p>
        </div>
        <Button onClick={() => setDrawerOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          مستخدم جديد
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="بحث بالاسم أو الهاتف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-background pr-10 pl-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">كل الأدوار</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">لا يوجد مستخدمون</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-right font-medium">الاسم</th>
                  <th className="px-4 py-3 text-right font-medium">الهاتف</th>
                  <th className="px-4 py-3 text-right font-medium">الدور</th>
                  <th className="px-4 py-3 text-right font-medium">الولاية</th>
                  <th className="px-4 py-3 text-right font-medium">تاريخ التسجيل</th>
                  <th className="px-4 py-3 text-right font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{user.fullName}</p>
                        {user.email && <p className="text-xs text-muted-foreground">{user.email}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono">{user.phone}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getRoleBadge(user.role)}
                        {user.role !== 'MASTER_ADMIN' && (
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="rounded border border-input bg-background px-2 py-1 text-xs outline-none"
                          >
                            {ROLE_OPTIONS.filter((r) => r.value !== 'MASTER_ADMIN').map((r) => (
                              <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{user.wilaya}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString('ar-DZ')}
                    </td>
                    <td className="px-4 py-3">
                      {user.role !== 'MASTER_ADMIN' && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="rounded-lg p-1.5 hover:bg-red-50 transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDrawerOpen(false)}>
          <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">إنشاء مستخدم جديد</h2>
              <button onClick={() => setDrawerOpen(false)} className="rounded-lg p-1 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">الاسم الكامل *</label>
                <input
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">رقم الهاتف *</label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="0555000000"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">كلمة المرور *</label>
                <input
                  required
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">الدور *</label>
                <select
                  required
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {ROLE_OPTIONS.filter((r) => r.value !== 'CUSTOMER' && r.value !== 'MASTER_ADMIN').map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">الولاية *</label>
                <input
                  required
                  value={form.wilaya}
                  onChange={(e) => setForm({ ...form, wilaya: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setDrawerOpen(false)}>إلغاء</Button>
                <Button size="sm" type="submit" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'إنشاء'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
