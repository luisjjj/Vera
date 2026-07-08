'use client';

import { useTheme } from '@/store/themeStore';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '12px',
        border: '1px solid var(--c-border)',
        backgroundColor: 'var(--c-surface)',
        color: 'var(--c-text)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--c-surface-hover)';
        e.currentTarget.style.borderColor = 'var(--c-border-strong)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--c-surface)';
        e.currentTarget.style.borderColor = 'var(--c-border)';
      }}
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
