"use client";

/**
 * Tiny inline SVG country flags — emoji flags don't render on Windows,
 * so these keep the prefix selector consistent across platforms.
 */

interface FlagProps {
  className?: string;
}

export function SlovakFlag({ className }: FlagProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 21 15"
      width="21"
      height="15"
      role="presentation"
      aria-hidden="true"
    >
      <rect width="21" height="15" rx="2" fill="#FFFFFF" />
      <path d="M0 5h21v5H0z" fill="#0B4EA2" />
      <path d="M0 10h21v3a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z" fill="#EE1C25" />
      <path
        d="M5 3.5h4.5v4c0 2.4-1.7 3.6-2.25 4C6.7 11.1 5 9.9 5 7.5z"
        fill="#EE1C25"
        stroke="#FFFFFF"
        strokeWidth="0.5"
      />
      <path
        d="M6.9 5h.9v1h1.1v.9H7.8v.7h1.3v.9H7.8V10h-1V8.5H5.5v-.9h1.3v-.7H5.7V6h1.2z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function CzechFlag({ className }: FlagProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 21 15"
      width="21"
      height="15"
      role="presentation"
      aria-hidden="true"
    >
      <rect width="21" height="15" rx="2" fill="#FFFFFF" />
      <path d="M0 7.5h21V13a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z" fill="#D7141A" />
      <path d="M0 2a2 2 0 0 1 .8-1.6L10.5 7.5.8 14.6A2 2 0 0 1 0 13z" fill="#11457E" />
    </svg>
  );
}
