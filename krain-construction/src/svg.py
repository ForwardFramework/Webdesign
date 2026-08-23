# -*- coding: utf-8 -*-
"""Inline SVG: logo lockups (redrawn from the client's logo) and the icon set."""

# ------------------------------------------------------------------- LOGO MARKS
def logo_header(title="Krain Construction LLC"):
    """Compact two-tier lockup for the sticky header (inherits page webfonts).

    textLength locks both tiers to the same measure, so the lockup holds its
    proportions whether Playfair Display has loaded yet or not.
    """
    return f'''<svg class="logo" viewBox="0 0 208 71" role="img" aria-label="{title}" width="208" height="71">
<title>{title}</title>
<g font-family="Playfair Display, Georgia, serif" font-weight="800" font-size="46"
   textLength="176" lengthAdjust="spacing">
  <text x="14" y="42" fill="#0d0f12">KRAIN</text>
  <text x="17" y="39" fill="#ce1b24">KRAIN</text>
</g>
<text x="8" y="60" font-family="Inter, Helvetica, Arial, sans-serif" font-weight="600"
      font-size="22" textLength="176" lengthAdjust="spacing" fill="#0d0f12">Construction</text>
<text x="188" y="61" font-family="Inter, Helvetica, Arial, sans-serif" font-weight="700"
      font-size="9.5" fill="#0d0f12">LLC</text>
<rect x="8" y="66" width="176" height="2.4" fill="#0d0f12"/>
</svg>'''


def logo_stacked(mono=False, title="Krain Construction LLC — Since 1988"):
    """Full stacked lockup for the footer and share cards."""
    red = "#ffffff" if mono else "#ce1b24"
    black = "#ffffff" if mono else "#0d0f12"
    shadow = "rgba(255,255,255,.35)" if mono else "#0d0f12"
    sub = "#c9cfd7" if mono else "#535c68"
    return f'''<svg class="logo-stacked" viewBox="0 0 300 132" role="img" aria-label="{title}" width="300" height="132">
<title>{title}</title>
<g font-family="Playfair Display, Georgia, serif" font-weight="800" font-size="56"
   textLength="212" lengthAdjust="spacing">
  <text x="26" y="52" fill="{shadow}">KRAIN</text>
  <text x="31" y="48" fill="{red}">KRAIN</text>
</g>
<text x="16" y="82" font-family="Inter, Helvetica, Arial, sans-serif" font-weight="600"
      font-size="27" textLength="226" lengthAdjust="spacing" fill="{black}">Construction</text>
<text x="250" y="82" font-family="Inter, Helvetica, Arial, sans-serif" font-weight="700"
      font-size="11" fill="{black}">LLC</text>
<rect x="16" y="90" width="234" height="2.6" fill="{black}"/>
<text x="16" y="114" font-family="Inter, Helvetica, Arial, sans-serif" font-weight="700"
      font-style="italic" font-size="15" letter-spacing=".6" fill="{sub}">Since 1988</text>
<rect x="116" y="105" width="134" height="1.4" fill="{red}" opacity=".55"/>
<text x="16" y="128" font-family="Inter, Helvetica, Arial, sans-serif" font-weight="600"
      font-size="10.5" letter-spacing="2.4" fill="{sub}">MURRYSVILLE, PENNSYLVANIA</text>
</svg>'''


# ------------------------------------------------------------------- ICON SET
_I = {
"phone":'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2z"/>',
"mail":'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
"pin":'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
"clock":'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
"check":'<path d="M20 6 9 17l-5-5"/>',
"check-circle":'<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>',
"star":'<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3L7 14.2l-5-4.9 6.9-1z" fill="currentColor" stroke="none"/>',
"shield":'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
"home":'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/>',
"logs":'<rect x="2" y="5" width="20" height="4.5" rx="2.25"/><rect x="2" y="9.8" width="20" height="4.5" rx="2.25"/><rect x="2" y="14.6" width="20" height="4.5" rx="2.25"/><circle cx="6" cy="7.25" r="1"/><circle cx="6" cy="12.05" r="1"/><circle cx="6" cy="16.85" r="1"/>',
"addition":'<path d="M2 20V10l6-4.5V20"/><path d="M8 20V8l8 6v6"/><path d="M16 20v-4h6v4"/><path d="M19 6v6M16 9h6"/>',
"garage":'<path d="M2 21V9.5L12 4l10 5.5V21"/><path d="M6.5 21v-8h11v8"/><path d="M6.5 16.5h11M6.5 13h11"/>',
"deck":'<path d="M2 9h20M2 13h20M2 17h20"/><path d="M5 9v12M19 9v12"/><path d="m2 9 10-6 10 6"/>',
"roof":'<path d="m2 12 10-8 10 8"/><path d="M5 10.5V20h14v-9.5"/><path d="M9 20v-5h6v5"/><path d="M2 12h20"/>',
"est":'<circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3.5 2"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2"/>',
"award":'<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8"/>',
"hammer":'<path d="m15 12-8.5 8.5a2.1 2.1 0 0 1-3-3L12 9"/><path d="m11.5 6.5 6 6 4-4-6-6z"/><path d="m9.5 8.5 6 6"/>',
"users":'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
"ruler":'<path d="M16.5 2.5 21.5 7.5 7.5 21.5 2.5 16.5z"/><path d="m8 9 2 2M11 6l2 2M14 3l2 2M5 12l2 2"/>',
"calendar":'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
"arrow-right":'<path d="M5 12h14M13 6l6 6-6 6"/>',
"chevron-down":'<path d="m3 5 5 5 5-5"/>',
"quote":'<path d="M9 7H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2a2 2 0 0 1-2 2"/><path d="M19 7h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2a2 2 0 0 1-2 2"/>',
"lock":'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
"facebook":'<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="currentColor" stroke="none"/>',
"houzz":'<path d="M4 2h4v6.5L20 12v10h-7v-5.5h-2V22H4z" fill="currentColor" stroke="none"/>',
"bbb":'<path d="M12 2 3 6v6c0 5 3.8 9.2 9 10 5.2-.8 9-5 9-10V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
"file":'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6"/>',
"target":'<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>',
"wrench":'<path d="M14.7 6.3a4.5 4.5 0 0 0 5.9 5.9l-8.4 8.4a2.8 2.8 0 0 1-4-4z"/><path d="M14.7 6.3 18.5 2.5"/>',
}

_CHEVRON_BOX = {"chevron-down": "0 0 16 16"}

def icon(name, cls="", extra=""):
    body = _I.get(name)
    if body is None:
        raise KeyError("unknown icon: " + name)
    vb = _CHEVRON_BOX.get(name, "0 0 24 24")
    c = f' class="{cls}"' if cls else ""
    return (f'<svg{c} viewBox="{vb}" fill="none" stroke="currentColor" stroke-width="1.8" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" {extra}>'
            f'{body}</svg>')

def stars(n=5, cls="stars"):
    return f'<span class="{cls}" aria-hidden="true">' + icon("star") * n + "</span>"
