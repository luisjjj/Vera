'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { supabase } from '@/services/supabase';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import type { PlanItem } from '@/types/models';

export default function CalendarPage() {
  const { profile } = useAuthStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [items, setItems] = useState<PlanItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => { loadItems(); }, [profile]);

  const loadItems = async () => {
    if (!profile) return;
    const { data } = await supabase.from('plan_items')
      .select('*, content_plans!inner(user_id, status)')
      .eq('content_plans.user_id', profile.id)
      .eq('content_plans.status', 'active');
    if (data) {
      setItems(data.map((item: any) => ({
        id: item.id, plan_id: item.plan_id, day: item.day, platform: item.platform,
        content_type: item.content_type, title: item.title, description: item.description,
        status: item.status, created_at: item.created_at,
      })));
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isToday = (day: number) => today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

  const getDayName = (day: number): string => {
    const d = new Date(year, month, day);
    return d.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  };

  const getItemsForDay = (day: number): PlanItem[] => {
    const dayName = getDayName(day);
    return items.filter((i) => i.day === dayName);
  };

  const selectedItems = selectedDate ? getItemsForDay(parseInt(selectedDate)) : [];

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--c-text-on-surface)', margin: '0 0 16px 0' }}>Calendar</h1>

      <Card style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <button onClick={() => setCurrentDate(new Date(year, month - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--c-text-on-surface)' }}>
            <ChevronLeft size={20} />
          </button>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--c-text-on-surface)', margin: 0 }}>
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={() => setCurrentDate(new Date(year, month + 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--c-text-on-surface)' }}>
            <ChevronRight size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'var(--c-text-muted)', padding: '8px 0' }}>{d}</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
          {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayItems = getItemsForDay(day);
            const isSelected = selectedDate === String(day);
            const hasItems = dayItems.length > 0;
            return (
              <button key={day} onClick={() => setSelectedDate(isSelected ? null : String(day))}
                style={{
                  aspectRatio: '1', border: isSelected ? '2px solid var(--c-primary)' : '1px solid transparent',
                  borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: '2px', position: 'relative',
                  backgroundColor: isToday(day) ? 'var(--c-primary-subtle)' : isSelected ? 'var(--c-surface-hover)' : 'transparent',
                  color: isToday(day) ? 'var(--c-primary)' : 'var(--c-text-on-surface)',
                  fontWeight: isToday(day) || isSelected ? 600 : 400, fontSize: '14px',
                }}>
                {day}
                {hasItems && <div style={{ display: 'flex', gap: '2px' }}>{dayItems.slice(0, 3).map((item, j) => (
                  <div key={j} style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--c-primary)' }} />
                ))}</div>}
              </button>
            );
          })}
        </div>
      </Card>

      {selectedDate ? (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--c-text-on-surface)', margin: '0 0 12px 0' }}>
            {new Date(year, month, parseInt(selectedDate)).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>
          {selectedItems.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedItems.map((item) => (
                <Card key={item.id} style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--c-text-on-surface)', margin: '0 0 4px 0' }}>{item.title}</p>
                      {item.description && <p style={{ fontSize: '13px', color: 'var(--c-text-secondary)', margin: 0 }}>{item.description}</p>}
                    </div>
                    <span style={{
                      fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '9999px', whiteSpace: 'nowrap',
                      backgroundColor: item.status === 'completed' ? 'var(--c-success)' : item.status === 'in_progress' ? 'var(--c-warning)' : 'var(--c-surface-hover)',
                      color: item.status === 'completed' || item.status === 'in_progress' ? '#FFFFFF' : 'var(--c-text-secondary)',
                    }}>{item.status}</span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState icon={<CalendarIcon size={32} />} title="No content planned" description="Add content items to see them here" />
          )}
        </div>
      ) : (
        <EmptyState icon={<CalendarIcon size={32} />} title="Select a day" description="Click on a day to see planned content" />
      )}
    </div>
  );
}
