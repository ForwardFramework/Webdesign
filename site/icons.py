"""Inline SVG icons (Lucide-derived, MIT). Inlined rather than icon-fonted so
there is no extra request and no flash of unstyled icon. Decorative icons carry
aria-hidden; anything that conveys meaning gets a visible text label beside it."""

_P = {
 "phone": '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
 "mail": '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
 "pin": '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
 "clock": '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
 "star": '<path d="M11.5 2.9a.6.6 0 0 1 1 0l2.4 4.9 5.4.8a.6.6 0 0 1 .3 1l-3.9 3.8.9 5.4a.6.6 0 0 1-.9.6L12 16.9l-4.8 2.5a.6.6 0 0 1-.9-.6l.9-5.4L3.3 9.6a.6.6 0 0 1 .3-1l5.4-.8Z"/>',
 "check": '<path d="M20 6 9 17l-5-5"/>',
 "check-circle": '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
 "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
 "chevron-down": '<path d="m6 9 6 6 6-6"/>',
 "menu": '<line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/>',
 "x": '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
 "shield": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z"/>',
 "badge": '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>',
 "broom": '<path d="M13 11 3 21"/><path d="m19.5 3.5-6 6"/><path d="M9.5 14.5 21 10l-7-7-4.5 11.5Z"/>',
 "chat": '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/>',
 "tag": '<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.8 8.8a2 2 0 0 0 2.8 0l7.2-7.2a2 2 0 0 0 0-2.8Z"/><circle cx="7.5" cy="7.5" r="1.2"/>',
 "cage": '<rect x="3" y="6" width="18" height="14" rx="1"/><path d="M3 6 12 2l9 4"/><path d="M9 6v14M15 6v14M3 13h18"/>',
 "lanai": '<path d="M3 21V9l9-6 9 6v12"/><path d="M3 13h18M9 9v12M15 9v12"/>',
 "door": '<path d="M4 21V4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v17"/><path d="M2 21h20"/><circle cx="13.5" cy="12" r="1"/>',
 "window": '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M12 3v18M3 12h18"/>',
 "storm": '<path d="M17.5 17.5a5 5 0 1 0-3-9.2A6.5 6.5 0 0 0 4 12"/><path d="m13 14-3 5h4l-3 5"/>',
 "frame": '<rect x="3" y="3" width="18" height="18" rx="1"/><rect x="7" y="7" width="10" height="10" rx="1"/>',
 "camera": '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z"/><circle cx="12" cy="13" r="3.5"/>',
 "users": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/>',
 "quote": '<path d="M10 11H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4"/><path d="M20 11h-4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4"/>',
 "facebook": '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
 "instagram": '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/>',
 "google": '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
}

def icon(name, size=24, cls="ico", stroke=2):
    d = _P.get(name, _P["check"])
    return (f'<svg class="{cls}" width="{size}" height="{size}" viewBox="0 0 24 24" '
            f'fill="none" stroke="currentColor" stroke-width="{stroke}" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" '
            f'focusable="false">{d}</svg>')

def star_row(n=5, size=18, cls="stars"):
    s = "".join(
        f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="currentColor" '
        f'aria-hidden="true" focusable="false">{_P["star"]}</svg>' for _ in range(n))
    return f'<span class="{cls}" role="img" aria-label="{n} out of 5 stars">{s}</span>'
