import Link from 'next/link';

/** Wordmark. Inline SVG so it needs no asset fetch and stays crisp everywhere. */
export function Logo({ className = '', inverted = false }: { className?: string; inverted?: boolean }) {
  const ink = inverted ? '#FBF8F3' : '#0A2F2F';
  const accent = inverted ? '#6FBDB9' : '#22827F';
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="Caitlin Hoffman — Lakewood Ranch Real Estate, home">
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true" className="shrink-0">
        <circle cx="17" cy="17" r="16" stroke={accent} strokeWidth="1.5" />
        <path d="M5 21.5c2.4-2.2 4.2-2.2 6.6 0s4.2 2.2 6.6 0 4.2-2.2 6.6 0 2.7 1.9 4.2.6" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M5 25.6c2.4-2.2 4.2-2.2 6.6 0s4.2 2.2 6.6 0 4.2-2.2 6.6 0" stroke={accent} strokeWidth="1.2" strokeLinecap="round" opacity=".55" />
        <path d="M17 7.5l2.6 5.3 5.9.85-4.25 4.15 1 5.87L17 20.9l-5.25 2.77 1-5.87L8.5 13.65l5.9-.85L17 7.5z" fill={accent} opacity=".9" />
      </svg>
      <span className="leading-none">
        <span className="block font-display text-[1.0625rem] font-semibold tracking-tight" style={{ color: ink }}>
          Caitlin Hoffman
        </span>
        <span className="mt-0.5 block text-[0.6rem] font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>
          Lakewood Ranch Real Estate
        </span>
      </span>
    </Link>
  );
}

/**
 * HUD Equal Housing Opportunity mark, drawn inline.
 * HUD advertising guidance asks that residential real estate advertising carry
 * the equal housing opportunity logotype, statement or slogan.
 */
export function EqualHousingLogo({ className = '', size = 34 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="Equal Housing Opportunity"
    >
      <title>Equal Housing Opportunity</title>
      <path
        d="M24 8 6 21h4v17h11V29h6v9h11V21h4L24 8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M17 24h14M17 27.5h14" stroke="currentColor" strokeWidth="1.5" opacity=".65" />
    </svg>
  );
}

/** REALTOR® mark placeholder drawn inline (the official artwork is licensed to NAR members). */
export function RealtorMark({ className = '', size = 30 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} role="img" aria-label="REALTOR®">
      <title>REALTOR®</title>
      <rect x="4" y="4" width="40" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <path d="M14 34V15h8.5a5.25 5.25 0 0 1 0 10.5H14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 25.5 28.5 34" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/** Decorative top-edge wave used between sections. */
export function WaveEdge({ className = '', flip = false, fill = 'currentColor' }: { className?: string; flip?: boolean; fill?: string }) {
  return (
    <svg
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block h-10 w-full ${flip ? 'rotate-180' : ''} ${className}`}
    >
      <path d="M0 30c120-22 240-22 360 0s240 22 360 0 240-22 360 0 240 22 360 0v30H0V30Z" fill={fill} />
    </svg>
  );
}
