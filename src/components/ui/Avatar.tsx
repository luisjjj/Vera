'use client';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

const sizeMap = {
  sm: { width: 32, height: 32, fontSize: '12px' },
  md: { width: 40, height: 40, fontSize: '14px' },
  lg: { width: 56, height: 56, fontSize: '18px' },
};

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function getColor(name: string): string {
  const colors = ['#F4845F', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({ name, size = 'md', style }: AvatarProps) {
  const s = sizeMap[size];
  return (
    <div style={{
      width: s.width, height: s.height, borderRadius: '50%',
      backgroundColor: getColor(name), color: '#FFFFFF',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 600, fontSize: s.fontSize, flexShrink: 0, ...style,
    }}>
      {getInitials(name)}
    </div>
  );
}
