'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { BORDER_RADIUS } from '@/constants/theme';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, style, ...props }, ref) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {label && (
          <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--c-text-on-surface)' }}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          style={{
            padding: '12px 16px',
            borderRadius: `${BORDER_RADIUS.md}px`,
            border: `1.5px solid ${error ? 'var(--c-error)' : 'var(--c-border-strong)'}`,
            backgroundColor: '#FFFFFF',
            color: 'var(--c-text-on-surface)',
            fontSize: '16px',
            outline: 'none',
            transition: 'border-color 0.2s ease',
            width: '100%',
            boxSizing: 'border-box',
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--c-primary)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? 'var(--c-error)' : 'var(--c-border-strong)';
          }}
          {...props}
        />
        {error && (
          <span style={{ fontSize: '12px', color: 'var(--c-error)' }}>{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
