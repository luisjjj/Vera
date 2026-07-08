'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Sidebar } from '@/components/shared/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, profile, initialized, initialize } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!initialized) initialize();
  }, [initialized, initialize]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (initialized && !user) router.replace('/auth/signin');
  }, [initialized, user, router]);

  useEffect(() => {
    if (initialized && user && profile && !profile.onboarded) {
      router.replace('/onboarding');
    }
  }, [initialized, user, profile, router]);

  if (!mounted || !initialized || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--c-bg)' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid var(--c-border)', borderTopColor: 'var(--c-primary)', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--c-bg)' }}>
      <Sidebar />
      <main className="main-content" style={{ minHeight: '100vh' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 16px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
