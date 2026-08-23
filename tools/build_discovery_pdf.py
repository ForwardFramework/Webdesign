#!/usr/bin/env python3
"""
Produce the printable discovery questionnaire — the version you work through in
a meeting or send as an attachment.

    python3 tools/build_discovery_pdf.py    -> dist/discovery-questionnaire.html

Then render it to PDF (Chromium, A4, background graphics on):

    node -e "const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
    const p=await b.newPage();await p.goto('file://$PWD/dist/discovery-questionnaire.html',
    {waitUntil:'networkidle'});await p.pdf({path:'dist/Forward-Framework-Discovery-Questionnaire.pdf',
    format:'A4',printBackground:true});await b.close();})()"

Reads DISCOVERY, SERVICE_DISCOVERY and DISCOVERY_ABOUT_YOU from tools/build.py —
the same data the web questionnaires render from, so the printed copy and the
online one can never ask different questions.

Print uses the brand's cream surface rather than its ink one. Same palette,
same type, but readable on paper and not a toner crime.
"""

import html
import os
import sys
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
from build import (  # noqa: E402  (same source of truth as the site)
    DISCOVERY, DISCOVERY_ABOUT_YOU, SERVICE_DISCOVERY, SERVICES,
)

TODAY = date.today().strftime("%d %B %Y")


def esc(t):
    return html.escape(str(t))


def answer_space(q):
    """Somewhere to actually write. Sized to the kind of answer expected."""
    t = q["type"]
    if t in ("radio", "check"):
        shape = "circle" if t == "radio" else "square"
        return ('<div class="opts">' + "".join(
            f'<span class="opt"><i class="{shape}"></i>{esc(o)}</span>'
            for o in q["options"]) + "</div>")
    if t == "select":
        return ('<div class="opts">' + "".join(
            f'<span class="opt"><i class="circle"></i>{esc(o)}</span>'
            for o in q["options"]) + "</div>")
    if t == "textarea":
        return '<div class="lines">' + '<span class="line"></span>' * 3 + "</div>"
    if t == "number":
        affix = q.get("prefix", "") or q.get("suffix", "")
        return f'<div class="lines short">{esc(affix)}<span class="line"></span></div>'
    return '<div class="lines"><span class="line"></span></div>'


def question(q, n):
    req = '<span class="req">required</span>' if q.get("required") else ""
    hint = f'<p class="hint">{esc(q["hint"])}</p>' if q.get("hint") else ""
    return f"""
      <div class="q">
        <p class="qlabel"><span class="qnum">{n}</span>{esc(q["label"])}{req}</p>
        {hint}
        {answer_space(q)}
      </div>"""


def section(sec, running):
    qs = ""
    for q in sec["questions"]:
        running[0] += 1
        qs += question(q, running[0])
    return f"""
    <section class="sec">
      <div class="sec-head">
        <span class="sec-n">{esc(sec["n"])}</span>
        <div>
          <h3>{esc(sec["title"])}</h3>
          <p class="sec-lede">{esc(sec["lede"])}</p>
        </div>
      </div>
      <p class="why"><b>Why we ask.</b> {esc(sec["why"])}</p>
      {qs}
    </section>"""


def questionnaire(title, kicker, blurb, sections, first=False):
    running = [0]
    secs = "".join(section(s, running) for s in sections)
    cls = "sheet" if first else "sheet break"
    return f"""
  <div class="{cls}">
    <div class="q-head">
      <span class="kicker">{esc(kicker)}</span>
      <h2>{esc(title)}</h2>
      <p class="q-blurb">{esc(blurb)}</p>
      <p class="meta">{sum(len(s['questions']) for s in sections)} questions
        &middot; {len(sections)} sections &middot; answers to hello@forward-framework.com or (412) 463-2126</p>
    </div>
    {secs}
  </div>"""


