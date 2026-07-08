'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/store/themeStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { BORDER_RADIUS, PLATFORMS } from '@/constants/theme';
import { supabase } from '@/services/supabase';
import { LogOut, ChevronRight, Settings, Bell, HelpCircle, Pencil, Sun, Moon } from 'lucide-react';
import type { Platform } from '@/types/models';

export default function ProfilePage() {
  const router = useRouter();
  const { profile, signOut, updateProfile } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({
    display_name: profile?.display_name || '',
    niche: profile?.niche || '',
    tone_of_voice: profile?.tone_of_voice || '',
  });

  const handleSignOut = async () => { await signOut(); router.replace('/'); };

  const handleSave = async () => {
    if (!profile) return;
    await supabase.from('profiles').update({
      display_name: form.display_name, niche: form.niche, tone_of_voice: form.tone_of_voice,
    }).eq('id', profile.id);
    updateProfile({ display_name: form.display_name, niche: form.niche, tone_of_voice: form.tone_of_voice });
    setShowEdit(false);
  };

  if (!profile) return null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--c-text)', margin: 0 }}>Profile</h1>
        <button onClick={() => { setForm({ display_name: profile.display_name, niche: profile.niche, tone_of_voice: profile.tone_of_voice }); setShowEdit(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '12px', border: '1px solid var(--c-border)', backgroundColor: 'var(--c-surface)', color: 'var(--c-text)', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
          <Pencil size={14} /> Edit
        </button>
      </div>

      <div className="grid-profile">
        <div>
          <Card style={{ marginBottom: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Avatar name={profile.display_name} size="lg" />
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--c-text)', margin: 0 }}>{profile.display_name}</h2>
                <p style={{ fontSize: '14px', color: 'var(--c-text-secondary)', margin: '4px 0 0 0' }}>{profile.email}</p>
              </div>
            </div>
          </Card>

          <Card style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--c-text-secondary)', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Creator Info</h3>
            <div className="grid-2col" style={{ marginBottom: '16px' }}>
              <div>
                <p style={{ fontSize: '13px', color: 'var(--c-text-muted)', margin: '0 0 4px 0' }}>Niche</p>
                <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--c-text)', margin: 0 }}>{profile.niche || 'Not set'}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: 'var(--c-text-muted)', margin: '0 0 4px 0' }}>Tone</p>
                <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--c-text)', margin: 0 }}>{profile.tone_of_voice || 'Not set'}</p>
              </div>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: 'var(--c-text-muted)', margin: '0 0 8px 0' }}>Platforms</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {profile.platforms.map((p) => {
                  const platform = PLATFORMS.find((pl) => pl.id === p);
                  return <Badge key={p} color={platform?.color || 'var(--c-text-secondary)'}>{platform?.label || p}</Badge>;
                })}
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card style={{ padding: 0 }}>
            <MenuItem icon={theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />} label={theme === 'dark' ? 'Light Mode' : 'Dark Mode'} onClick={toggleTheme} />
            <MenuItem icon={<Settings size={18} />} label="Settings" onClick={() => {}} />
            <MenuItem icon={<Bell size={18} />} label="Notifications" onClick={() => {}} />
            <MenuItem icon={<HelpCircle size={18} />} label="Help & Support" onClick={() => {}} />
          </Card>
          <div style={{ marginTop: '16px' }}>
            <Button fullWidth variant="secondary" onClick={handleSignOut} style={{ color: 'var(--c-error)', borderColor: 'color-mix(in srgb, var(--c-error) 30%, transparent)' }}>
              <LogOut size={18} /> Sign Out
            </Button>
          </div>
        </div>
      </div>

      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Edit Profile">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input label="Display Name" value={form.display_name} onChange={(e) => setForm(p => ({ ...p, display_name: e.target.value }))} />
          <Input label="Niche" value={form.niche} onChange={(e) => setForm(p => ({ ...p, niche: e.target.value }))} />
          <Input label="Tone of Voice" value={form.tone_of_voice} onChange={(e) => setForm(p => ({ ...p, tone_of_voice: e.target.value }))} />
          <Button fullWidth onClick={handleSave}>Save Changes</Button>
        </div>
      </Modal>
    </div>
  );
}

function MenuItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
      padding: '14px 16px', background: 'none', border: 'none', borderBottom: '1px solid var(--c-border)',
      cursor: 'pointer', textAlign: 'left', color: 'var(--c-text)',
    }}>
      <div style={{ color: 'var(--c-text-secondary)' }}>{icon}</div>
      <span style={{ flex: 1, fontSize: '15px' }}>{label}</span>
      <ChevronRight size={16} style={{ color: 'var(--c-text-muted)' }} />
    </button>
  );
}
