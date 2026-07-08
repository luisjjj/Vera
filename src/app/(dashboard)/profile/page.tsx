'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { PLATFORMS } from '@/constants/theme';
import { supabase } from '@/services/supabase';
import { LogOut, User as UserIcon, Target, Edit3, Save, Plus, X } from 'lucide-react';
import type { Platform } from '@/types/models';

export default function ProfilePage() {
  const { profile, signOut, updateProfile } = useAuthStore();
  const [showEdit, setShowEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    display_name: '', niche: '', tone_of_voice: '', goals: '',
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);

  useEffect(() => {
    if (profile) {
      setForm({
        display_name: profile.display_name || '',
        niche: profile.niche || '',
        tone_of_voice: profile.tone_of_voice || '',
        goals: Array.isArray(profile.goals) ? profile.goals.join(', ') : (profile.goals as string) || '',
      });
      setSelectedPlatforms((profile.platforms as Platform[]) || []);
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    await updateProfile({
      display_name: form.display_name,
      niche: form.niche,
      tone_of_voice: form.tone_of_voice,
      goals: form.goals ? form.goals.split(',').map((g: string) => g.trim()).filter(Boolean) : [],
      platforms: selectedPlatforms,
    });
    setSaving(false);
    setShowEdit(false);
  };

  const togglePlatform = (id: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--c-text-on-surface)', margin: '0 0 24px 0' }}>Profile</h1>

      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'var(--c-primary-subtle)', color: 'var(--c-primary)', fontSize: '24px', fontWeight: 700,
          }}>
            {profile?.display_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--c-text-on-surface)', margin: 0 }}>{profile?.display_name || 'User'}</h2>
            <p style={{ fontSize: '14px', color: 'var(--c-text-secondary)', margin: '4px 0 0 0' }}>{profile?.email || ''}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'var(--c-surface)' }}>
            <p style={{ fontSize: '12px', color: 'var(--c-text-muted)', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Niche</p>
            <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--c-text-on-surface)', margin: 0 }}>{profile?.niche || 'Not set'}</p>
          </div>
          <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'var(--c-surface)' }}>
            <p style={{ fontSize: '12px', color: 'var(--c-text-muted)', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tone</p>
            <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--c-text-on-surface)', margin: 0 }}>{profile?.tone_of_voice || 'Not set'}</p>
          </div>
        </div>

        {profile?.platforms && (profile.platforms as Platform[]).length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '12px', color: 'var(--c-text-muted)', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Platforms</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(profile.platforms as Platform[]).map(pid => {
                const p = PLATFORMS.find(pl => pl.id === pid);
                return p ? (
                  <span key={pid} style={{
                    padding: '6px 12px', borderRadius: '9999px', fontSize: '13px', fontWeight: 500,
                    backgroundColor: p.color, color: '#FFFFFF',
                  }}>{p.label}</span>
                ) : null;
              })}
            </div>
          </div>
        )}

        {profile?.goals && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '12px', color: 'var(--c-text-muted)', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Goals</p>
            <p style={{ fontSize: '14px', color: 'var(--c-text-on-surface)', margin: 0, lineHeight: '1.5' }}>{profile.goals}</p>
          </div>
        )}
      </Card>

      <Card style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--c-text-on-surface)', margin: '0 0 12px 0' }}>Settings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: 'var(--c-text-on-surface)' }}>Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: '12px' }}>
        <Button variant="secondary" size="lg" onClick={() => setShowEdit(true)} style={{ flex: 1 }}>
          <Edit3 size={18} /> Edit Profile
        </Button>
        <Button variant="danger" size="lg" onClick={signOut} style={{ flex: 1 }}>
          <LogOut size={18} /> Sign Out
        </Button>
      </div>

      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Edit Profile">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input label="Display Name" placeholder="Your name" value={form.display_name}
            onChange={(e) => setForm(p => ({ ...p, display_name: e.target.value }))} />
          <Input label="Niche" placeholder="e.g. Fitness, Tech, Fashion" value={form.niche}
            onChange={(e) => setForm(p => ({ ...p, niche: e.target.value }))} />
          <Input label="Tone of Voice" placeholder="e.g. Friendly, Professional" value={form.tone_of_voice}
            onChange={(e) => setForm(p => ({ ...p, tone_of_voice: e.target.value }))} />
          <Input label="Goals" placeholder="Your content goals" value={form.goals}
            onChange={(e) => setForm(p => ({ ...p, goals: e.target.value }))} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--c-text-on-surface)' }}>Platforms</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {PLATFORMS.map(p => (
                <button key={p.id} onClick={() => togglePlatform(p.id as Platform)}
                  style={{
                    padding: '8px 14px', borderRadius: '9999px', border: 'none', cursor: 'pointer',
                    fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px',
                    backgroundColor: selectedPlatforms.includes(p.id as Platform) ? p.color : 'var(--c-surface)',
                    color: selectedPlatforms.includes(p.id as Platform) ? '#FFFFFF' : 'var(--c-text-on-surface)',
                  }}>
                  {p.label}
                  {selectedPlatforms.includes(p.id as Platform) && <X size={14} />}
                </button>
              ))}
            </div>
          </div>

          <Button fullWidth onClick={handleSave} loading={saving}>
            <Save size={16} /> Save Changes
          </Button>
        </div>
      </Modal>
    </div>
  );
}