def main():
    master = questionnaire(
        "Discovery questionnaire",
        "Every service · start here",
        "The full picture. Answer this one if you are not sure which service you need — it tells us "
        "which is worth doing first, and what it is worth.",
        DISCOVERY, first=False)

    per_service = ""
    for svc in SERVICES:
        cfg = SERVICE_DISCOVERY[svc["slug"]]
        per_service += questionnaire(
            f"{svc['nav']} questionnaire",
            f"Service deep-dive · ends with {cfg['hook']}",
            cfg["lede"],
            cfg["sections"] + [DISCOVERY_ABOUT_YOU])

    total_q = (sum(len(s["questions"]) for s in DISCOVERY)
               + sum(sum(len(s["questions"]) for s in SERVICE_DISCOVERY[v["slug"]]["sections"])
                     + len(DISCOVERY_ABOUT_YOU["questions"]) for v in SERVICES))

    contents = "".join(
        f'<li><b>{i + 2:02d}</b><div>{esc(v["nav"])} questionnaire'
        f'<span>Ends with {esc(SERVICE_DISCOVERY[v["slug"]]["hook"])}</span></div></li>'
        for i, v in enumerate(SERVICES))

    doc = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Forward Framework — Discovery Questionnaire</title>
<style>
  @page {{ size: A4; margin: 16mm 15mm 14mm; }}
  :root {{
    --ink:#171512; --ink-soft:#4A443D; --muted:#6B5E52; --taupe:#A99A8C;
    --bone:#EFEBE6; --line:rgba(23,21,18,.16); --rule:rgba(23,21,18,.32);
    --f-display:"Jost","Futura","Century Gothic",-apple-system,"Segoe UI",sans-serif;
    --f-body:"Inter",-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  }}
  *{{box-sizing:border-box}}
  body{{
    margin:0;background:#fff;color:var(--ink);
    font-family:var(--f-body);font-size:9.6pt;line-height:1.5;
    -webkit-print-color-adjust:exact;print-color-adjust:exact
  }}
  h1,h2,h3{{font-family:var(--f-display);font-weight:400;letter-spacing:-.01em;margin:0}}
  .break{{break-before:page}}
  .sheet{{padding-top:2mm}}

  /* Cover */
  .cover{{
    min-height:245mm;display:flex;flex-direction:column;justify-content:space-between;
    background:var(--bone);margin:-16mm -15mm 0;padding:24mm 18mm 16mm
  }}
  .mark{{display:flex;align-items:center;gap:10px}}
  .mark .ff{{
    width:34px;height:34px;border:1.5px solid var(--ink);display:grid;place-items:center;
    font-family:var(--f-display);font-size:16pt;letter-spacing:-.06em;line-height:1
  }}
  .mark .wordmark{{font-family:var(--f-display);font-size:12pt;letter-spacing:.26em;line-height:1.2}}
  .mark .wordmark small{{display:block;font-size:6.6pt;letter-spacing:.34em;color:var(--muted)}}
  .cover h1{{font-size:34pt;line-height:1.06;max-width:15ch;margin:0 0 6mm}}
  .cover .lede{{font-size:11.5pt;line-height:1.6;max-width:62ch;color:var(--ink-soft)}}
  .cover .how{{
    margin-top:9mm;display:grid;grid-template-columns:repeat(3,1fr);gap:6mm;
    border-top:1px solid var(--line);padding-top:6mm
  }}
  .cover .how h4{{font-family:var(--f-display);font-size:8pt;letter-spacing:.16em;
    text-transform:uppercase;color:var(--taupe);margin:0 0 2mm}}
  .cover .how p{{margin:0;font-size:9pt;color:var(--ink-soft);line-height:1.55}}
  .toc{{list-style:none;margin:9mm 0 0;padding:0;columns:2;column-gap:10mm}}
  .toc li{{
    break-inside:avoid;display:grid;grid-template-columns:7mm 1fr;gap:3mm;
    padding:2.4mm 0;border-top:1px solid var(--line);font-size:9pt;align-items:baseline
  }}
  .toc b{{font-family:var(--f-display);font-weight:300;color:var(--taupe)}}
  .toc span{{display:block;font-size:8pt;color:var(--muted)}}
  .cover-foot{{
    display:flex;justify-content:space-between;gap:8mm;flex-wrap:wrap;
    border-top:1px solid var(--line);padding-top:5mm;font-size:8.4pt;color:var(--muted)
  }}

  /* Questionnaire heads */
  .q-head{{border-bottom:2px solid var(--ink);padding-bottom:4mm;margin-bottom:7mm}}
  .kicker{{
    font-family:var(--f-display);font-size:7.6pt;letter-spacing:.2em;text-transform:uppercase;
    color:var(--taupe);display:block;margin-bottom:2mm
  }}
  .q-head h2{{font-size:21pt;line-height:1.1;margin-bottom:2.5mm}}
  .q-blurb{{margin:0 0 2mm;color:var(--ink-soft);max-width:70ch}}
  .meta{{margin:0;font-size:8pt;color:var(--muted)}}

  /* Sections */
  .sec{{break-inside:auto;margin-bottom:7mm}}
  .sec-head{{
    display:grid;grid-template-columns:auto 1fr;gap:5mm;align-items:baseline;
    border-top:1px solid var(--rule);padding-top:3.5mm;margin-bottom:2.5mm;break-after:avoid
  }}
  .sec-n{{font-family:var(--f-display);font-size:17pt;font-weight:300;color:var(--taupe);line-height:1}}
  .sec-head h3{{font-size:13pt}}
  .sec-lede{{margin:.5mm 0 0;font-size:8.8pt;color:var(--muted)}}
  .why{{
    border-left:2px solid var(--taupe);padding:1mm 0 1mm 4mm;margin:0 0 5mm;
    font-size:8.8pt;color:var(--ink-soft);break-after:avoid
  }}
  .why b{{font-weight:600}}

  /* Questions */
  .q{{break-inside:avoid;margin-bottom:4.5mm}}
  .qlabel{{margin:0 0 1.6mm;font-size:9.6pt;font-weight:500}}
  .qnum{{
    display:inline-block;min-width:7mm;font-family:var(--f-display);font-weight:300;
    color:var(--taupe)
  }}
  .req{{
    margin-left:2mm;font-family:var(--f-display);font-size:6.8pt;letter-spacing:.14em;
    text-transform:uppercase;color:var(--taupe);border:1px solid var(--line);padding:.3mm 1.4mm
  }}
  .hint{{margin:-.8mm 0 1.6mm 7mm;font-size:8.2pt;color:var(--muted)}}
  .lines{{margin-left:7mm}}
  .lines.short{{display:flex;align-items:flex-end;gap:2mm;max-width:60mm;color:var(--muted);font-size:9pt}}
  .lines.short .line{{flex:1}}
  .line{{display:block;height:6.4mm;border-bottom:1px solid var(--line)}}
  .opts{{margin-left:7mm;display:flex;flex-wrap:wrap;gap:1.6mm 5mm}}
  .opt{{display:inline-flex;align-items:center;gap:2mm;font-size:9pt;color:var(--ink-soft)}}
  .opt i{{
    display:inline-block;width:3.4mm;height:3.4mm;border:1px solid var(--rule);flex:none
  }}
  .opt i.circle{{border-radius:50%}}
