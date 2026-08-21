#!/usr/bin/env python3
"""
Render the Open Graph share card (1200x630) from the real logo and brand type.

This is what shows up when the site is pasted into Facebook, iMessage, WhatsApp
or Slack, so it uses the badge — which sits on a white disc and therefore holds
up on the dark brand ground — rather than the full lockup, whose black wordmark
bar would disappear.

Run from the site root:  python3 tools/make-og.py
Writes: dist/assets/img/og-image.jpg
"""
import asyncio, glob, os
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MARK = os.path.join(ROOT, "dist", "assets", "logo-mark.png")
OUT  = os.path.join(ROOT, "dist", "assets", "img", "og-image.jpg")

HTML = """<!doctype html><html><head><meta charset="utf-8">
<style>
/* Use the site's own self-hosted faces rather than Google Fonts — this card is
   baked once, so it must not depend on a network fetch at render time. */
@font-face{font-family:'Barlow Condensed';font-weight:700;src:url('FONT_DIR/barlow-condensed-700.woff2') format('woff2')}
@font-face{font-family:'Barlow Condensed';font-weight:800;src:url('FONT_DIR/barlow-condensed-800.woff2') format('woff2')}
@font-face{font-family:'Inter';font-weight:400 700;src:url('FONT_DIR/inter-var.woff2') format('woff2')}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:#14161A;color:#fff;
 font-family:Inter,system-ui,sans-serif;position:relative;
 display:flex;flex-direction:column;justify-content:center;padding:0 72px}
body::after{content:"";position:absolute;inset:0;
 background:radial-gradient(70% 90% at 88% 18%, rgba(249,186,11,.20), transparent 60%)}
.row{display:flex;align-items:center;gap:30px;position:relative;z-index:1}
.row img{height:120px;width:auto}
.wm b{font-family:"Barlow Condensed",sans-serif;font-weight:800;font-size:52px;
 letter-spacing:.5px;line-height:1;display:block;text-transform:uppercase}
.wm span{font-size:15px;font-weight:600;letter-spacing:3.6px;text-transform:uppercase;
 color:#A8B1BC;display:block;margin-top:6px}
h1{font-family:"Barlow Condensed",sans-serif;font-weight:800;font-size:96px;line-height:.94;
 text-transform:uppercase;margin-top:44px;position:relative;z-index:1;max-width:15ch}
h1 em{font-style:normal;color:#F9BA0B}
.foot{display:flex;align-items:center;gap:22px;margin-top:40px;position:relative;z-index:1;
 font-size:21px;color:#B9C1CC;flex-wrap:wrap}
.pill{background:#F9BA0B;color:#14161A;font-weight:700;padding:11px 22px;border-radius:100px;font-size:20px}
.tel{font-weight:700;color:#fff;font-size:26px}
</style></head><body>
<div class="row">
  <img src="MARK_SRC" alt="">
  <div class="wm"><b>Pittsburgh</b><span>Painting &amp; Property Solutions</span></div>
</div>
<h1>Exterior &amp; interior painting <em>done right</em></h1>
<div class="foot">
  <span class="pill">$1,000 off exterior repaints</span>
  <span class="tel">(412) 537-4866</span>
  <span>Family owned &middot; Fully insured</span>
</div>
</body></html>"""

def browser_path():
    hits = (glob.glob("/opt/pw-browsers/chromium*/chrome-linux/chrome")
            + glob.glob("/opt/pw-browsers/chromium*/chrome-linux/headless_shell"))
    return hits[0] if hits else None

async def main():
    fonts = "file://" + os.path.join(ROOT, "dist", "assets", "fonts")
    html = HTML.replace("MARK_SRC", "file://" + MARK).replace("FONT_DIR", fonts)
    tmp = "/tmp/pps-og.html"
    open(tmp, "w").write(html)
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=browser_path())
        pg = await (await b.new_context(viewport={"width": 1200, "height": 630},
                                        device_scale_factor=2)).new_page()
        await pg.goto("file://" + tmp)
        await pg.evaluate("document.fonts.ready")
        await pg.wait_for_timeout(600)
        await pg.screenshot(path="/tmp/pps-og.png")
        await b.close()
    from PIL import Image
    Image.open("/tmp/pps-og.png").convert("RGB").resize((1200, 630), Image.LANCZOS).save(
        OUT, "JPEG", quality=88, optimize=True, progressive=True)
    print(f"og-image.jpg  {os.path.getsize(OUT)/1024:.0f} KB")

asyncio.run(main())
