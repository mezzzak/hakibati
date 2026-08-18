'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('hakibati-session-id');
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem('hakibati-session-id', id);
  }
  return id;
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    // Skip admin and API routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return;

    const sessionId = getSessionId();
    const referrer = document.referrer || '';

    // Debounce: don't track the same path within 5 seconds
    const lastTrack = sessionStorage.getItem(`track-${pathname}`);
    const now = Date.now();
    if (lastTrack && now - parseInt(lastTrack, 10) < 5000) return;
    sessionStorage.setItem(`track-${pathname}`, now.toString());

    const savedWilaya = localStorage.getItem('hakibati-wilaya') || '';

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, sessionId, referrer, wilaya: savedWilaya || undefined }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
