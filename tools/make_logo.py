#!/usr/bin/env python3
"""Generate the Angel's Hand Painting LLC logo assets as SVG.

Outputs (assets/img/):
  logo.svg        full stacked lockup, dark type (use on light backgrounds)
  logo-white.svg  same lockup, reversed type (use on navy backgrounds)
  logo-mark.svg   wing + roof mark only (square, for favicons / social)
  favicon.svg     simplified mark on a navy rounded square

Run:  python3 tools/make_logo.py
"""
import math
import os

GOLD = "#F3B229"
GOLD_DK = "#D99A12"
INK = "#111827"          # feather outline
NAVY = "#14315F"         # "ANGEL'S HAND" + tagline
BLUE = "#3D5FA6"         # roof + "PAINTING"

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "img")


# --------------------------------------------------------------------------- wing
def _bez(a, c, b, t):
    """Point on a quadratic bezier."""
    m = 1 - t
    return (m * m * a[0] + 2 * m * t * c[0] + t * t * b[0],
            m * m * a[1] + 2 * m * t * c[1] + t * t * b[1])


def _to_path(pts):
    d = "M{:.1f},{:.1f}".format(*pts[0])
    d += "".join("L{:.1f},{:.1f}".format(x, y) for x, y in pts[1:])
    return d + "Z"


def _feather(pivot, tip, half_width, bow=0.17, samples=34):
    """A tapered, gently bowed blade running from `pivot` to `tip`."""
    dx, dy = tip[0] - pivot[0], tip[1] - pivot[1]
    length = math.hypot(dx, dy)
    px, py = -dy / length, dx / length          # unit perpendicular
    mid = ((pivot[0] + tip[0]) / 2, (pivot[1] + tip[1]) / 2)
    ctrl = (mid[0] - px * bow * length, mid[1] - py * bow * length)

    left, right = [], []
    for i in range(samples + 1):
        s = i / samples
        p = _bez(pivot, ctrl, tip, s)
        # tangent for a locally correct normal
        n = _bez(pivot, ctrl, tip, min(1.0, s + 0.01))
        tx, ty = n[0] - p[0], n[1] - p[1]
        tl = math.hypot(tx, ty) or 1.0
        nx, ny = -ty / tl, tx / tl
        # quill at the base, widest just past a third, sharp tip
        w = half_width * 2.387 * (s ** 0.5) * ((1 - s) ** 0.8)
        left.append((p[0] + nx * w, p[1] + ny * w))
        right.append((p[0] - nx * w, p[1] - ny * w))

    return left + list(reversed(right[1:]))


def _wing_points():
    """Nine feathers fanning from a common base, tips along an upper-left arc."""
    pivot = (296.0, 556.0)
    arc_a, arc_c, arc_b = (250.0, 18.0), (74.0, 52.0), (14.0, 262.0)
    out = []
    n = 9
    for k in range(n):
        t = k / (n - 1)
        tip = _bez(arc_a, arc_c, arc_b, t)
        half = 30.0 + 3.4 * k
        bow = 0.14 + 0.030 * k
        out.append(_feather(pivot, tip, half, bow))
    return out


# --------------------------------------------------------------------------- fitting
def _bbox(paths_pts):
    xs = [x for pts in paths_pts for x, _ in pts]
    ys = [y for pts in paths_pts for _, y in pts]
    return min(xs), min(ys), max(xs), max(ys)


def _fit(x0, y0, x1, y1, box, x, y, w=None, h=None):
    """Transform mapping art bbox `box` into a rect anchored at (x, y)."""
    bw, bh = x1 - x0, y1 - y0
    if w is None:
        w = bw * (h / bh)
    if h is None:
        h = bh * (w / bw)
    sx, sy = w / bw, h / bh
    sc = min(sx, sy)
    return "translate({:.3f},{:.3f}) scale({:.5f})".format(x - x0 * sc, y - y0 * sc, sc)


def wing_group(x, y, height):
    pts = _wing_points()
    box = _bbox(pts)
    tf = _fit(box[0], box[1], box[2], box[3], box, x, y, h=height)
    body = "".join(
        '<path d="{}" fill="{}" stroke="{}" stroke-width="6.5" '
        'stroke-linejoin="round"/>'.format(_to_path(p), GOLD, INK) for p in pts)
    return '<g transform="{}">{}</g>'.format(tf, body)


