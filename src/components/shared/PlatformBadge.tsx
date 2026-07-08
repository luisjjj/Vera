'use client';

import { PLATFORMS } from '@/constants/theme';
import { Platform } from '@/types/models';

interface PlatformBadgeProps {
  platform: Platform;
  size?: 'sm' | 'md';
}

export function PlatformBadge({ platform, size = 'sm' }: PlatformBadgeProps) {
  const data = PLATFORMS.find((p) => p.id === platform);
  if (!data) return null;

  const sizeStyles = {
    sm: { padding: '4px 10px', fontSize: '12px' },
    md: { padding: '6px 14px', fontSize: '14px' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        ...sizeStyles[size],
        borderRadius: '9999px',
        fontWeight: 500,
        backgroundColor: `${data.color}15`,
        color: data.color,
      }}
    >
      {data.label}
    </span>
  );
}
