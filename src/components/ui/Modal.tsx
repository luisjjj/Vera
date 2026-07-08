'use client';

import { ReactNode, useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
      backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        backgroundColor: 'var(--c-surface)', borderRadius: '20px', padding: '24px',
        maxWidth: '440px', width: '100%', boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
        border: '1px solid var(--c-border)', animation: 'fadeIn 0.2s ease',
        color: 'var(--c-text-on-surface)',
      }}>
        {title && (
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--c-text-on-surface)', margin: '0 0 16px 0' }}>{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
