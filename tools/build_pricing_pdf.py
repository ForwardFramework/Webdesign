#!/usr/bin/env python3
"""
Produce the pricing archive: every figure that was on the public site, in one
document, so pricing can be reviewed offline and restored later.

    python3 tools/build_pricing_pdf.py     -> dist/pricing-archive.html

Reads the same SERVICES data that tools/build.py uses, so this can never drift
from what the site would publish if SHOW_PRICING were switched back on.
"""

import html
import os
import sys
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
from build import SERVICES  # noqa: E402  (same source of truth as the site)

TODAY = date.today().strftime("%d %B %Y")

BILLING = [
    ("Fixed scope, fixed price",
     "Project work is quoted as a fixed number after the free deliverable. If we underestimate, that is our problem rather than a change order."),
    ("90 days, then month to month",
     "Retainers need a 90-day runway to be measurable. After that, cancel with 30 days' notice, any month, no penalty."),
    ("Media spend is the client's",
     "Ad budget is paid by the client directly to the platform. Never marked up, never rebated."),
    ("The client owns the assets",
     "Code, accounts, automations, documentation and data are in their name from day one."),
    ("Bundled engagements",
     "Three or more services together typically ran 10–15% below the individual rates, because one audit, one tracking build and one reporting layer replace three."),
    ("Payment terms",
     "Projects billed 50% at kickoff and 50% at launch. Retainers billed monthly in advance."),
]


def main():
    sections = []
    for i, s in enumerate(SERVICES):
        rows = "".join(f"""
        <tr>
          <td class="tier">{html.escape(p[0])}{' <span class="flag">most requested</span>' if p[5] else ''}</td>
          <td class="amount">{html.escape(p[1])}</td>
          <td class="unit">{html.escape(p[2])}</td>
          <td class="note">{html.escape(p[3])}</td>
          <td class="feat">{'<br>'.join(html.escape(f) for f in p[4])}</td>
        </tr>""" for p in s["prices"])

        sections.append(f"""
  <section class="svc">
    <div class="svc-head">
      <span class="idx">{i + 1:02d}</span>
      <h2>{html.escape(s['nav'])}</h2>
      <span class="offer">Free deliverable — {html.escape(s['offer']['name'])}</span>
    </div>
    <table>
      <thead><tr><th>Tier</th><th>Price</th><th>Basis</th><th>What it covered</th><th>Included</th></tr></thead>
      <tbody>{rows}</tbody>
    </table>
  </section>""")

    billing = "".join(
        f"<div class='rule'><b>{html.escape(t)}</b><p>{html.escape(d)}</p></div>"
        for t, d in BILLING)

    doc = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Forward Framework — Pricing Archive</title>
