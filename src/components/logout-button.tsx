'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.href = '/';
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className="gap-1.5 rounded-lg transition-all duration-200 ease-out-expo hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
    >
      <LogOut className="h-4 w-4" />
      تسجيل الخروج
    </Button>
  );
}
