'use client';

import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: string;
  variant?: 'filled' | 'outlined';
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

export function Badge({ children, color = 'var(--c-primary)', variant = 'filled', size = 'sm', style }: BadgeProps) {
  const isFilled = variant === 'filled';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: size === 'sm' ? '4px 10px' : '6px 14px',
      borderRadius: '9999px', fontSize: size === 'sm' ? '12px' : '14px', fontWeight: 500,
      backgroundColor: isFilled ? `color-mix(in srgb, ${color} 15%, transparent)` : 'transparent',
      color, border: isFilled ? 'none' : `1.5px solid ${color}`,
      whiteSpace: 'nowrap', ...style,
    }}>
      {children}
    </span>
  );
}
