'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BORDER_RADIUS, PLATFORMS } from '@/constants/theme';
import { Platform } from '@/types/models';
import { ArrowLeft, ArrowRight, Check, FileText, Sparkles } from 'lucide-react';
import { SiYoutube, SiTiktok, SiInstagram, SiX } from '@icons-pack/react-simple-icons';
import { supabase } from '@/services/supabase';

const NICHE_OPTIONS = [
  'Fitness & Health', 'Business & Finance', 'Education', 'Lifestyle',
  'Technology', 'Food & Cooking', 'Travel', 'Fashion & Beauty',
  'Entertainment', 'Music', 'Art & Design', 'Other',
];
const TONE_OPTIONS = [
  'Professional', 'Casual & Friendly', 'Inspirational', 'Educational',
  'Humorous', 'Bold & Edgy', 'Calm & Soothing', 'Energetic',
];
const GOAL_OPTIONS = [
  'Grow audience', 'Increase engagement', 'Build community',
  'Drive sales', 'Establish authority', 'Monetize content',
];

const LinkedInIcon = ({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const PLATFORM_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  youtube: SiYoutube,
  tiktok: SiTiktok,
  instagram: SiInstagram,
  twitter: SiX,
  linkedin: LinkedInIcon,
  blog: FileText,
};

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  const { step, setStep, displayName, setDisplayName, niche, setNiche, platforms, togglePlatform, toneOfVoice, setToneOfVoice, goals, toggleGoal } = useOnboardingStore();
  const [saving, setSaving] = useState(false);

  const canNext = () => {
    if (step === 1) return displayName.trim().length > 0;
    if (step === 2) return niche.length > 0;
    if (step === 3) return platforms.length > 0;
    if (step === 4) return toneOfVoice.length > 0;
    return true;
  };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('profiles').update({
        display_name: displayName, niche, platforms, tone_of_voice: toneOfVoice, goals, onboarded: true,
      }).eq('id', user.id);
      if (error) console.warn('Supabase update failed:', error.message);
      updateProfile({ display_name: displayName, niche, platforms, tone_of_voice: toneOfVoice, goals, onboarded: true });
      router.replace('/plan');
    } catch (err) {
      console.warn('Onboarding save failed:', err);
      updateProfile({ display_name: displayName, niche, platforms, tone_of_voice: toneOfVoice, goals, onboarded: true });
      router.replace('/plan');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--c-bg)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-text)', padding: 0, opacity: 0.8 }}><ArrowLeft size={20} /></button>
          ) : <div style={{ width: 20 }} />}
          <div style={{ flex: 1, height: '4px', backgroundColor: 'var(--c-border)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(step / 5) * 100}%`, backgroundColor: 'var(--c-primary)', borderRadius: '9999px', transition: 'width 0.3s ease' }} />
          </div>
          <span style={{ fontSize: '13px', color: 'var(--c-text)', opacity: 0.6 }}>Step {step}/5</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px', maxWidth: '480px', margin: '0 auto', width: '100%' }}>
        <div className="animate-fade-in" key={step}>
          {step === 1 && (
            <>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--c-text)', margin: '0 0 8px 0' }}>What&apos;s your name?</h2>
              <p style={{ fontSize: '15px', color: 'var(--c-text)', margin: '0 0 24px 0', opacity: 0.8 }}>We&apos;ll use this to personalize your experience</p>
              <Input placeholder="Your display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} autoFocus />
            </>
          )}
          {step === 2 && (
            <>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--c-text)', margin: '0 0 8px 0' }}>What&apos;s your niche?</h2>
              <p style={{ fontSize: '15px', color: 'var(--c-text)', margin: '0 0 24px 0', opacity: 0.8 }}>This helps us tailor content ideas for you</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {NICHE_OPTIONS.map((n) => (
                  <button key={n} onClick={() => setNiche(n)} style={{
                    padding: '10px 16px', borderRadius: `${BORDER_RADIUS.md}px`,
                    border: `1.5px solid ${niche === n ? 'var(--c-primary)' : 'var(--c-border-strong)'}`,
                    backgroundColor: niche === n ? 'var(--c-primary-subtle)' : 'var(--c-surface)',
                    color: niche === n ? 'var(--c-primary)' : 'var(--c-text-on-surface)',
                    fontWeight: 500, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s ease',
                  }}>{n}</button>
                ))}
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--c-text)', margin: '0 0 8px 0' }}>Which platforms?</h2>
              <p style={{ fontSize: '15px', color: 'var(--c-text)', margin: '0 0 24px 0', opacity: 0.8 }}>Select all the platforms you create for</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {PLATFORMS.map((p) => {
                  const selected = platforms.includes(p.id as Platform);
                  return (
                    <button key={p.id} onClick={() => togglePlatform(p.id as Platform)} style={{
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                      borderRadius: `${BORDER_RADIUS.md}px`,
                      border: `1.5px solid ${selected ? p.color : 'var(--c-border-strong)'}`,
                      backgroundColor: selected ? `color-mix(in srgb, ${p.color} 10%, var(--c-surface))` : 'var(--c-surface)',
                      cursor: 'pointer', transition: 'all 0.2s ease', textAlign: 'left',
                    }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: `${BORDER_RADIUS.sm}px`,
                        backgroundColor: `color-mix(in srgb, ${p.color} 15%, transparent)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {(() => {
                          const Icon = PLATFORM_ICONS[p.id];
                          return Icon ? <Icon size={18} color={p.color} /> : null;
                        })()}
                      </div>
                      <span style={{ flex: 1, fontSize: '15px', fontWeight: 500, color: 'var(--c-text-on-surface)' }}>{p.label}</span>
                      {selected && (
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={12} color="#FFFFFF" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--c-text)', margin: '0 0 8px 0' }}>Your tone of voice</h2>
              <p style={{ fontSize: '15px', color: 'var(--c-text)', margin: '0 0 24px 0', opacity: 0.8 }}>How should your content sound?</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {TONE_OPTIONS.map((t) => (
                  <button key={t} onClick={() => setToneOfVoice(t)} style={{
                    padding: '10px 16px', borderRadius: `${BORDER_RADIUS.md}px`,
                    border: `1.5px solid ${toneOfVoice === t ? 'var(--c-primary)' : 'var(--c-border-strong)'}`,
                    backgroundColor: toneOfVoice === t ? 'var(--c-primary-subtle)' : 'var(--c-surface)',
                    color: toneOfVoice === t ? 'var(--c-primary)' : 'var(--c-text-on-surface)',
                    fontWeight: 500, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s ease',
                  }}>{t}</button>
                ))}
              </div>
            </>
          )}
          {step === 5 && (
            <>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--c-text)', margin: '0 0 8px 0' }}>Your goals</h2>
              <p style={{ fontSize: '15px', color: 'var(--c-text)', margin: '0 0 24px 0', opacity: 0.8 }}>What do you want to achieve?</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {GOAL_OPTIONS.map((g) => {
                  const selected = goals.includes(g);
                  return (
                    <button key={g} onClick={() => toggleGoal(g)} style={{
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                      borderRadius: `${BORDER_RADIUS.md}px`,
                      border: `1.5px solid ${selected ? 'var(--c-primary)' : 'var(--c-border-strong)'}`,
                      backgroundColor: selected ? 'var(--c-primary-subtle)' : 'var(--c-surface)',
                      cursor: 'pointer', transition: 'all 0.2s ease', textAlign: 'left',
                    }}>
                      <span style={{ flex: 1, fontSize: '15px', fontWeight: 500, color: 'var(--c-text-on-surface)' }}>{g}</span>
                      {selected && (
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--c-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={12} color="#FFFFFF" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ padding: '16px 24px 32px', maxWidth: '480px', margin: '0 auto', width: '100%' }}>
        {step < 5 ? (
          <Button fullWidth size="lg" onClick={() => setStep(step + 1)} disabled={!canNext()}>Continue <ArrowRight size={18} /></Button>
        ) : (
          <Button fullWidth size="lg" onClick={handleFinish} loading={saving} disabled={!canNext()}><Sparkles size={18} /> Start Planning</Button>
        )}
      </div>
    </div>
  );
}
