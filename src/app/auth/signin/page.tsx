'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { BORDER_RADIUS } from '@/constants/theme';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const { signIn, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) { setError('Please fill in all fields'); return; }
    try { setError(''); await signIn(email, password); router.push('/plan'); }
    catch (err: any) { setError(err.message || 'Failed to sign in'); }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--c-bg)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: 'var(--c-text-secondary)', textDecoration: 'none' }}><ArrowLeft size={20} /></Link>
        <ThemeToggle />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px', maxWidth: '400px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: `${BORDER_RADIUS.lg}px`,
            backgroundColor: 'var(--c-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 4px 16px var(--c-shadow)',
          }}>
            <Sparkles size={22} color="#FFFFFF" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--c-text)', margin: '0 0 8px 0' }}>Welcome back</h1>
          <p style={{ fontSize: '15px', color: 'var(--c-text-secondary)', margin: 0 }}>Sign in to continue planning</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p style={{ fontSize: '13px', color: 'var(--c-error)', margin: 0 }}>{error}</p>}
          <Button fullWidth size="lg" onClick={handleSignIn} loading={loading}>Sign In</Button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--c-text-secondary)', marginTop: '24px' }}>
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" style={{ color: 'var(--c-primary)', textDecoration: 'none', fontWeight: 500 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
