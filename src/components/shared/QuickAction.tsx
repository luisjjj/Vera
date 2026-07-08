'use client';

import { ReactNode } from 'react';

interface QuickActionProps {
  icon: ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}

export function QuickAction({ icon, label, description, onClick }: QuickActionProps) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '12px', padding: '16px',
      backgroundColor: 'var(--c-surface)', borderRadius: '16px',
      border: '1px solid var(--c-border)', cursor: 'pointer', textAlign: 'left',
      width: '100%', transition: 'all 0.2s ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 12px var(--c-shadow)';
      e.currentTarget.style.transform = 'translateY(-1px)';
      e.currentTarget.style.borderColor = 'var(--c-border-strong)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = 'var(--c-border)';
    }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px',
        backgroundColor: 'var(--c-primary-subtle)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', color: 'var(--c-primary)', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--c-text)', margin: 0 }}>{label}</p>
        <p style={{ fontSize: '13px', color: 'var(--c-text-secondary)', margin: 0 }}>{description}</p>
      </div>
    </button>
  );
}
