'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ContentCard } from '@/components/shared/ContentCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { PLATFORMS } from '@/constants/theme';
import { supabase } from '@/services/supabase';
import { Plus, FileText, Pencil, Trash2 } from 'lucide-react';
import type { Platform, ContentType, ContentIdea } from '@/types/models';

export default function ContentPage() {
  const { profile } = useAuthStore();
  const [filter, setFilter] = useState<'all' | Platform>('all');
  const [items, setItems] = useState<ContentIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentIdea | null>(null);
  const [form, setForm] = useState({ title: '', description: '', platform: 'instagram' as Platform, content_type: 'post' as ContentType });

  useEffect(() => { loadItems(); }, [profile]);

  const loadItems = async () => {
    if (!profile) return;
    setLoading(true);
    const { data } = await supabase.from('content_ideas').select('*').eq('user_id', profile.id).order('created_at', { ascending: false });
    if (data) setItems(data as ContentIdea[]);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!profile || !form.title.trim()) return;
    if (editingItem) {
      await supabase.from('content_ideas').update({ title: form.title, description: form.description, platform: form.platform, content_type: form.content_type }).eq('id', editingItem.id);
    } else {
      await supabase.from('content_ideas').insert({ user_id: profile.id, title: form.title, description: form.description, platform: form.platform, content_type: form.content_type, status: 'idea' });
    }
    setShowAdd(false); setEditingItem(null);
    setForm({ title: '', description: '', platform: 'instagram', content_type: 'post' });
    loadItems();
  };

  const handleEdit = (item: ContentIdea) => {
    setEditingItem(item);
    setForm({ title: item.title, description: item.description, platform: item.platform, content_type: item.content_type });
    setShowAdd(true);
  };

  const handleDelete = async (id: string) => { await supabase.from('content_ideas').delete().eq('id', id); loadItems(); };

  const handleToggleStatus = async (item: ContentIdea) => {
    const next = item.status === 'idea' ? 'saved' : item.status === 'saved' ? 'used' : 'idea';
    await supabase.from('content_ideas').update({ status: next }).eq('id', item.id);
    loadItems();
  };

  const filtered = filter === 'all' ? items : items.filter((i) => i.platform === filter);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--c-text-on-surface)', margin: 0 }}>Content</h1>
          <p style={{ fontSize: '14px', color: 'var(--c-text-secondary)', margin: '4px 0 0 0' }}>{items.length} ideas saved</p>
        </div>
        <Button size="sm" onClick={() => { setEditingItem(null); setForm({ title: '', description: '', platform: 'instagram', content_type: 'post' }); setShowAdd(true); }}>
          <Plus size={16} /> Add Idea
        </Button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button onClick={() => setFilter('all')} style={{
          padding: '8px 14px', borderRadius: '9999px', cursor: 'pointer',
          fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap',
          backgroundColor: filter === 'all' ? 'var(--c-text-on-surface)' : 'var(--c-surface)',
          color: filter === 'all' ? 'var(--c-surface)' : 'var(--c-text-on-surface)',
          border: `1px solid ${filter === 'all' ? 'transparent' : 'var(--c-border-strong)'}`,
        }}>All</button>
        {PLATFORMS.map((p) => (
          <button key={p.id} onClick={() => setFilter(p.id as Platform)} style={{
            padding: '8px 14px', borderRadius: '9999px', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap',
            backgroundColor: filter === p.id ? p.color : 'var(--c-surface)',
            color: filter === p.id ? '#FFFFFF' : 'var(--c-text-on-surface)',
          }}>{p.label}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map(i => <Card key={i} style={{ height: '120px' }}>&nbsp;</Card>)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<FileText size={40} />} title="No content ideas yet" description="Add your first content idea to get started"
          action={<Button size="sm" onClick={() => setShowAdd(true)}>Add Idea</Button>}
        />
      ) : (
        <div className="grid-content">
          {filtered.map((item) => (
            <div key={item.id} style={{ position: 'relative' }}>
              <ContentCard title={item.title} description={item.description} platform={item.platform} contentType={item.content_type} status={item.status as any} onClick={() => handleToggleStatus(item)} />
              <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
                <button onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                  style={{ width: '28px', height: '28px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--c-surface-hover)', color: 'var(--c-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Pencil size={14} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                  style={{ width: '28px', height: '28px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--c-surface-hover)', color: 'var(--c-error)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => { setShowAdd(false); setEditingItem(null); }} title={editingItem ? 'Edit Idea' : 'Add Content Idea'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input label="Title" placeholder="Content title" value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} />
          <Input label="Description" placeholder="What's this about?" value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--c-text-on-surface)' }}>Platform</label>
            <select value={form.platform} onChange={(e) => setForm(p => ({ ...p, platform: e.target.value as Platform }))}
              style={{ padding: '12px 16px', borderRadius: '12px', border: '1.5px solid var(--c-border-strong)', backgroundColor: '#FFFFFF', color: 'var(--c-text-on-surface)', fontSize: '16px', outline: 'none', cursor: 'pointer' }}>
              {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--c-text-on-surface)' }}>Content Type</label>
            <select value={form.content_type} onChange={(e) => setForm(p => ({ ...p, content_type: e.target.value as ContentType }))}
              style={{ padding: '12px 16px', borderRadius: '12px', border: '1.5px solid var(--c-border-strong)', backgroundColor: '#FFFFFF', color: 'var(--c-text-on-surface)', fontSize: '16px', outline: 'none', cursor: 'pointer' }}>
              <option value="reel">Reel</option><option value="story">Story</option><option value="post">Post</option>
              <option value="video">Video</option><option value="carousel">Carousel</option><option value="thread">Thread</option>
              <option value="article">Article</option>
            </select>
          </div>
          <Button fullWidth onClick={handleSave} disabled={!form.title.trim()}>{editingItem ? 'Save Changes' : 'Add Idea'}</Button>
        </div>
      </Modal>
    </div>
  );
}
