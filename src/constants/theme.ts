export const COLORS = {
  primary: '#F4845F',
  primaryHover: '#E8734A',
  background: '#FAFAF9',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  border: '#E8E5E0',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const SHADOWS = {
  sm: '0 1px 3px rgba(0,0,0,0.06)',
  md: '0 4px 12px rgba(0,0,0,0.08)',
  lg: '0 8px 24px rgba(0,0,0,0.12)',
} as const;

export const PLATFORMS = [
  { id: 'youtube' as const, label: 'YouTube', color: '#FF0000', icon: 'Youtube' },
  { id: 'tiktok' as const, label: 'TikTok', color: '#000000', icon: 'Music' },
  { id: 'instagram' as const, label: 'Instagram', color: '#E4405F', icon: 'Instagram' },
  { id: 'twitter' as const, label: 'Twitter/X', color: '#1DA1F2', icon: 'Twitter' },
  { id: 'linkedin' as const, label: 'LinkedIn', color: '#0A66C2', icon: 'Linkedin' },
  { id: 'blog' as const, label: 'Blog', color: '#F4845F', icon: 'FileText' },
] as const;

export const CONTENT_TYPES = [
  { id: 'reel' as const, label: 'Reel', platforms: ['instagram', 'tiktok', 'youtube'] },
  { id: 'story' as const, label: 'Story', platforms: ['instagram', 'facebook'] },
  { id: 'post' as const, label: 'Post', platforms: ['instagram', 'linkedin', 'twitter'] },
  { id: 'video' as const, label: 'Video', platforms: ['youtube', 'tiktok'] },
  { id: 'carousel' as const, label: 'Carousel', platforms: ['instagram', 'linkedin'] },
  { id: 'thread' as const, label: 'Thread', platforms: ['twitter'] },
  { id: 'article' as const, label: 'Article', platforms: ['blog', 'linkedin'] },
] as const;

export const DAYS: { id: string; label: string; short: string }[] = [
  { id: 'monday', label: 'Monday', short: 'Mon' },
  { id: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { id: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { id: 'thursday', label: 'Thursday', short: 'Thu' },
  { id: 'friday', label: 'Friday', short: 'Fri' },
  { id: 'saturday', label: 'Saturday', short: 'Sat' },
  { id: 'sunday', label: 'Sunday', short: 'Sun' },
];
