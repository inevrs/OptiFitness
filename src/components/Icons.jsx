import React from 'react';

const defaultProps = {
  size: 22,
  strokeWidth: 1.8,
  color: 'currentColor',
};

// ── Navigation Icons ──────────────────────────────────────────

export const HomeIcon = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 22V12h6v10" />
  </svg>
);

export const SquadsIcon = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="3" />
    <circle cx="17" cy="7" r="3" />
    <path d="M2 21c0-4 3.1-7 7-7" />
    <path d="M15 14c4 0 7 3 7 7" />
    <path d="M9 14c2 0 3.5.6 4.8 1.5" />
  </svg>
);

export const WaterIcon = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C12 2 5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13z" />
    <path d="M9 17.5c.5 1.5 2 2.5 3 2.5" />
  </svg>
);

export const BadgeIcon = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="9" r="6" />
    <path d="M8.5 14.5L7 21l5-2 5 2-1.5-6.5" />
    <path d="M9.5 9l1.5 1.5L13.5 8" />
  </svg>
);

export const ProfileIcon = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

export const StepsIcon = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 16v-2.38C4 11.5 5.88 9.85 6 7.07c.06-1.55-1-2.9-1-2.9" />
    <path d="M20 20v-2.38c0-2.12-1.88-3.77-2-6.55-.06-1.55 1-2.9 1-2.9" />
    <path d="M7 17v.01" />
    <path d="M17 21v.01" />
    <path d="M8 13v.01" />
    <path d="M18 17v.01" />
    <path d="M12 10v.01" />
    <path d="M14 14v.01" />
  </svg>
);

// ── Action Icons ──────────────────────────────────────────────

export const DumbbellIcon = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="10" width="4" height="4" rx="1" />
    <rect x="18" y="10" width="4" height="4" rx="1" />
    <rect x="5" y="8" width="3" height="8" rx="1" />
    <rect x="16" y="8" width="3" height="8" rx="1" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export const MealIcon = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11h18" />
    <path d="M5 11V6a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v5" />
    <path d="M12 4v7" />
    <path d="M15 6c0-1.1.9-2 2-2s2 .9 2 2v5" />
    <path d="M3 11c0 4 2.5 7 9 8 6.5-1 9-4 9-8" />
  </svg>
);

export const ScaleIcon = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="14" width="20" height="7" rx="2" />
    <path d="M12 14V7" />
    <path d="M6 7l6-4 6 4" />
    <path d="M4 17h2m12 0h2" />
  </svg>
);

export const FlameIcon = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2c0 0-5 5-5 11a7 7 0 0 0 14 0c0-2-.8-4-2-5.5 0 0 0 3-2 4 0-3-2-6-5-9.5z" />
    <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
  </svg>
);

export const StarIcon = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12,2 15.1,8.3 22,9.3 17,14.1 18.2,21 12,17.8 5.8,21 7,14.1 2,9.3 8.9,8.3" />
  </svg>
);

export const FeedIcon = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M8 10h8M8 14h5" />
  </svg>
);

export const ChevronRight = ({ size = 18, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export const LightningIcon = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
  </svg>
);

export const CheckCircleIcon = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
