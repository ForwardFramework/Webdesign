/* Inline SVG icon set — Lucide-style, 24×24, stroke-based.
   No icon fonts, no emoji: both hurt accessibility and render inconsistently. */
const s = (p, extra = '') =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"${extra}>${p}</svg>`;

const icons = {
  phone: s('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>'),
  mail: s('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>'),
  pin: s('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>'),
  clock: s('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
  check: s('<path d="M20 6 9 17l-5-5"/>'),
  checkCircle: s('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>'),
  shield: s('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'),
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96L12 2.5z"/></svg>',
  home: s('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/>'),
  wrench: s('<path d="M14.7 6.3a4 4 0 0 0 5 5l-9.4 9.4a2.1 2.1 0 0 1-3-3z"/><path d="M14.7 6.3 18 3l3 3-3.3 3.3"/>'),
  droplet: s('<path d="M12 2.7 6.7 8a7.5 7.5 0 1 0 10.6 0z"/>'),
  layers: s('<path d="m12 2 9 5-9 5-9-5 9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>'),
  search: s('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  grid: s('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'),
  arrowRight: s('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'),
  chevronDown: s('<path d="m6 9 6 6 6-6"/>'),
  menu: s('<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>', ' class="icon-open"'),
  close: s('<path d="M6 6 18 18"/><path d="M18 6 6 18"/>', ' class="icon-close"'),
  medal: s('<circle cx="12" cy="15" r="6"/><path d="M8.2 10 6 2h12l-2.2 8"/><path d="m12 13 1 2h2l-1.5 1.5.5 2-2-1-2 1 .5-2L9 15h2z"/>'),
  clipboard: s('<rect x="7" y="4" width="10" height="4" rx="1"/><path d="M9 4H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3"/><path d="m9 14 2 2 4-4"/>'),
  broom: s('<path d="m13 3 8 8"/><path d="M11 5 5 11l3 3-3 6 6-3 3 3 6-6z"/>'),
  camera: s('<path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>'),
  wallet: s('<path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2"/><path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2H5a2 2 0 0 1-2-2z"/><circle cx="17" cy="14" r="1.2" fill="currentColor" stroke="none"/>'),
  handshake: s('<path d="m11 17 2 2a1.4 1.4 0 0 0 2-2"/><path d="m13 15 2.5 2.5a1.4 1.4 0 0 0 2-2L15 13"/><path d="M3 11 7 7h4l3 3"/><path d="M21 11 17 7h-3"/><path d="M3 11v4l4 4 2-2"/>'),
  snow: s('<path d="M12 2v20"/><path d="m4.5 7 15 10"/><path d="m19.5 7-15 10"/><path d="m9 4 3 2 3-2"/><path d="m9 20 3-2 3 2"/>'),
};

module.exports = { icons };
