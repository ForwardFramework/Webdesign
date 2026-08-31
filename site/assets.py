"""Image resolution.

Photos are referenced by BASENAME, never by extension, so dropping
`pool-cage-rescreen-01.jpg` (or .webp) into static/img/gallery/ replaces the
placeholder with no code change. Rasters win over the generated .svg
placeholder; .webp wins over .jpg because it is smaller and Core Web Vitals is
a ranking factor.
"""
import os

_HERE = os.path.dirname(os.path.abspath(__file__))
GALLERY_DIR = os.path.join(_HERE, "static", "img", "gallery")
ORDER = (".webp", ".jpg", ".jpeg", ".png", ".svg")

def img_src(basename, folder="gallery"):
    base = os.path.splitext(basename)[0]
    d = os.path.join(_HERE, "static", "img", folder)
    for ext in ORDER:
        if os.path.exists(os.path.join(d, base + ext)):
            return f"/assets/img/{folder}/{base}{ext}"
    return f"/assets/img/{folder}/{base}.jpg"

def is_placeholder(basename, folder="gallery"):
    base = os.path.splitext(basename)[0]
    d = os.path.join(_HERE, "static", "img", folder)
    for ext in ORDER[:-1]:
        if os.path.exists(os.path.join(d, base + ext)):
            return False
    return True
