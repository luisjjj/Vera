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

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, loading } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) { setError('Please fill in all fields'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    try { setError(''); await signUp(email, password, name); router.push('/onboarding'); }
    catch (err: any) { setError(err.message || 'Failed to sign up'); }
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
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--c-text)', margin: '0 0 8px 0' }}>Create your account</h1>
          <p style={{ fontSize: '15px', color: 'var(--c-text-secondary)', margin: 0 }}>Start planning your content with AI</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" placeholder="6+ characters" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p style={{ fontSize: '13px', color: 'var(--c-error)', margin: 0 }}>{error}</p>}
          <Button fullWidth size="lg" onClick={handleSignUp} loading={loading}>Create Account</Button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--c-text-secondary)', marginTop: '24px' }}>
          Already have an account?{' '}
          <Link href="/auth/signin" style={{ color: 'var(--c-primary)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
