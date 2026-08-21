#!/usr/bin/env python3
"""
Render tools/guide.html to the gated PDF and refresh its cover thumbnail.

Run from the site root:  python3 tools/render-guide.py
Writes: assets/pittsburgh-exterior-paint-checklist.pdf
        assets/img/guide-cover.jpg
"""
import asyncio, glob, os
from playwright.async_api import async_playwright
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = "file://" + os.path.join(ROOT, "tools", "guide.html")
PDF  = os.path.join(ROOT, "assets", "pittsburgh-exterior-paint-checklist.pdf")
JPG  = os.path.join(ROOT, "assets", "img", "guide-cover.jpg")
TMP  = "/tmp/pps-guide-cover.png"

def browser_path():
    hits = (glob.glob("/opt/pw-browsers/chromium*/chrome-linux/chrome")
            + glob.glob("/opt/pw-browsers/chromium*/chrome-linux/headless_shell"))
    return hits[0] if hits else None

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=browser_path())
        pg = await (await b.new_context(viewport={"width": 816, "height": 1100},
                                        device_scale_factor=2)).new_page()
        await pg.goto(SRC); await pg.emulate_media(media="print")
        await pg.wait_for_timeout(700)
        await pg.pdf(path=PDF, format="Letter", print_background=True,
                     margin={"top": "0", "bottom": "0", "left": "0", "right": "0"})
        box = await pg.locator(".cover").bounding_box()
        await pg.screenshot(path=TMP, clip={"x": 0, "y": 0, "width": 816,
                                            "height": box["y"] + box["height"]})
        await b.close()

    im = Image.open(TMP).convert("RGB")
    target = (800, 1000)
    s = min(target[0] / im.width, target[1] / im.height)   # fit, never crop
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    canvas = Image.new("RGB", target, (14, 17, 22))        # the cover's own black
    canvas.paste(im, ((target[0] - im.width) // 2, (target[1] - im.height) // 2))
    canvas.save(JPG, "JPEG", quality=87, optimize=True, progressive=True)
    print(f"{os.path.basename(PDF)}  {os.path.getsize(PDF)/1024:.0f} KB")
    print(f"{os.path.basename(JPG)}  {os.path.getsize(JPG)/1024:.0f} KB")

asyncio.run(main())
