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
  driftX: number;
  driftY: number;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function FloatingBackground() {
  const icons = useMemo<FloatingIcon[]>(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      Icon: ICONS[i % ICONS.length],
      x: seededRandom(i * 7 + 1) * 100,
      y: seededRandom(i * 13 + 3) * 100,
      size: 24 + seededRandom(i * 17 + 5) * 20,
      rotation: seededRandom(i * 23 + 7) * 360,
      duration: 18 + seededRandom(i * 29 + 11) * 22,
      delay: seededRandom(i * 31 + 13) * -25,
      opacity: 0.08 + seededRandom(i * 37 + 17) * 0.1,
      driftX: 20 + seededRandom(i * 41 + 19) * 40,
      driftY: 20 + seededRandom(i * 43 + 21) * 40,
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {icons.map(({ id, Icon, x, y, size, rotation, duration, delay, opacity, driftX, driftY }) => (
        <div
          key={id}
          style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            opacity,
            animation: `float-${id % 4} ${duration}s ease-in-out ${delay}s infinite`,
          }}
        >
          <Icon
            size={size}
            color="var(--c-text)"
            strokeWidth={1.5}
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        </div>
      ))}
    </div>
  );
}
