#!/usr/bin/env python3
"""Render the social share card and the apple-touch icon with headless Chromium.

    python3 tools/make_og.py

Chromium path is taken from $CHROME_BIN, falling back to the usual locations.
"""
import os
import shutil
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "assets", "img")

CANDIDATES = [
    os.environ.get("CHROME_BIN", ""),
    "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    shutil.which("chromium") or "",
    shutil.which("chromium-browser") or "",
    shutil.which("google-chrome") or "",
]

OG_HTML = """<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;font-family:Georgia,'Liberation Serif',serif;
  background:#0B1E3D;color:#fff;position:relative}
.bg{position:absolute;inset:0;background:
  radial-gradient(760px 420px at 82% 12%,rgba(61,95,166,.65),transparent 62%),
  radial-gradient(560px 380px at 4% 96%,rgba(243,178,41,.20),transparent 64%),
  linear-gradient(155deg,#14315F 0%,#0D2249 60%,#0B1E3D 100%)}
.grid{position:absolute;inset:0;opacity:.45;
  background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),
  linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:60px 60px}
.wrap{position:relative;height:100%;display:flex;flex-direction:column;justify-content:center;
  padding:64px 70px}
img{width:540px}
h1{font-family:'Arial Narrow',Arial,sans-serif;font-weight:700;font-size:60px;line-height:1.02;
  text-transform:uppercase;letter-spacing:.5px;margin:34px 0 0;max-width:1000px}
h1 em{font-style:normal;color:#F3B229;display:block}
p{font-family:Arial,Helvetica,sans-serif;font-size:25px;color:#C6D3E8;margin-top:18px}
.bar{position:absolute;left:0;right:0;bottom:0;height:86px;background:#F3B229;color:#0B1E3D;
  display:flex;align-items:center;justify-content:space-between;padding:0 70px;
  font-family:'Arial Narrow',Arial,sans-serif;font-weight:700;font-size:34px;text-transform:uppercase;
  letter-spacing:.6px}
.bar span:last-child{font-size:28px}
.stars{color:#F3B229;font-size:30px;letter-spacing:3px;margin-top:26px;
  font-family:Arial,Helvetica,sans-serif}
.stars b{color:#fff;font-size:22px;letter-spacing:0;margin-left:10px;font-weight:600}
</style></head><body>
<div class="bg"></div><div class="grid"></div>
<div class="wrap">
  <img src="LOGO_PATH" alt="">
  <h1>Painting &amp; Home Improvement<em>Done Right The First Time</em></h1>
  <p>Interior &middot; Exterior &middot; Cabinets &middot; Drywall &middot; Sarasota &amp; Bradenton, FL</p>
  <div class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;<b>5.0 on Google &middot; Fully insured</b></div>
</div>
<div class="bar"><span>Free Estimates</span><span>Call or text 941-405-2750</span></div>
</body></html>"""

ICON_HTML = """<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0}body{width:180px;height:180px;overflow:hidden}
img{width:180px;height:180px;display:block}
</style></head><body><img src="ICON_PATH" alt=""></body></html>"""


def chrome():
    for c in CANDIDATES:
        if c and os.path.exists(c):
            return c
    sys.exit("Chromium not found. Set CHROME_BIN to a Chrome/Chromium binary.")


def shoot(binary, html, out, width, height):
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, dir=IMG) as fh:
        fh.write(html)
        tmp = fh.name
    try:
        subprocess.run([
            binary, "--headless", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
            "--allow-file-access-from-files", "--force-device-scale-factor=1",
            "--window-size=%d,%d" % (width, height),
            "--screenshot=%s" % out, "file://" + tmp,
        ], check=True, capture_output=True)
        print("wrote", out)
    finally:
        os.unlink(tmp)


if __name__ == "__main__":
    b = chrome()
    logo = os.path.join(IMG, "logo-white.svg")
    icon = os.path.join(IMG, "favicon.svg")
    shoot(b, OG_HTML.replace("LOGO_PATH", "file://" + logo),
          os.path.join(IMG, "og-cover.png"), 1200, 630)
    shoot(b, ICON_HTML.replace("ICON_PATH", "file://" + icon),
          os.path.join(IMG, "apple-touch-icon.png"), 180, 180)
