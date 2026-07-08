'use client';

import { Badge } from '@/components/ui/Badge';
import { PLATFORMS } from '@/constants/theme';

interface DayCardProps {
  day: string;
  date: string;
  items: { id: string; platform: string; content_type: string; title: string; status: string; onClick?: () => void }[];
  isToday?: boolean;
}

export function DayCard({ day, date, items, isToday }: DayCardProps) {
  return (
    <div style={{
      backgroundColor: 'var(--c-surface)', borderRadius: '16px',
      border: `1px solid ${isToday ? 'var(--c-primary)' : 'var(--c-border)'}`,
      boxShadow: isToday ? '0 0 0 1px var(--c-primary)' : '0 1px 3px var(--c-shadow)',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 16px', borderBottom: '1px solid var(--c-border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: isToday ? 'var(--c-primary)' : 'var(--c-text)' }}>{day}</span>
        <span style={{ fontSize: '12px', color: 'var(--c-text-secondary)' }}>{date}</span>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--c-text-muted)', margin: 0, fontStyle: 'italic' }}>No content planned</p>
        ) : (
          items.map((item) => {
            const platform = PLATFORMS.find((p) => p.id === item.platform);
            return (
              <button key={item.id} onClick={item.onClick} style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px',
                backgroundColor: 'var(--c-primary-subtle)', borderRadius: '8px',
                border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                transition: 'opacity 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                  backgroundColor: item.status === 'completed' ? 'var(--c-success)' : item.status === 'in_progress' ? 'var(--c-warning)' : 'var(--c-primary)',
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: '13px', fontWeight: 500, color: 'var(--c-text)', margin: 0,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    textDecoration: item.status === 'completed' ? 'line-through' : 'none',
                  }}>{item.title}</p>
                </div>
                <Badge color={platform?.color || 'var(--c-text-secondary)'} size="sm">
                  {platform?.label || item.platform}
                </Badge>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
