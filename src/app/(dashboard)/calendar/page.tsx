'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PLATFORMS, DAYS } from '@/constants/theme';
import { supabase } from '@/services/supabase';
import type { PlanItem } from '@/types/models';

export default function CalendarPage() {
  const { profile } = useAuthStore();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => { loadItems(); }, [profile]);

  const loadItems = async () => {
    if (!profile) return;
    const { data } = await supabase
      .from('plan_items')
      .select('*, content_plans!inner(user_id, status)')
      .eq('content_plans.user_id', profile.id)
      .eq('content_plans.status', 'active');
    if (data) setPlanItems(data.map((item: any) => ({
      id: item.id, plan_id: item.plan_id, day: item.day, platform: item.platform,
      content_type: item.content_type, title: item.title, description: item.description,
      status: item.status, created_at: item.created_at,
    })));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const isToday = (day: number | null) => {
    if (!day) return false;
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const getDayName = (day: number | null): string => {
    if (!day) return '';
    const date = new Date(year, month, day);
    return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  };

  const getItemsForDay = (day: number | null): PlanItem[] => {
    if (!day) return [];
    const dayName = getDayName(day);
    return planItems.filter(i => i.day === dayName);
  };

  const selectedDayItems = selectedDay ? planItems.filter(i => i.day === selectedDay) : [];

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--c-text)', margin: '0 0 20px 0' }}>Calendar</h1>

      <div className="grid-calendar">
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--c-text-secondary)', padding: '4px 8px' }}>←</button>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--c-text)', margin: 0 }}>{monthName}</h2>
            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--c-text-secondary)', padding: '4px 8px' }}>→</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} style={{ textAlign: 'center', fontSize: '12px', fontWeight: 500, color: 'var(--c-text-muted)', padding: '8px 0' }}>{d}</div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {calendarDays.map((day, i) => {
              const items = getItemsForDay(day);
              const hasItems = items.length > 0;
              return (
                <button key={i} onClick={() => { if (day) setSelectedDay(getDayName(day)); }}
                  style={{
                    aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', borderRadius: '8px', fontSize: '14px', gap: '2px',
                    fontWeight: isToday(day) ? 600 : 400, border: 'none', cursor: day ? 'pointer' : 'default',
                    backgroundColor: isToday(day) ? 'var(--c-primary)' : selectedDay === getDayName(day) ? 'var(--c-primary-subtle)' : 'transparent',
                    color: isToday(day) ? '#FFFFFF' : day ? 'var(--c-text)' : 'transparent',
                  }}>
                  {day}
                  {hasItems && <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: isToday(day) ? '#FFFFFF' : 'var(--c-primary)' }} />}
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--c-text)', margin: '0 0 12px 0' }}>
            {selectedDay ? `${selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}` : 'Today'}&apos;s Content
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(selectedDay ? selectedDayItems : planItems.filter(i => i.day === today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase())).length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--c-text-muted)', margin: 0, fontStyle: 'italic' }}>No content planned</p>
            ) : (
              (selectedDay ? selectedDayItems : planItems.filter(i => i.day === today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase())).map(item => {
                const platform = PLATFORMS.find(p => p.id === item.platform);
                return (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px',
                    backgroundColor: 'var(--c-primary-subtle)', borderRadius: '8px',
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: item.status === 'completed' ? 'var(--c-success)' : 'var(--c-primary)' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--c-text)', margin: 0 }}>{item.title}</p>
                      <p style={{ fontSize: '12px', color: 'var(--c-text-secondary)', margin: 0 }}>{platform?.label || item.platform}</p>
                    </div>
                    <Badge color={item.status === 'completed' ? 'var(--c-success)' : item.status === 'in_progress' ? 'var(--c-warning)' : 'var(--c-text-secondary)'} size="sm">
                      {item.status === 'completed' ? 'Done' : item.status === 'in_progress' ? 'In Progress' : 'Pending'}
                    </Badge>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
