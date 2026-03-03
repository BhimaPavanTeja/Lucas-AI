"use client";

import React from 'react';

type Props = {
  speaking?: boolean;
  emotion?: string | null;
  size?: number;
  className?: string;
};

export default function AIAvatar({ speaking = false, emotion = 'neutral', size = 160, className = '' }: Props) {
  const eye = (cx: number) => (
    <circle cx={cx} cy={50} r={6} fill={emotion === 'surprised' ? '#222' : '#111'} />
  );

  const mouthHeight = speaking ? 18 : emotion === 'happy' ? 8 : emotion === 'sad' ? 4 : 6;
  const mouthY = 90 - mouthHeight / 2;

  const eyebrowY = emotion === 'surprised' ? 30 : 38;

  return (
    <div style={{ width: size }} className={className}>
      <svg viewBox="0 0 160 160" width={size} height={size}>
        <defs>
          <linearGradient id="skin" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffd" />
            <stop offset="100%" stopColor="#fec" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="160" height="160" rx="20" fill="url(#skin)" />
        {eye(50)}
        {eye(110)}
        {/* eyebrows */}
        <rect x="38" y={eyebrowY} width="24" height="4" rx="2" fill="#333" opacity={emotion === 'sad' ? 0.6 : 1} />
        <rect x="98" y={eyebrowY} width="24" height="4" rx="2" fill="#333" opacity={emotion === 'sad' ? 0.6 : 1} />
        {/* mouth as rounded rect to simplify lip movement */}
        <rect x="50" y={mouthY} width="60" height={mouthHeight} rx="10" fill={emotion === 'happy' ? '#b33' : '#922'} />
        {/* simple blush when happy */}
        {emotion === 'happy' && <circle cx="30" cy="90" r="6" fill="#f7a" opacity={0.6} />}
      </svg>
    </div>
  );
}
