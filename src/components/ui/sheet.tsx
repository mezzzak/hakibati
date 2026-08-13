'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: React.ReactNode;
  side?: 'right' | 'left';
  size?: 'default' | 'wide' | 'full';
}

const sizeClasses = {
  default: 'sm:w-[420px]',
  wide: 'sm:w-[560px] md:w-[640px]',
  full: 'sm:w-[90vw] md:w-[85vw] lg:w-[800px]',
};

export function Sheet({ open, onOpenChange, children, title, side = 'right', size = 'default' }: SheetProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div
        className={cn(
          'fixed inset-y-0 z-50 h-full w-full bg-background shadow-2xl transition-transform duration-300 ease-in-out',
          sizeClasses[size],
          side === 'right' ? 'right-0' : 'left-0'
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-5 py-4 bg-muted/30">
            {title ? (
              <h2 className="text-lg font-bold">{title}</h2>
            ) : (
              <div />
            )}
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full p-2 hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5">{children}</div>
        </div>
      </div>
    </>
  );
}
