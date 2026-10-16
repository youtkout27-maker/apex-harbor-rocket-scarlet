export function Mark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path
        d="M6 50 L22 16 L32 36 L42 12 L58 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="22" cy="16" r="2.4" fill="currentColor" />
      <circle cx="32" cy="36" r="2.2" fill="currentColor" />
      <circle cx="42" cy="12" r="2.6" fill="currentColor" />
    </svg>
  );
}
