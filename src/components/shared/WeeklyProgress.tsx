'use client';

interface WeeklyProgressProps {
  completed: number;
  total: number;
}

export function WeeklyProgress({ completed, total }: WeeklyProgressProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--c-text-on-surface)' }}>Weekly Progress</span>
        <span style={{ fontSize: '14px', color: 'var(--c-text-secondary)' }}>{completed}/{total}</span>
      </div>
      <div style={{
        height: '8px', backgroundColor: 'var(--c-border)',
        borderRadius: '9999px', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${percentage}%`,
          backgroundColor: 'var(--c-primary)', borderRadius: '9999px',
          transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  );
}
