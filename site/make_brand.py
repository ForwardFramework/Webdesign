#!/usr/bin/env python3
"""Generate the Acosta Pro brand assets from one shared definition of the mark.

The mark is a layered roofline: a wide shallow eave, a narrower steeper gable
in front of it, a chimney on the right slope, and a two-pane window beneath the
peak. The layers are separated by a stroke in the SURFACE colour, which is what
gives the original artwork its stacked, cut-out look — so the separator is
white on the light lockup and navy on the dark one.

Geometry lives in MARK once and is reused by every output (SVG lockups, favicon,
app icons, OG card), so the mark cannot drift between sizes.

    python3 site/make_brand.py
"""
import os, zlib, struct

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "static", "img", "brand")
os.makedirs(OUT, exist_ok=True)

# Sampled from the supplied logo: cyan at the apex, deep blue at the eaves.
CYAN, BLUE, DEEP = "#7FD9FF", "#2E9BE8", "#0B4F97"
PANE = "#6FCFFA"
NAVY = "#04121F"
WORD_D, WORD_L = "#08243D", "#FFFFFF"
TAG_D,  TAG_L  = "#1273CE", "#8CC5EF"

FONT = "Poppins, Montserrat, 'Segoe UI', system-ui, sans-serif"

# Mark geometry on a 96 x 56 grid. Each entry is (svg path, polygon, fill key).
MARK = [
    # wide shallow eave — visible outside and below the gable
    ("M1 49 L50 19 L99 49 L83 49 L50 28 L17 49 Z",
     [(1, 49), (50, 19), (99, 49), (83, 49), (50, 28), (17, 49)], "grad"),
    # gable in front, peak just above the eave
    ("M13 45 L50 5 L87 45 L73 45 L50 21 L27 45 Z",
     [(13, 45), (50, 5), (87, 45), (73, 45), (50, 21), (27, 45)], "grad"),
    # chimney at the shoulder of the right slope
    ("M63 12 h4.4 v12 h-4.4 Z", [(63, 12), (67.4, 12), (67.4, 24), (63, 24)], "grad"),
    # two-pane window beneath the peak
    ("M43.6 32 h4.2 v13 h-4.2 Z", [(43.6, 32), (47.8, 32), (47.8, 45), (43.6, 45)], "pane"),
    ("M52.2 32 h4.2 v13 h-4.2 Z", [(52.2, 32), (56.4, 32), (56.4, 45), (52.2, 45)], "pane"),
]
MARK_W, MARK_H = 100, 54


def grad(gid):
    return (f'<linearGradient id="{gid}" x1="0" y1="0" x2=".22" y2="1">'
            f'<stop offset="0" stop-color="{CYAN}"/>'
            f'<stop offset=".46" stop-color="{BLUE}"/>'
            f'<stop offset="1" stop-color="{DEEP}"/></linearGradient>')


def mark_svg(gid, sep, scale=1.0, dx=0.0, dy=0.0, sw=2.0):
    parts = []
    for d, _poly, fill in MARK:
        f = f"url(#{gid})" if fill == "grad" else PANE
        parts.append(f'<path d="{d}" fill="{f}" stroke="{sep}" '
                     f'stroke-width="{sw}" stroke-linejoin="round"/>')
    return (f'<g transform="translate({dx} {dy}) scale({scale})">'
            + "".join(parts) + "</g>")


def lockup_h(word, tag, sep, gid):
    """Horizontal lockup — header and footer."""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 292 64" width="292" height="64" role="img" aria-label="Acosta Pro Aluminum Screen">
<defs>{grad(gid)}</defs>
{mark_svg(gid, sep, 1.0, 0, 5)}
<text x="116" y="35" font-family="{FONT}" font-size="28" font-weight="700" fill="{word}">Acosta Pro</text>
<text x="117" y="53" font-family="{FONT}" font-size="13" font-weight="500" letter-spacing=".5" fill="{tag}">Aluminum Screen</text>
</svg>'''


def lockup_v(word, tag, sep, gid, bg=None):
    """Stacked lockup — matches the supplied artwork. Social and print."""
    rect = f'<rect width="300" height="230" fill="{bg}"/>' if bg else ""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 230" width="300" height="230" role="img" aria-label="Acosta Pro Aluminum Screen">
<defs>{grad(gid)}</defs>{rect}
{mark_svg(gid, sep, 1.5, 75, 14, 1.7)}
<text x="150" y="177" text-anchor="middle" font-family="{FONT}" font-size="42" font-weight="700" fill="{word}">Acosta Pro</text>
<text x="150" y="206" text-anchor="middle" font-family="{FONT}" font-size="19" font-weight="500" letter-spacing="1" fill="{tag}">Aluminum Screen</text>
</svg>'''


