'use client';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ width = '100%', height = '16px', borderRadius = '8px', style }: SkeletonProps) {
  return (
    <div style={{
      width, height, borderRadius,
      background: 'linear-gradient(90deg, var(--c-border) 25%, var(--c-surface-hover) 50%, var(--c-border) 75%)',
      backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', ...style,
    }} />
  );
}
