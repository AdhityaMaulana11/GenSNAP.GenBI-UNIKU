import React from 'react';

interface DoodleProps {
  className?: string;
  size?: number;
  color?: string;
}

export function StarDoodle({ className = '', size = 32, color = '#fcd400' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M24 2L29.5 17.5L46 19L33 30.5L37 46L24 37.5L11 46L15 30.5L2 19L18.5 17.5L24 2Z"
        fill={color}
        stroke="#00327d"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarOutlineDoodle({ className = '', size = 32, color = '#fcd400' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M24 4L29 17L44 19L33 29L36 44L24 36L12 44L15 29L4 19L19 17L24 4Z"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BlueStarDoodle({ className = '', size = 32 }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M24 2L30.5 17L46 19L34 30.5L38 46L24 38L10 46L14 30.5L2 19L17.5 17L24 2Z"
        fill="#00327d"
      />
    </svg>
  );
}

export function SquiggleDoodle({ className = '', size = 64, color = '#fcd400' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size / 2}
      viewBox="0 0 100 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6 22C14 8 26 8 34 22C42 36 54 36 62 22C70 8 82 8 94 22"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 22C14 8 26 8 34 22C42 36 54 36 62 22C70 8 82 8 94 22"
        stroke="#00327d"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeartDoodle({ className = '', size = 32, color = '#ff8093' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M20 34C20 34 6 25 6 14C6 8.5 10.5 4 16 4C19 4 20 6 20 6C20 6 21 4 24 4C29.5 4 34 8.5 34 14C34 25 20 34 20 34Z"
        fill={color}
        stroke="#00327d"
        strokeWidth="2"
      />
    </svg>
  );
}

export function SparkleDoodle({ className = '', size = 28, color = '#00327d' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16 2V30M2 16H30M6 6L26 26M6 26L26 6"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ArrowDoodle({ className = '', size = 48, color = '#00327d' }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 60 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6 30C16 12 36 6 52 14M52 14L40 8M52 14L46 26"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CornerDoodle({ className = '', size = 36 }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4 28V6C4 4.89543 4.89543 4 6 4H28"
        stroke="#00327d"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
