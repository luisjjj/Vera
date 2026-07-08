'use client';

import { useMemo } from 'react';
import { Camera, FileText, Calendar, PenTool, Image, Video, Mic, BookOpen, Lightbulb, Star, Heart, Bookmark, Clapperboard, Headphones, Palette } from 'lucide-react';

const ICONS = [Camera, FileText, Calendar, PenTool, Image, Video, Mic, BookOpen, Lightbulb, Star, Heart, Bookmark, Clapperboard, Headphones, Palette];

interface FloatingIcon {
  id: number;
  Icon: typeof ICONS[number];
  x: number;
  y: number;
  size: number;
  rotation: number;
  duration: number;
  delay: number;
  opacity: number;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function FloatingBackground() {
  const icons = useMemo<FloatingIcon[]>(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      Icon: ICONS[i % ICONS.length],
      x: seededRandom(i * 7 + 1) * 100,
      y: seededRandom(i * 13 + 3) * 100,
      size: 20 + seededRandom(i * 17 + 5) * 16,
      rotation: seededRandom(i * 23 + 7) * 360,
      duration: 14 + seededRandom(i * 29 + 11) * 18,
      delay: seededRandom(i * 31 + 13) * -20,
      opacity: 0.06 + seededRandom(i * 37 + 17) * 0.08,
    }));
  }, []);

  return (
    <div className="floating-bg" aria-hidden="true">
      {icons.map(({ id, Icon, x, y, size, rotation, duration, delay, opacity }) => (
        <div
          key={id}
          className="floating-icon"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            opacity,
          }}
        >
          <Icon
            size={size}
            style={{
              transform: `rotate(${rotation}deg)`,
              color: 'var(--c-text)',
            }}
            strokeWidth={1.5}
          />
        </div>
      ))}
    </div>
  );
}