# --------------------------------------------------------------------------- roof
ROOF_D = ("M100,3 L152,40 L152,12 L178,12 L178,58 L198,72 L198,95 "
          "L100,25 L2,95 L2,72 Z")
ROOF_BOX = (2.0, 3.0, 198.0, 108.0)


def roof_group(x, y, width, color=BLUE, pane="#FFFFFF"):
    tf = _fit(ROOF_BOX[0], ROOF_BOX[1], ROOF_BOX[2], ROOF_BOX[3], ROOF_BOX, x, y, w=width)
    win = ('<rect x="80" y="58" width="40" height="50" rx="2" fill="{c}"/>'
           '<rect x="98" y="58" width="4" height="50" fill="{p}"/>'
           '<rect x="80" y="80" width="40" height="4" fill="{p}"/>'.format(c=color, p=pane))
    return ('<g transform="{}"><path d="{}" fill="{}"/>{}</g>'
            .format(tf, ROOF_D, color, win))


# --------------------------------------------------------------------------- type
SERIF = "Georgia,'Times New Roman',Times,'Liberation Serif',serif"


def _text(x, y, size, fill, content, length=None, anchor="middle", weight="700",
          spacing="0", family=SERIF):
    tl = ('textLength="{}" lengthAdjust="spacingAndGlyphs" '.format(length)) if length else ""
    return ('<text x="{x}" y="{y}" text-anchor="{a}" font-family="{f}" font-weight="{w}" '
            'font-size="{s}" letter-spacing="{sp}" fill="{c}" {tl}>{t}</text>'
            .format(x=x, y=y, a=anchor, f=family, w=weight, s=size, sp=spacing,
                    c=fill, tl=tl, t=content))


# --------------------------------------------------------------------------- files
def full_lockup(reverse=False):
    ink_1 = "#FFFFFF" if reverse else NAVY      # ANGEL'S HAND + LLC + tagline
    ink_2 = "#FFFFFF" if reverse else BLUE      # PAINTING + roof
    pane = NAVY if reverse else "#FFFFFF"

    p = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 770" '
         'role="img" aria-label="Angel&#8217;s Hand Painting LLC - residential and '
         'commercial painting"><title>Angel&#8217;s Hand Painting LLC</title>']
    p.append(wing_group(24, 24, 596))
    p.append(roof_group(432, 120, 252, ink_2, pane))
    p.append(_text(752, 424, 122, ink_1, "ANGEL&#8217;S HAND", length=792))
    p.append(_text(748, 580, 196, ink_2, "PAINTING", length=786))
    p.append('<rect x="356" y="616" width="286" height="9" rx="4.5" fill="{}"/>'.format(GOLD))
    p.append('<rect x="856" y="616" width="286" height="9" rx="4.5" fill="{}"/>'.format(GOLD))
    p.append(_text(749, 644, 74, ink_1, "LLC", length=150, spacing="4"))
    p.append(_text(628, 744, 82, ink_1, "Residential &amp; Commercial",
                   length=884, weight="400"))
    p.append("</svg>")
    return "".join(p)


def mark(bg=None, rounded=False, pad=54):
    p = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" '
         'role="img" aria-label="Angel&#8217;s Hand Painting LLC">']
    if bg:
        r = ' rx="104"' if rounded else ""
        p.append('<rect width="512" height="512"{} fill="{}"/>'.format(r, bg))
    roof_color = "#FFFFFF" if bg else BLUE
    pane = bg if bg else "#FFFFFF"
    p.append(wing_group(pad, pad, 512 - pad * 2))
    p.append(roof_group(250, 196, 214, roof_color, pane))
    p.append("</svg>")
    return "".join(p)


def write(name, data):
    path = os.path.join(OUT, name)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(data + "\n")
    print("wrote", path)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    write("logo.svg", full_lockup(False))
    write("logo-white.svg", full_lockup(True))
    write("logo-mark.svg", mark())
    write("favicon.svg", mark(bg=NAVY, rounded=True, pad=86))
