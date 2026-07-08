'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Avatar } from '@/components/ui/Avatar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { BORDER_RADIUS } from '@/constants/theme';
import { Calendar, FileText, LayoutGrid, User, Sparkles } from 'lucide-react';

const navItems = [
  { id: '/plan', label: 'Plan', icon: Calendar },
  { id: '/content', label: 'Content', icon: FileText },
  { id: '/calendar', label: 'Calendar', icon: LayoutGrid },
  { id: '/profile', label: 'Profile', icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useAuthStore();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sidebar-desktop" style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: '240px',
        backgroundColor: 'var(--c-surface)', borderRight: '1px solid var(--c-border)',
        flexDirection: 'column', padding: '24px 16px', zIndex: 30,
        display: 'flex', color: 'var(--c-text-on-surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', padding: '0 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: `${BORDER_RADIUS.md}px`,
              backgroundColor: 'var(--c-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={18} color="#FFFFFF" />
            </div>
            <span style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.5px' }}>Vera</span>
          </div>
          <ThemeToggle />
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {navItems.map((item) => {
            const active = pathname.startsWith(item.id);
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => router.push(item.id)} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px', borderRadius: `${BORDER_RADIUS.md}px`,
                background: active ? 'var(--c-primary-subtle)' : 'none',
                border: 'none', cursor: 'pointer',
                color: active ? 'var(--c-primary)' : 'var(--c-text-secondary)',
                fontWeight: active ? 600 : 400, fontSize: '15px',
                textAlign: 'left', width: '100%', transition: 'all 0.15s ease',
              }}>
                <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {profile && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '12px',
            borderRadius: `${BORDER_RADIUS.md}px`, backgroundColor: 'var(--c-primary-subtle)',
          }}>
            <Avatar name={profile.display_name} size="sm" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '14px', fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {profile.display_name}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--c-text-secondary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {profile.niche || 'Creator'}
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile bottom nav */}
      <nav className="sidebar-bottomnav" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        backgroundColor: 'var(--c-surface)', borderTop: '1px solid var(--c-border)',
        padding: '8px 0', paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        zIndex: 40, justifyContent: 'space-around',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
          {navItems.map((item) => {
            const active = pathname.startsWith(item.id);
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => router.push(item.id)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '4px', padding: '6px 16px', background: 'none', border: 'none',
                cursor: 'pointer', color: active ? 'var(--c-primary)' : 'var(--c-text-secondary)',
                transition: 'color 0.2s ease',
              }}>
                <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
                <span style={{ fontSize: '11px', fontWeight: active ? 600 : 400 }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
