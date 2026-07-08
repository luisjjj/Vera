'use client';

import { Badge } from '@/components/ui/Badge';
import { PLATFORMS } from '@/constants/theme';
import { ContentType, Platform } from '@/types/models';

interface ContentCardProps {
  title: string;
  description: string;
  platform: Platform;
  contentType: ContentType;
  status: 'pending' | 'in_progress' | 'completed';
  onClick?: () => void;
}

const statusConfig = {
  pending: { label: 'Pending', color: 'var(--c-text-secondary)' },
  in_progress: { label: 'In Progress', color: 'var(--c-warning)' },
  completed: { label: 'Done', color: 'var(--c-success)' },
};

export function ContentCard({ title, description, platform, contentType, status, onClick }: ContentCardProps) {
  const platformData = PLATFORMS.find((p) => p.id === platform);
  const statusInfo = statusConfig[status];

  return (
    <div onClick={onClick} style={{
      backgroundColor: 'var(--c-surface)', borderRadius: '16px', padding: '16px',
      boxShadow: '0 1px 3px var(--c-shadow)', border: '1px solid var(--c-border)',
      cursor: onClick ? 'pointer' : 'default', transition: 'all 0.2s ease',
    }}
    onMouseEnter={(e) => { if (onClick) e.currentTarget.style.boxShadow = '0 4px 12px var(--c-shadow)'; }}
    onMouseLeave={(e) => { if (onClick) e.currentTarget.style.boxShadow = '0 1px 3px var(--c-shadow)'; }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <Badge color={platformData?.color}>{platformData?.label || platform}</Badge>
        <Badge color={statusInfo.color} variant="outlined" size="sm">{statusInfo.label}</Badge>
      </div>
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--c-text)', margin: '8px 0 4px 0' }}>{title}</h3>
      <p style={{ fontSize: '13px', color: 'var(--c-text-secondary)', margin: 0, lineHeight: '1.4' }}>{description}</p>
      <div style={{ marginTop: '10px' }}>
        <Badge color="var(--c-text-secondary)" variant="outlined" size="sm">{contentType}</Badge>
      </div>
    </div>
  );
}
