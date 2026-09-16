/** Inline SVG icons — stroke-based, 24x24, inherit currentColor. */

const wrap = (body, size = 24, stroke = 1.8) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

export const icons = {
  driveway: (s) => wrap('<path d="M8 21 10.5 3h3L16 21"/><path d="M11 7h2M10.6 11h2.8M10.2 15h3.6"/><path d="M3 21h18"/>', s),
  patio: (s) => wrap('<rect x="3" y="11" width="18" height="10" rx="1.5"/><path d="M3 16h18M9 11v10M15 11v10"/><path d="M5 11V8a7 7 0 0 1 14 0v3"/>', s),
  sidewalk: (s) => wrap('<path d="M6 21V3M18 21V3"/><path d="M6 9h12M6 15h12"/><path d="M12 5.5v1M12 11.5v1M12 17.5v1"/>', s),
  steps: (s) => wrap('<path d="M3 21h4v-5h5v-5h5V6h4"/><path d="M3 21V16h4"/><path d="M21 21H3"/>', s),
  pad: (s) => wrap('<path d="m3 9 9-5 9 5"/><path d="M5 10v9h14v-9"/><path d="M3 19h18"/><path d="M9 19v-5h6v5"/>', s),
  excavation: (s) => wrap('<path d="M3 19h18"/><rect x="3" y="13" width="8" height="6" rx="1"/><path d="m11 14 4-6 4 2-2 6"/><path d="M15 8 13 4"/>', s),
  landscape: (s) => wrap('<path d="M12 21v-7"/><path d="M12 14c0-3 2-5 5-5 0 3-2 5-5 5Z"/><path d="M12 16c0-3-2-5-5-5 0 3 2 5 5 5Z"/><path d="M4 21h16"/><path d="M12 9V4"/>', s),
  phone: (s) => wrap('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>', s),
  message: (s) => wrap('<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-4-.9L3 21l2-4.4A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z"/>', s),
  mail: (s) => wrap('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/>', s),
  pin: (s) => wrap('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>', s),
  clock: (s) => wrap('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', s),
  check: (s) => wrap('<polyline points="20 6 9 17 4 12"/>', s, 2.6),
  checkCircle: (s) => wrap('<circle cx="12" cy="12" r="9"/><polyline points="16 9.5 10.8 15 8 12.4"/>', s),
  shield: (s) => wrap('<path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z"/><polyline points="9 12 11.2 14.2 15.2 10"/>', s),
  badge: (s) => wrap('<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-2.5 5 2.5-1.5-7"/>', s),
  truck: (s) => wrap('<path d="M2 17V7a1 1 0 0 1 1-1h10v11"/><path d="M13 9h4l4 4v4h-3"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M9 18h6"/>', s),
  ruler: (s) => wrap('<path d="M3 15 15 3l6 6L9 21Z"/><path d="m7 11 2 2M10 8l2 2M13 5l2 2"/>', s),
  calendar: (s) => wrap('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>', s),
  star: (s) => wrap('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z"/>', s),
  camera: (s) => wrap('<path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3.5"/>', s),
  lock: (s) => wrap('<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>', s),
  arrow: (s) => wrap('<path d="M5 12h13"/><path d="m12 5 7 7-7 7"/>', s, 2.2),
  facebook: (s) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${s || 20}" height="${s || 20}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>`,
  instagram: (s) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${s || 20}" height="${s || 20}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 3.1A6.7 6.7 0 1 0 18.7 12 6.7 6.7 0 0 0 12 5.3Zm0 11A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3Zm6.9-11.2a1.6 1.6 0 1 1-1.6-1.6 1.6 1.6 0 0 1 1.6 1.6Z"/></svg>`,
};

export const icon = (name, size) => (icons[name] ? icons[name](size) : '');
export default icon;
