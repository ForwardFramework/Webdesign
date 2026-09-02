/* Inline SVG icons — stroke icons inherit currentColor. */
const s = (p, extra) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra || ''}>${p}</svg>`;

const icons = {
  phone: s('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>'),
  mail: s('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/>'),
  pin: s('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'),
  clock: s('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  check: s('<circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/>'),
  checkPlain: s('<path d="M20 6 9 17l-5-5"/>'),
  arrow: s('<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>'),
  chev: s('<path d="m6 9 6 6 6-6"/>'),
  plus: s('<path d="M12 5v14"/><path d="M5 12h14"/>'),
  shield: s('<path d="M12 22s8-3.6 8-10V5.5L12 2 4 5.5V12c0 6.4 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>'),
  award: s('<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-2.5 5 2.5-1.5-7"/>'),
  camera: s('<path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3.5"/>'),
  broom: s('<path d="M14 3 9 8"/><path d="m10.5 6.5 7 7"/><path d="M8 10 4 20l10-4Z"/>'),
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3 6.6 7 .8-5.2 4.8 1.4 7L12 17.8 5.8 21.2l1.4-7L2 9.4l7-.8Z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>',
  quote: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" opacity=".25"><path d="M9.5 5C6.5 6.6 5 9.2 5 12.8V19h6.2v-6.2H8.4c0-2 .6-3.4 2.1-4.4Zm9.3 0c-3 1.6-4.5 4.2-4.5 7.8V19H20v-6.2h-2.8c0-2 .6-3.4 2.1-4.4Z"/></svg>',

  /* Service icons */
  shingle: s('<path d="M3 10.5 12 4l9 6.5"/><path d="M3 14.5 12 8l9 6.5"/><path d="M3 18.5 12 12l9 6.5"/>'),
  wrench: s('<path d="M14.7 6.3a4 4 0 0 0 5.1 5.1l-8 8a2.8 2.8 0 0 1-4-4Z"/><path d="m14.7 6.3 3-3a4 4 0 0 1 2.1 5.1"/>'),
  storm: s('<path d="M17 17.5A4.5 4.5 0 0 0 16.5 8a6 6 0 0 0-11.6 2A3.5 3.5 0 0 0 6 17"/><path d="m13 13-3 4.5h3L11 22"/>'),
  search: s('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  gutter: s('<path d="M3 8h18"/><path d="M3 8v3a2 2 0 0 0 2 2h11"/><path d="M18 13v7"/><path d="M15.5 20h5"/>'),
  siding: s('<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 9h18M3 14h18"/>'),
  building: s('<path d="M3 21h18"/><path d="M5 21V6l7-3 7 3v15"/><path d="M9.5 10h1M13.5 10h1M9.5 14h1M13.5 14h1"/>'),
  hammer: s('<path d="m14 6 4-4 4 4-4 4Z"/><path d="m16 8-9 9"/><path d="M8 16 4 20l2 2 4-4Z"/>'),
  ruler: s('<path d="M3 15 15 3l6 6L9 21Z"/><path d="m7 11 2 2M10 8l2 2M13 5l2 2"/>'),
  file: s('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>'),
  users: s('<circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16.5 5.5a3.2 3.2 0 0 1 0 6"/><path d="M18 14.5a6 6 0 0 1 3 5.5"/>'),
  bolt: s('<path d="M13 2 4 14h7l-1 8 9-12h-7Z"/>'),
  leaf: s('<path d="M4 20s0-9 8-13c4-2 8-2 8-2s0 4-2 8c-4 8-13 8-13 8Z"/><path d="M4 20 14 10"/>')
};

module.exports = icons;
