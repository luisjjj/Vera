'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Greeting } from '@/components/shared/Greeting';
import { QuickAction } from '@/components/shared/QuickAction';
import { WeeklyProgress } from '@/components/shared/WeeklyProgress';
import { DayCard } from '@/components/shared/DayCard';
import { DAYS, PLATFORMS } from '@/constants/theme';
import { generateWeeklyPlan } from '@/services/gemini';
import { supabase } from '@/services/supabase';
import { Sparkles, Plus, RefreshCw, Trash2 } from 'lucide-react';
import type { PlanItem, Platform, ContentType } from '@/types/models';

export default function PlanPage() {
  const { profile } = useAuthStore();
  const [generating, setGenerating] = useState(false);
  const [weekItems, setWeekItems] = useState<PlanItem[]>([]);
  const [weekTitle, setWeekTitle] = useState('');
  const [planId, setPlanId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addItem, setAddItem] = useState({ title: '', description: '', platform: 'instagram' as Platform, content_type: 'post' as ContentType, day: 'monday' as string });

  useEffect(() => { loadExistingPlan(); }, [profile]);

  const loadExistingPlan = async () => {
    if (!profile) return;
    const { data } = await supabase
      .from('content_plans')
      .select('*, plan_items(*)')
      .eq('user_id', profile.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setPlanId(data.id);
      setWeekTitle(data.title || 'This Week\'s Content Plan');
      setWeekItems((data.plan_items || []).map((item: any) => ({
        id: item.id, plan_id: item.plan_id, day: item.day, platform: item.platform,
        content_type: item.content_type, title: item.title, description: item.description,
        status: item.status || 'pending', created_at: item.created_at,
      })));
    }
  };

  const handleGenerate = async () => {
    if (!profile) return;
    setGenerating(true);
    try {
      const items = await generateWeeklyPlan({
        platforms: profile.platforms as any[], niche: profile.niche,
        tone: profile.tone_of_voice, goals: profile.goals,
        weekStart: new Date().toISOString().split('T')[0],
      });

      const { data: plan } = await supabase.from('content_plans').insert({
        user_id: profile.id, title: 'This Week\'s Content Plan',
        week_start: new Date().toISOString().split('T')[0], status: 'active', generated_by: 'ai',
      }).select().single();

      if (plan) {
        setPlanId(plan.id);
        const planItems: PlanItem[] = items.map((item, i) => ({
          id: `temp-${i}`, plan_id: plan.id, ...item, status: 'pending' as const, created_at: new Date().toISOString(),
        }));
        const { data: savedItems } = await supabase.from('plan_items')
          .insert(planItems.map(item => ({
            plan_id: plan.id, day: item.day, platform: item.platform, content_type: item.content_type,
            title: item.title, description: item.description, status: 'pending',
          }))).select();

        if (savedItems) {
          setWeekItems(savedItems.map((item: any) => ({
            id: item.id, plan_id: item.plan_id, day: item.day, platform: item.platform,
            content_type: item.content_type, title: item.title, description: item.description,
            status: item.status, created_at: item.created_at,
          })));
        }
        setWeekTitle('This Week\'s Content Plan');
      }
    } catch (err) { console.error(err); }
    finally { setGenerating(false); }
  };

  const handleToggleStatus = async (item: PlanItem) => {
    const newStatus = item.status === 'completed' ? 'pending' : item.status === 'pending' ? 'in_progress' : 'completed';
    await supabase.from('plan_items').update({ status: newStatus }).eq('id', item.id);
    setWeekItems(prev => prev.map(i => i.id === item.id ? { ...i, status: newStatus as any } : i));
  };

  const handleDeletePlan = async () => {
    if (!planId) return;
    await supabase.from('plan_items').delete().eq('plan_id', planId);
    await supabase.from('content_plans').delete().eq('id', planId);
    setWeekItems([]); setWeekTitle(''); setPlanId(null);
  };

  const handleAddItem = async () => {
    if (!planId || !addItem.title.trim()) return;
    const { data } = await supabase.from('plan_items').insert({
      plan_id: planId, day: addItem.day, platform: addItem.platform, content_type: addItem.content_type,
      title: addItem.title, description: addItem.description, status: 'pending',
    }).select().single();

    if (data) {
      setWeekItems(prev => [...prev, {
        id: data.id, plan_id: data.plan_id, day: data.day, platform: data.platform,
        content_type: data.content_type, title: data.title, description: data.description,
        status: data.status, created_at: data.created_at,
      }]);
    }
    setShowAdd(false);
    setAddItem({ title: '', description: '', platform: 'instagram', content_type: 'post', day: 'monday' });
  };

  const completedCount = weekItems.filter((i) => i.status === 'completed').length;
  const getItemsForDay = (dayId: string) => weekItems.filter((i) => i.day === dayId);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  return (
    <div>
      <div style={{ marginBottom: '24px' }}><Greeting name={profile?.display_name || 'Creator'} /></div>

      {weekItems.length === 0 && !generating ? (
        <>
          <Card style={{ marginBottom: '16px', textAlign: 'center', padding: '40px 24px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              backgroundColor: 'var(--c-primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', color: 'var(--c-primary)',
            }}><Sparkles size={26} /></div>
            <h2 className="heading-lg" style={{ fontWeight: 600, color: 'var(--c-text-on-surface)', margin: '0 0 8px 0' }}>Plan your week</h2>
            <p style={{ fontSize: '15px', color: 'var(--c-text-secondary)', margin: '0 0 24px 0', lineHeight: '1.5', maxWidth: '360px', marginLeft: 'auto', marginRight: 'auto' }}>
              Let AI create a personalized 7-day content plan based on your platforms and niche.
            </p>
            <Button onClick={handleGenerate} loading={generating} size="lg"><Sparkles size={18} /> Generate Weekly Plan</Button>
          </Card>
          <div className="grid-quick-actions">
            <QuickAction icon={<Sparkles size={20} />} label="AI Content Ideas" description="Get fresh ideas for your niche" onClick={handleGenerate} />
            <QuickAction icon={<Plus size={20} />} label="Add Manually" description="Create a content item yourself" onClick={() => {}} />
          </div>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2 className="heading-lg" style={{ fontWeight: 600, color: 'var(--c-text-on-surface)', margin: 0 }}>{weekTitle || 'Your Plan'}</h2>
              <p style={{ fontSize: '13px', color: 'var(--c-text-secondary)', margin: '4px 0 0 0' }}>{weekItems.length} items planned</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Button variant="ghost" size="sm" onClick={() => setShowAdd(true)}><Plus size={16} /> Add</Button>
              <Button variant="ghost" size="sm" onClick={handleGenerate} loading={generating}><RefreshCw size={16} /> Regenerate</Button>
              {planId && <Button variant="ghost" size="sm" onClick={handleDeletePlan} style={{ color: 'var(--c-error)' }}><Trash2 size={16} /> Clear</Button>}
            </div>
          </div>
          <Card style={{ marginBottom: '20px' }}><WeeklyProgress completed={completedCount} total={weekItems.length} /></Card>
          <div className="grid-plan">
            {DAYS.map((day) => (
              <DayCard key={day.id} day={day.label} date={day.short} items={getItemsForDay(day.id).map(i => ({ ...i, onClick: () => handleToggleStatus(i) }))} isToday={day.id === today} />
            ))}
          </div>
        </>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Content Item">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input label="Title" placeholder="Content title" value={addItem.title} onChange={(e) => setAddItem(prev => ({ ...prev, title: e.target.value }))} />
          <Input label="Description" placeholder="What's this about?" value={addItem.description} onChange={(e) => setAddItem(prev => ({ ...prev, description: e.target.value }))} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--c-text-on-surface)' }}>Day</label>
            <select value={addItem.day} onChange={(e) => setAddItem(prev => ({ ...prev, day: e.target.value }))}
              style={{ padding: '12px 16px', borderRadius: '12px', border: '1.5px solid var(--c-border-strong)', backgroundColor: '#FFFFFF', color: 'var(--c-text-on-surface)', fontSize: '16px', outline: 'none', cursor: 'pointer' }}>
              {DAYS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--c-text-on-surface)' }}>Platform</label>
            <select value={addItem.platform} onChange={(e) => setAddItem(prev => ({ ...prev, platform: e.target.value as Platform }))}
              style={{ padding: '12px 16px', borderRadius: '12px', border: '1.5px solid var(--c-border-strong)', backgroundColor: '#FFFFFF', color: 'var(--c-text-on-surface)', fontSize: '16px', outline: 'none', cursor: 'pointer' }}>
              {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>
          <Button fullWidth onClick={handleAddItem} disabled={!addItem.title.trim()}>Add Item</Button>
        </div>
      </Modal>
    </div>
  );
}
