'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { BORDER_RADIUS } from '@/constants/theme';
import { Sparkles, Calendar, BarChart3, ArrowRight, Layers } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, initialized } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (initialized && user) router.replace('/plan');
  }, [user, initialized, router]);

  if (!mounted) return null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--c-bg)' }}>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 32px', maxWidth: '1200px', margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: `${BORDER_RADIUS.sm}px`,
            backgroundColor: 'var(--c-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={16} color="#FFFFFF" />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--c-text)' }}>Vera</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={() => router.push('/auth/signin')}>Sign In</Button>
          <Button size="sm" onClick={() => router.push('/auth/signup')}>Get Started</Button>
        </div>
      </nav>

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 100px', textAlign: 'center', maxWidth: '680px', margin: '0 auto',
      }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: `${BORDER_RADIUS.xl}px`,
          backgroundColor: 'var(--c-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '28px', boxShadow: '0 8px 32px var(--c-shadow)',
        }}>
          <Sparkles size={36} color="#FFFFFF" />
        </div>

        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 700, color: 'var(--c-text)',
          margin: '0 0 16px 0', letterSpacing: '-1.5px', lineHeight: '1.1',
        }}>
          Plan content that<br />actually grows
        </h1>

        <p style={{
          fontSize: '18px', color: 'var(--c-text)', margin: '0 0 40px 0',
          lineHeight: '1.6', maxWidth: '460px', opacity: 0.85,
        }}>
          AI-powered weekly content plans tailored to your platforms, niche, and goals.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button size="lg" onClick={() => router.push('/auth/signup')}>
            Get Started Free <ArrowRight size={18} />
          </Button>
          <Button size="lg" variant="secondary" onClick={() => router.push('/auth/signin')}>
            Sign In
          </Button>
        </div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--c-text)', textAlign: 'center', margin: '0 0 32px 0' }}>
          Everything you need to plan smarter
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <FeatureCard icon={<Calendar size={22} />} title="7-Day AI Plans" description="Get a full week of content ideas generated from your niche, platforms, and goals." />
          <FeatureCard icon={<BarChart3 size={22} />} title="Track Progress" description="Mark items complete and see your weekly progress at a glance." />
          <FeatureCard icon={<Layers size={22} />} title="Multi-Platform" description="Plans spread across YouTube, Instagram, TikTok, Twitter, LinkedIn, and your blog." />
        </div>
      </div>

      <footer style={{
        borderTop: '1px solid var(--c-border)', padding: '24px 32px',
        textAlign: 'center', fontSize: '13px', color: 'var(--c-text)', opacity: 0.6,
      }}>
        Vera — AI Content Planning Assistant
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div style={{
      backgroundColor: 'var(--c-surface)', borderRadius: '16px', padding: '24px',
      border: '1px solid var(--c-border)', transition: 'all 0.2s ease',
      color: 'var(--c-text-on-surface)',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--c-border-strong)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--c-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px',
        backgroundColor: 'var(--c-primary-subtle)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', color: 'var(--c-primary)', marginBottom: '16px',
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px 0' }}>{title}</h3>
      <p style={{ fontSize: '14px', color: 'var(--c-text-secondary)', margin: 0, lineHeight: '1.5' }}>{description}</p>
    </div>
  );
}
