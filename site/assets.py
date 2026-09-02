"""Image resolution and intrinsic sizing.

Images are referenced by BASENAME, never by extension, so dropping
`pool-cage-rescreen-01.jpg` (or .webp, or .png) into static/img/ replaces the
placeholder with no code change. Rasters win over the generated .svg
placeholder; .webp wins over .jpg because it is smaller and Core Web Vitals is
a ranking factor.

The build also reads each image's real pixel dimensions and emits them as
width/height attributes. That matters for the logo in particular: a square logo
dropped in where a wide wordmark used to be would otherwise inherit the old
aspect ratio and render squashed, and a wrong ratio also mis-reserves space and
causes layout shift (CLS).
"""
import os, re, struct

_HERE = os.path.dirname(os.path.abspath(__file__))
ORDER = (".webp", ".jpg", ".jpeg", ".png", ".svg")


def _dir(folder):
    return os.path.join(_HERE, "static", "img", folder)


def _resolve(basename, folder):
    """Return (web path, absolute path or None)."""
    base = os.path.splitext(basename)[0]
    d = _dir(folder)
    for ext in ORDER:
        p = os.path.join(d, base + ext)
        if os.path.exists(p):
            return f"/assets/img/{folder}/{base}{ext}", p
    return f"/assets/img/{folder}/{base}.jpg", None


def img_src(basename, folder="gallery"):
    return _resolve(basename, folder)[0]


def exists(basename, folder="gallery"):
    return _resolve(basename, folder)[1] is not None


def is_placeholder(basename, folder="gallery"):
    """True when only the generated .svg placeholder is present."""
    base = os.path.splitext(basename)[0]
    d = _dir(folder)
    return not any(os.path.exists(os.path.join(d, base + e)) for e in ORDER[:-1])


# ---------------------------------------------------------------- dimensions
def _svg_size(path):
    head = open(path, "r", errors="replace").read(2048)
    vb = re.search(r'viewBox\s*=\s*["\']\s*[-\d.]+[,\s]+[-\d.]+[,\s]+'
                   r'([\d.]+)[,\s]+([\d.]+)', head)
    if vb:
        return float(vb.group(1)), float(vb.group(2))
    w = re.search(r'\swidth\s*=\s*["\']([\d.]+)', head)
    h = re.search(r'\sheight\s*=\s*["\']([\d.]+)', head)
    if w and h:
        return float(w.group(1)), float(h.group(1))
    return None


def _png_size(f):
    f.seek(16)
    return struct.unpack(">II", f.read(8))


def _webp_size(f):
    f.seek(12)
    tag = f.read(4)
    if tag == b"VP8X":
        f.seek(24)
        b = f.read(6)
        return (int.from_bytes(b[0:3], "little") + 1,
                int.from_bytes(b[3:6], "little") + 1)
    if tag == b"VP8 ":
        f.seek(26)
        b = f.read(4)
        return struct.unpack("<HH", b)[0] & 0x3FFF, struct.unpack("<HH", b)[1] & 0x3FFF
    if tag == b"VP8L":
        f.seek(21)
        n = int.from_bytes(f.read(4), "little")
        return (n & 0x3FFF) + 1, ((n >> 14) & 0x3FFF) + 1
    return None


def _jpeg_size(f):
    f.seek(2)
    while True:
        b = f.read(1)
        while b and b != b"\xff":
            b = f.read(1)
        marker = f.read(1)
        while marker == b"\xff":
            marker = f.read(1)
        if not marker:
            return None
        m = marker[0]
        if 0xC0 <= m <= 0xCF and m not in (0xC4, 0xC8, 0xCC):
            f.read(3)
            h, w = struct.unpack(">HH", f.read(4))
            return w, h
        seg = f.read(2)
        if len(seg) < 2:
            return None
        f.seek(struct.unpack(">H", seg)[0] - 2, 1)


def img_size(basename, folder="gallery", default=(800, 600)):
    """Intrinsic (width, height) in pixels, or `default` if unreadable."""
    path = _resolve(basename, folder)[1]
    if not path:
        return default
    try:
        if path.endswith(".svg"):
            return tuple(round(v) for v in (_svg_size(path) or default))
        with open(path, "rb") as f:
            sig = f.read(12)
            f.seek(0)
            if sig.startswith(b"\x89PNG"):
                return _png_size(f)
            if sig[:4] == b"RIFF" and sig[8:12] == b"WEBP":
                return _webp_size(f) or default
            if sig.startswith(b"\xff\xd8"):
                return _jpeg_size(f) or default
    except Exception:
        pass
    return default


# --------------------------------------------------------------------- logo
def logo(variant="dark"):
    """Resolve a logo to (src, width, height, is_fallback).

    Businesses usually have one logo file, not a matched dark/light pair. If
    `acosta-pro-logo-light.*` is missing, fall back to the main logo and let the
    caller put it on a light chip so it stays legible on the navy footer.
    """
    if variant == "light" and exists("acosta-pro-logo-light", "brand"):
        src = img_src("acosta-pro-logo-light", "brand")
        w, h = img_size("acosta-pro-logo-light", "brand", (236, 56))
        return src, w, h, False
    src = img_src("acosta-pro-logo", "brand")
    w, h = img_size("acosta-pro-logo", "brand", (236, 56))
    return src, w, h, variant == "light"
