'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useLanguage } from '@/components/language-provider';
import {
  UserCircle,
  ShoppingBag,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Settings,
} from 'lucide-react';

const STAFF_ROLES = ['ADMIN', 'MASTER_ADMIN', 'ORDER_CONFIRMATION_AGENT', 'PREP_AGENT', 'SHIPPING_AGENT'];

function isStaff(role?: string) {
  return STAFF_ROLES.includes(role || '');
}

function getRoleLabel(role?: string, t?: (ar: string, fr: string) => string) {
  const translate = t || ((ar: string) => ar);
  switch (role) {
    case 'MASTER_ADMIN':
      return translate('مدير النظام', 'Directeur système');
    case 'ADMIN':
      return translate('مسؤول', 'Administrateur');
    case 'ORDER_CONFIRMATION_AGENT':
      return translate('وكيل تأكيد الطلبات', 'Agent confirmation');
    case 'PREP_AGENT':
      return translate('وكيل تجهيز الطلبات', 'Agent préparation');
    case 'SHIPPING_AGENT':
      return translate('وكيل الشحن', 'Agent livraison');
    default:
      return translate('عميل', 'Client');
  }
}

interface UserDropdownProps {
  user: {
    name?: string | null;
    role?: string;
  };
}

export function UserDropdown({ user }: UserDropdownProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.href = '/';
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <UserCircle className="h-4 w-4" />
        <span className="hidden sm:inline max-w-[80px] truncate">{user.name}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-xl border bg-background p-1 shadow-lg">
          <div className="px-3 py-2">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-muted-foreground">
              {getRoleLabel(user.role, t)}
            </p>
          </div>

          <div className="border-t my-1" />

          {isStaff(user.role) ? (
            <Link
              href="/admin/orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              {t('لوحة الإدارة', 'Tableau de bord')}
            </Link>
          ) : (
            <>
              <Link
                href="/account/orders"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                {t('طلباتي', 'Mes commandes')}
              </Link>
              <Link
                href="/account/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Settings className="h-4 w-4" />
                {t('ملفي الشخصي', 'Mon profil')}
              </Link>
            </>
          )}

          <div className="border-t my-1" />

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            {t('تسجيل الخروج', 'Déconnexion')}
          </button>
        </div>
      )}
    </div>
  );
}
