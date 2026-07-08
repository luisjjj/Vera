'use client';

import { ReactNode } from 'react';
import { BORDER_RADIUS } from '@/constants/theme';

interface CardProps {
  children: ReactNode;
  padding?: string;
  hover?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function Card({ children, padding = '16px', hover = false, onClick, style }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'var(--c-surface)',
        borderRadius: `${BORDER_RADIUS.lg}px`,
        padding,
        boxShadow: '0 1px 3px var(--c-shadow)',
        border: '1px solid var(--c-border)',
        transition: 'all 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = '0 4px 12px var(--c-shadow)';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.borderColor = 'var(--c-border-strong)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = '0 1px 3px var(--c-shadow)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = 'var(--c-border)';
        }
      }}
    >
      {children}
    </div>
  );
}
