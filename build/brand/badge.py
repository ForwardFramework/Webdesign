#!/usr/bin/env python3
"""
Top Gun Roofing badge mark, rendered with real Anton type.

This is a typographic interpretation of the company badge, NOT a reproduction
of the illustrated eagle logo. It exists so the site ships with an on-brand
mark; drop the real artwork in over these files when it is available.
"""
CREAM   = "#EFE3C4"
GOLD    = "#F0B323"
GOLD_BR = "#FFD466"
GOLD_DK = "#C6871A"
GOLD_DP = "#8A5A0B"
BLACK   = "#0E0E10"
FIELD   = "#141417"
FIELD_2 = "#1B1B20"

SHIELD = ("M88,44 L552,44 L592,84 L592,318 "
          "L320,518 L48,318 L48,84 Z")
CX, CY = 320, 250


def tx(s):
    return f'transform="translate({CX},{CY}) scale({s}) translate({-CX},{-CY})"'


def badge(bg=None, mark=False):
    p = []
    a = p.append
    a('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 560" '
      'role="img" aria-label="Top Gun Roofing LLC">')
    a('<title>Top Gun Roofing LLC</title>')
    a('<defs>'
      '<linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">'
      f'<stop offset="0%" stop-color="#FFFFFF"/>'
      f'<stop offset="46%" stop-color="{CREAM}"/>'
      f'<stop offset="47%" stop-color="{GOLD_BR}"/>'
      f'<stop offset="100%" stop-color="{GOLD}"/>'
      '</linearGradient>'
      '</defs>')
    if bg:
        a(f'<rect width="640" height="560" fill="{bg}"/>')

    # concentric badge frame
    a(f'<path d="{SHIELD}" fill="{CREAM}"/>')
    a(f'<path d="{SHIELD}" fill="{BLACK}" {tx(0.975)}/>')
    a(f'<path d="{SHIELD}" fill="{GOLD}" {tx(0.952)}/>')
    a(f'<path d="{SHIELD}" fill="{GOLD_DP}" {tx(0.905)}/>')
    a(f'<path d="{SHIELD}" fill="{FIELD}" {tx(0.897)}/>')
    a(f'<path d="{SHIELD}" fill="none" stroke="{GOLD_DK}" stroke-width="4" {tx(0.845)}/>')
    a(f'<path d="{SHIELD}" fill="{FIELD_2}" {tx(0.837)}/>')

    if mark:
        # Monogram variant. The full wordmark is unreadable below about 120px,
        # so small placements (header, footer, favicon, app icons) get this.
        a('<text x="320" y="300" text-anchor="middle" font-family="Anton" '
          f'font-size="220" letter-spacing="-4" fill="{BLACK}" stroke="{BLACK}" '
          'stroke-width="20" stroke-linejoin="round">TG</text>')
        a('<text x="320" y="300" text-anchor="middle" font-family="Anton" '
          'font-size="220" letter-spacing="-4" fill="url(#tg)">TG</text>')
        a(f'<path d="M232,352 L320,372 L408,352" fill="none" stroke="{GOLD_DK}" '
          'stroke-width="9" stroke-linejoin="round"/>')
        a('</svg>')
        return "\n".join(p)

    # TOP GUN — dark outline behind, gradient fill on top
    common = ('text-anchor="middle" font-family="Anton" '
              'font-size="150" letter-spacing="1"')
    a(f'<text x="320" y="272" {common} fill="{BLACK}" '
      f'stroke="{BLACK}" stroke-width="18" stroke-linejoin="round">TOP GUN</text>')
    a(f'<text x="320" y="272" {common} fill="url(#tg)">TOP GUN</text>')

    # ROOFING LLC, kept clear of the converging lower edges
    a('<text x="320" y="334" text-anchor="middle" font-family="Anton" '
      f'font-size="40" letter-spacing="11" fill="{GOLD}">ROOFING LLC</text>')

    # flanking rules
    a(f'<rect x="132" y="316" width="44" height="5" fill="{GOLD_DK}"/>')
    a(f'<rect x="464" y="316" width="44" height="5" fill="{GOLD_DK}"/>')

    # chevrons echoing the point, sized to sit inside the frame
    a(f'<path d="M238,374 L320,392 L402,374" fill="none" stroke="{GOLD_DK}" '
      'stroke-width="6" stroke-linejoin="round"/>')
    a(f'<path d="M266,406 L320,418 L374,406" fill="none" stroke="{GOLD_DP}" '
      'stroke-width="5" stroke-linejoin="round"/>')

    a('</svg>')
    return "\n".join(p)


if __name__ == "__main__":
    import sys
    sys.stdout.write(badge(mark="--mark" in sys.argv))