def write(name, content):
    open(os.path.join(OUT, name), "w").write(content)
    print("  ", name)


# ---------------------------------------------------------------- rasterise
def hx(c):
    return tuple(int(c[i:i + 2], 16) for i in (1, 3, 5))


def lerp(a, b, t):
    t = max(0.0, min(1.0, t))
    return tuple(a[i] + (b[i] - a[i]) * t for i in range(3))


C_CYAN, C_BLUE, C_DEEP, C_NAVY, C_PANE = map(hx, (CYAN, BLUE, DEEP, NAVY, PANE))


def ramp(t):
    return lerp(C_CYAN, C_BLUE, t / .46) if t < .46 else lerp(C_BLUE, C_DEEP, (t - .46) / .54)


def inside(poly, x, y):
    n, c = len(poly), False
    j = n - 1
    for i in range(n):
        xi, yi = poly[i]
        xj, yj = poly[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
            c = not c
        j = i
    return c


def render_mark(w, h, pad=0.10, bg_a=None, bg_b=None, mesh=0, ss=3):
    """Rasterise the mark centred in a w x h canvas, supersampled for clean edges."""
    bg_a = bg_a or C_NAVY
    bg_b = bg_b or hx("#0A2440")
    s = min(w * (1 - 2 * pad) / MARK_W, h * (1 - 2 * pad) / MARK_H)
    ox, oy = (w - MARK_W * s) / 2, (h - MARK_H * s) / 2

    def px(x, y):
        base = lerp(bg_a, bg_b, (x / w) * .55 + (y / h) * .45)
        if mesh and (x % mesh == 0 or y % mesh == 0):
            base = lerp(base, (255, 255, 255), .05)
        acc, hits = [0.0, 0.0, 0.0], 0
        for sy in range(ss):
            for sx in range(ss):
                mx = (x + (sx + .5) / ss - ox) / s
                my = (y + (sy + .5) / ss - oy) / s
                col = None
                for _d, poly, fill in MARK:
                    if inside(poly, mx, my):
                        col = C_PANE if fill == "pane" else ramp((my - 5) / 44)
                if col:
                    hits += 1
                    for i in range(3):
                        acc[i] += col[i]
        if not hits:
            return tuple(int(v) for v in base)
        n = ss * ss
        fg = [acc[i] / hits for i in range(3)]
        a = hits / n
        return tuple(int(base[i] * (1 - a) + fg[i] * a) for i in range(3))
    return px


def write_png(path, w, h, px):
    raw = bytearray()
    for y in range(h):
        raw.append(0)
        for x in range(w):
            raw.extend(px(x, y))
    def ch(t, d):
        return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xffffffff)
    open(path, "wb").write(b"\x89PNG\r\n\x1a\n"
        + ch(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
        + ch(b"IDAT", zlib.compress(bytes(raw), 9)) + ch(b"IEND", b""))
    print("  ", os.path.basename(path))


if __name__ == "__main__":
    print("SVG:")
    write("acosta-pro-logo.svg",         lockup_h(WORD_D, TAG_D, "#FFFFFF", "lgD"))
    write("acosta-pro-logo-light.svg",   lockup_h(WORD_L, TAG_L, NAVY,      "lgL"))
    write("acosta-pro-logo-stacked.svg", lockup_v(WORD_L, TAG_L, NAVY,      "lgS", NAVY))
    write("favicon.svg", f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="Acosta Pro">
<defs>{grad("fav")}</defs>
<rect width="64" height="64" rx="13" fill="{NAVY}"/>
{mark_svg("fav", NAVY, 0.54, 5.0, 17.5, 2.4)}
</svg>''')

    print("PNG:")
    for name, size, mesh in (("apple-touch-icon.png", 180, 0),
                             ("icon-192.png", 192, 0),
                             ("icon-512.png", 512, 44)):
        write_png(os.path.join(OUT, name), size, size,
                  render_mark(size, size, pad=0.16, mesh=mesh))
    write_png(os.path.join(OUT, "og-default.png"), 1200, 630,
              render_mark(1200, 630, pad=0.17, mesh=40))
