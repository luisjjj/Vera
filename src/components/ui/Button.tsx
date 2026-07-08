'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: '8px 16px', fontSize: '14px', borderRadius: '12px' },
  md: { padding: '12px 24px', fontSize: '16px', borderRadius: '12px' },
  lg: { padding: '16px 32px', fontSize: '16px', borderRadius: '16px' },
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  loading = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const base: React.CSSProperties = {
    ...sizeStyles[size],
    width: fullWidth ? '100%' : undefined,
    fontWeight: 600,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    ...style,
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--c-primary)',
      color: '#FFFFFF',
      border: 'none',
    },
    secondary: {
      backgroundColor: 'var(--c-surface)',
      color: 'var(--c-text-on-surface)',
      border: '1.5px solid var(--c-border-strong)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--c-text-on-surface)',
      border: 'none',
    },
    danger: {
      backgroundColor: 'var(--c-error)',
      color: '#FFFFFF',
      border: 'none',
    },
  };

  const hoverBg: Record<string, string> = {
    primary: 'var(--c-primary-hover)',
    secondary: 'var(--c-surface-hover)',
    ghost: 'var(--c-surface-hover)',
    danger: '#DC2626',
  };

  return (
    <button
      disabled={disabled || loading}
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.backgroundColor = hoverBg[variant];
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.backgroundColor = variants[variant].backgroundColor as string;
        }
      }}
      {...props}
    >
      {loading ? (
        <span style={{ width: '16px', height: '16px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
      ) : null}
      {children}
    </button>
  );
}