</style>
</head>
<body>

<div class="cover">
  <div>
    <div class="mark">
      <span class="ff">FF</span>
      <span class="wordmark">FORWARD<small>FRAMEWORK</small></span>
    </div>
  </div>
  <div>
    <h1>Twenty minutes here saves us both a month of guessing.</h1>
    <p class="lede">This is every question we would ask you on a discovery call, written down. Answer
      the first questionnaire if you are not yet sure which service you need — it covers all seven and
      tells us which is worth doing first. Answer a service questionnaire instead if you already know,
      and it ends with that service's free deliverable.</p>
    <div class="how">
      <div>
        <h4>Fill in what you know</h4>
        <p>Skip anything you don't. A blank is information too — it usually tells us where nobody is
          currently looking.</p>
      </div>
      <div>
        <h4>Estimates are fine</h4>
        <p>Nothing here is audited. Order of magnitude beats precision, and beats a blank by a mile.</p>
      </div>
      <div>
        <h4>You get a written plan back</h4>
        <p>Where the money is leaking, what we would fix first, what it costs, and what we would leave
          alone. Within two business days, no obligation.</p>
      </div>
    </div>
    <ol class="toc">
      <li><b>01</b><div>Discovery questionnaire<span>All seven services — start here if unsure</span></div></li>
      {contents}
    </ol>
  </div>
  <div class="cover-foot">
    <span>Forward Framework &middot; hello@forward-framework.com &middot; (412) 463-2126</span>
    <span>{total_q} questions across {len(SERVICES) + 1} questionnaires &middot; {TODAY}</span>
  </div>
</div>

{master}
{per_service}

</body>
</html>
"""
    os.makedirs(os.path.join(ROOT, "dist"), exist_ok=True)
    out = os.path.join(ROOT, "dist", "discovery-questionnaire.html")
    open(out, "w", encoding="utf-8").write(doc)
    print(f"wrote dist/discovery-questionnaire.html — "
          f"{len(SERVICES) + 1} questionnaires, {total_q} questions")


if __name__ == "__main__":
    main()