<style>
  @page {{ size: Letter; margin: 15mm 14mm 16mm; }}
  * {{ box-sizing: border-box; }}
  body {{ margin:0; color:#14120F; background:#fff;
         font-family:"Helvetica Neue",Helvetica,Arial,sans-serif; font-size:9.5pt; line-height:1.5;
         -webkit-print-color-adjust:exact; print-color-adjust:exact; }}

  .cover {{ background:#0A0A0A; color:#fff; margin:-15mm -14mm 12mm; padding:34mm 14mm 26mm; }}
  .cover svg {{ width:22mm; margin-bottom:8mm; }}
  .cover .rule {{ width:44mm; height:2px; background:#A99A8C; margin-bottom:7mm; }}
  .cover h1 {{ font-size:27pt; font-weight:300; letter-spacing:.15em; text-transform:uppercase; margin:0 0 2mm; }}
  .cover h2 {{ font-size:11pt; font-weight:400; letter-spacing:.28em; text-transform:uppercase; color:#A99A8C; margin:0 0 9mm; }}
  .cover p {{ max-width:135mm; color:#C9C6C1; margin:0 0 2mm; font-size:10pt; }}
  .cover .meta {{ margin-top:8mm; font-size:8pt; letter-spacing:.14em; text-transform:uppercase; color:#8B8681; }}

  .banner {{ border-left:3px solid #A99A8C; background:#F6F3EF; padding:5mm 6mm; margin-bottom:10mm; }}
  .banner b {{ display:block; margin-bottom:1.5mm; }}
  .banner code {{ background:#EAE4DC; padding:.5mm 1.5mm; font-size:8.5pt; }}

  .svc {{ margin-bottom:9mm; break-inside:avoid; }}
  .svc-head {{ display:flex; align-items:baseline; gap:4mm; border-bottom:1.2pt solid #14120F;
               padding-bottom:2mm; margin-bottom:3mm; }}
  .idx {{ font-size:8pt; color:#A99A8C; letter-spacing:.12em; }}
  .svc-head h2 {{ font-size:13pt; font-weight:600; margin:0; flex:1; letter-spacing:-.01em; }}
  .offer {{ font-size:7.5pt; text-transform:uppercase; letter-spacing:.08em; color:#6B5E52; text-align:right; max-width:70mm; }}

  table {{ width:100%; border-collapse:collapse; }}
  th {{ font-size:7pt; text-transform:uppercase; letter-spacing:.12em; color:#6B5E52;
        text-align:left; padding:0 3mm 2mm 0; border-bottom:.5pt solid #D8D2C9; font-weight:600; }}
  td {{ padding:2.5mm 3mm 2.5mm 0; border-bottom:.5pt solid #EDE9E3; vertical-align:top; font-size:8.5pt; }}
  .tier {{ font-weight:600; width:30mm; }}
  .flag {{ display:inline-block; font-size:6.5pt; text-transform:uppercase; letter-spacing:.1em;
           background:#A99A8C; color:#fff; padding:.4mm 1.4mm; vertical-align:middle; }}
  .amount {{ font-size:13pt; font-weight:300; white-space:nowrap; width:22mm; letter-spacing:-.02em; }}
  .unit {{ color:#5C554D; width:26mm; font-size:8pt; }}
  .note {{ color:#5C554D; width:48mm; }}
  .feat {{ color:#14120F; font-size:8pt; line-height:1.45; }}

  .rules {{ break-before:page; }}
  .rules h2 {{ font-size:15pt; font-weight:300; letter-spacing:-.01em; margin:0 0 5mm; }}
  .rules-grid {{ display:grid; grid-template-columns:1fr 1fr; gap:5mm 8mm; }}
  .rule {{ border-top:1pt solid #14120F; padding-top:2.5mm; break-inside:avoid; }}
  .rule b {{ font-size:9.5pt; }}
  .rule p {{ margin:1mm 0 0; color:#5C554D; font-size:8.5pt; }}
</style>
</head>
<body>

<div class="cover">
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <path fill="#A99A8C" d="M78 34 L198 34 L164 68 L112 68 L112 112 L174 112 L140 146 L112 146 L112 200 L78 166 Z"/>
    <path fill="#FFFFFF" d="M0 0 L120 0 L86 34 L34 34 L34 78 L96 78 L62 112 L34 112 L34 200 L0 166 Z"/>
  </svg>
  <div class="rule"></div>
  <h1>Pricing Archive</h1>
  <h2>Forward Framework</h2>
  <p>Every price that was published on the website, preserved in full. Pricing has been removed from the public site; these figures are retained so they can be reviewed, revised or restored.</p>
  <div class="meta">{len(SERVICES)} services &nbsp;·&nbsp; {sum(len(s['prices']) for s in SERVICES)} tiers &nbsp;·&nbsp; {TODAY}</div>
</div>

<div class="banner">
  <b>To put pricing back on the website</b>
  Set <code>SHOW_PRICING = True</code> in <code>tools/build.py</code>, then run <code>python3 tools/build.py</code>.
  That restores the pricing page, the per-service price cards, the homepage teaser and the Offer prices in the
  structured data. The figures below are read from that same file, so they are already in place — nothing needs
  re-typing. The copy that framed the site around published pricing was rewritten when pricing came off, and would
  need revisiting.
</div>

{''.join(sections)}

<div class="rules">
  <h2>How pricing worked</h2>
  <div class="rules-grid">{billing}</div>
</div>

</body>
</html>
"""
    os.makedirs(os.path.join(ROOT, "dist"), exist_ok=True)
    out = os.path.join(ROOT, "dist", "pricing-archive.html")
    open(out, "w", encoding="utf-8").write(doc)
    tiers = sum(len(s["prices"]) for s in SERVICES)
    print(f"wrote dist/pricing-archive.html — {len(SERVICES)} services, {tiers} tiers")


if __name__ == "__main__":
    main()
