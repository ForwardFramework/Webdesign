#!/usr/bin/env python3
"""
Turn the supplied logo PDF into the web assets the site needs.

The PDF wraps a single 1206x903 JPEG, so this extracts that image, knocks out
the white card behind the artwork, and writes two transparent PNGs:

  logo-lockup.png   badge + PITTSBURGH bar + tagline  (share card, PDF cover)
  logo-mark.png     badge + roller, natural ratio     (header, footer)
  logo-icon.png     badge alone, square              (Apple touch icon, PWA)
  favicon.png       badge at 64px                    (browser tab)

The knockout floods in from the edges rather than keying every white pixel —
the badge interior is white too, and a naive key would punch holes through it.

Usage:  python3 tools/extract-logo.py <source.pdf>
"""
import os, sys
from collections import deque
from PIL import Image, ImageDraw

ROOT   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, "dist", "assets")

def load(src):
    if src.lower().endswith(".pdf"):
        import pymupdf
        doc = pymupdf.open(src)
        info = doc.extract_image(doc[0].get_images(full=True)[0][0])
        import io
        return Image.open(io.BytesIO(info["image"])).convert("RGB")
    return Image.open(src).convert("RGB")

def knockout(im, tol=26):
    """Alpha-out the background: flood from the border through near-white only."""
    w, h = im.size
    px = im.load()
    bg = [False] * (w * h)
    q = deque()
    def white(x, y):
        r, g, b = px[x, y][:3]
        return r > 255 - tol and g > 255 - tol and b > 255 - tol
    for x in range(w):
        for y in (0, h - 1):
            if white(x, y) and not bg[y * w + x]:
                bg[y * w + x] = True; q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if white(x, y) and not bg[y * w + x]:
                bg[y * w + x] = True; q.append((x, y))
    while q:
        x, y = q.popleft()
        for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not bg[ny*w+nx] and white(nx, ny):
                bg[ny*w+nx] = True; q.append((nx, ny))
    out = im.convert("RGBA")
    op = out.load()
    for y in range(h):
        row = y * w
        for x in range(w):
            if bg[row + x]:
                op[x, y] = (255, 255, 255, 0)
    return out

def trim(im):
    b = im.getbbox()
    return im.crop(b) if b else im

# Geometry measured off the supplied artwork with a percentage grid, not guessed:
# the badge ring spans x 12.1%-78.0% and starts at y 11.0%; the gold rule capping
# the wordmark bar sits at y 70%, and that bar overlaps the badge's lower third,
# so the circle is necessarily flat-bottomed. The paint roller overhangs to the
# right edge. The "(" of the phone arc dips into the corner beside the ring and
# is cleared rather than cropped, since cropping lower would clip the badge.
ARC_BOTTOM  = 0.145      # just under the phone digits (clips a sliver of ring)
BAR_TOP     = 0.699      # gold rule above the wordmark bar
BADGE_LEFT  = 0.121
BADGE_RIGHT = 0.780
ARC_TAIL    = (0.100, 0.300)   # fraction of the *crop* to clear, top-left
# Badge circle, as fractions of the full artwork.
BADGE_CX, BADGE_CY, BADGE_R = 0.450, 0.498, 0.330
# Roller zone: right of the badge and below the phone digits.
ROLLER_X, ROLLER_Y = 0.600, 0.145
BADGE_RIGHT = 0.712

def square(im, pad=0.04):
    """Pad to a square canvas so the mark never distorts in a fixed-size box."""
    w, h = im.size
    side = int(max(w, h) * (1 + pad * 2))
    out = Image.new("RGBA", (side, side), (255, 255, 255, 0))
    out.paste(im, ((side - w) // 2, (side - h) // 2), im)
    return out

def write_png(im, name, width=None):
    """Right-size and palettise before writing.

    The artwork is flat vector-style, so a 256-colour palette is visually
    indistinguishable and roughly halves the file. Sizing matters more: the
    header mark displays at ~74px, so shipping 760px was ~5x more pixels than
    even a 3x display can use."""
    if width and im.size[0] != width:
        im = im.resize((width, round(width * im.size[1] / im.size[0])), Image.LANCZOS)
    im.quantize(colors=256, method=Image.FASTOCTREE).convert("RGBA").save(
        os.path.join(ASSETS, name), optimize=True)
    kb = os.path.getsize(os.path.join(ASSETS, name)) / 1024
    print(f"  {name:<18} {im.size[0]}x{im.size[1]}  {kb:.0f} KB")


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else None
    if not src or not os.path.exists(src):
        raise SystemExit("usage: python3 tools/extract-logo.py <logo.pdf|png|jpg>")
    im = trim(knockout(load(src)))
    print(f"artwork after knockout+trim: {im.size[0]}x{im.size[1]}")

    # Only social crawlers and the PDF fetch this one; 800px is ample.
    write_png(im, "logo-lockup.png", 800)

    w, h = im.size
    top, bot = int(h * ARC_BOTTOM), int(h * BAR_TOP)
    left, cright = int(w * BADGE_LEFT), int(w * BADGE_RIGHT)

    # Header mark: badge + roller, kept at its natural ~1.9:1 ratio. Forcing it
    # into a square would shrink the goat to a smudge at 46px.
    # Header mark: keep whatever is inside the badge circle, plus the roller
    # zone to the right of it. Masking rather than cropping is what removes the
    # phone arc cleanly — the arc curves right alongside the ring, so no
    # rectangle separates the two.
    cx, cy, rr = BADGE_CX * w, BADGE_CY * h, BADGE_R * w
    disc = Image.new("L", (w, h), 0)
    ImageDraw.Draw(disc).ellipse((cx - rr, cy - rr, cx + rr, cy + rr), fill=255)
    dd = ImageDraw.Draw(disc)
    dd.rectangle((ROLLER_X * w, ROLLER_Y * h, w, bot), fill=255)   # roller + fist
    keep = im.copy()
    keep.putalpha(Image.composite(im.split()[3], Image.new("L", (w, h), 0), disc))
    # 320px covers a 74px display slot at 4x; anything more is dead weight.
    write_png(trim(keep.crop((0, 0, w, bot))), "logo-mark.png", 320)

    # Favicon: mask to the true circle so no fragment of the phone arc survives.
    # The wordmark bar overlaps the badge in the source, so the disc is
    # necessarily flat-bottomed — that reads fine at favicon sizes.
    cx, cy, rr = BADGE_CX * w, BADGE_CY * h, BADGE_R * w
    disc = Image.new("L", (w, h), 0)
    ImageDraw.Draw(disc).ellipse((cx - rr, cy - rr, cx + rr, cy + rr), fill=255)
    masked = im.copy()
    masked.putalpha(Image.composite(im.split()[3], Image.new("L", (w, h), 0), disc))
    badge = square(trim(masked.crop((0, 0, w, bot))), pad=0.02)
    # 512 is the conventional touch-icon / PWA size, but browsers fetch the
    # favicon on every page view — so that one gets its own tiny build.
    write_png(badge, "logo-icon.png", 512)
    write_png(badge, "favicon.png", 64)


if __name__ == "__main__":
    main()
