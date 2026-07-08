'use client';

import { Avatar } from '@/components/ui/Avatar';

interface GreetingProps {
  name: string;
}

export function Greeting({ name }: GreetingProps) {
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17) greeting = 'Good evening';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <Avatar name={name} size="lg" />
      <div>
        <p style={{ fontSize: '14px', color: 'var(--c-text-secondary)', margin: 0 }}>{greeting}</p>
        <h1 className="heading-lg" style={{ fontWeight: 700, color: 'var(--c-text-on-surface)', margin: 0 }}>{name}</h1>
      </div>
    </div>
  );
}
