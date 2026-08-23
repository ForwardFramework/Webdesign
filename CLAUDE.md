# Working in this repository

## Deployment policy

**Netlify is the live host. Every website change ships there.**

The flow is: commit → push to `main` → Netlify (or
`.github/workflows/netlify.yml`) builds and deploys to production automatically.

`main` is the production branch. `claude/forward-framework-website-qwe3cg` is
kept as a working branch and carries the same history — push both so they never
drift.

So the rule for any change to the site: **rebuild the bundles, commit, and push.**
The push is the deploy. Do not leave site changes uncommitted.

```bash
python3 tools/build.py            # regenerate pages after content edits
python3 tools/build_netlify.py    # the live bundle
git add -A && git commit -m "…"
git push -u origin main
git push -u origin HEAD:claude/forward-framework-website-qwe3cg   # keep in sync
```

Vercel, Cloudflare Pages and GitHub Pages configs are kept in the repo as
alternatives but are **not** the live host. Their workflows are manual-only
(`workflow_dispatch`) so they do not deploy or report failures on push.

### Netlify cannot be deployed to from a Claude Code session

`api.netlify.com` is not reachable from the sandbox, so a deploy cannot be run
directly even with a token. The GitHub Actions workflow is the mechanism. It
needs two repository secrets, set once by a human:

| Secret | Where |
|---|---|
| `NETLIFY_AUTH_TOKEN` | Netlify → User settings → Applications → Personal access tokens |
| `NETLIFY_SITE_ID` | Project configuration → General → Project details → Project ID |

Until both exist the workflow builds and uploads an artifact but skips the
deploy, so pushes are safe — they simply are not live yet.

## Where enquiries go

Every form on the site is a Netlify Form, and everything routes to
**hello@forward-framework.com** — there is no second address.

Each form carries `name`, `data-netlify="true"`, a hidden `form-name`,
`data-netlify-honeypot="company_website_hp"` and `action="/thank-you.html"` as
the no-JavaScript fallback. `main.js` posts them in the background so the
visitor keeps the inline success state, and falls back to a normal submit if
that request fails, so an enquiry is never silently lost.

**Two dashboard steps are required, once, and neither is in the repo:**

1. **Project configuration → Forms → Enable form detection.** Netlify does not
   parse forms by default any more. Until this is on, every submission is
   refused with an empty 405 — which is what a blank white page after submit
   means.
2. **Deploy again afterwards.** Detection runs at deploy time, so the setting
   does nothing to the deploy already live.
3. **Forms → Form notifications → add an email notification** to
   hello@forward-framework.com. Netlify stores submissions without it, but
   nobody is emailed.

If a submission is refused, `main.js` keeps what the visitor typed on screen and
offers the address and phone instead, with their answers prefilled into a
mailto. Never replace that with `form.submit()` — a native POST to a host that
is not handling the form returns an empty 405 and the visitor loses everything.

Attribution (UTM parameters, gclid, landing page, referrer) rides along in
hidden inputs. Those inputs must stay in the markup — Netlify only records
fields it saw in the deployed HTML, so adding them from JavaScript would not work.

## After a form is submitted

Every form now navigates to `/thank-you`, which is a full landing page rather
than a receipt: what happens next, the twenty-minute walkthrough ask, and all
seven free deliverables. `main.js` appends `?need=<service-slug>` so the offer
the visitor asked for leads the grid — derived from `primary_need` on the
homepage form, or from the service page they submitted on.

The inline `.form-success` panels were removed when this landed. Do not
reintroduce them: two confirmations for one submission is worse than one, and
the landing page is where the next conversion happens.

**`BOOKING_URL` in `tools/build.py` is empty.** While it is, the primary action
on that page is the phone number, which is real. Set it to a Calendly (or
similar) link and "Book my 20 minutes" becomes the primary button in both
places, with the phone as the fallback. Rebuild after changing it.

## The questionnaires

`DISCOVERY`, `SERVICE_DISCOVERY` and `DISCOVERY_ABOUT_YOU` in `tools/build.py`
are the only place the questions live. Three things render from them:

- `/discovery/` — the full intake, six steps, every service
- `/discovery/<slug>` — one per service, deeper and shorter
- `tools/build_discovery_pdf.py` → `dist/discovery-questionnaire.html`, rendered
  to PDF for meetings and attachments

Edit the data, never the output, or the printed copy starts asking different
questions from the online one.

`/discovery/` is a directory index, like `/services/`. Do not add a
`discovery.html` beside it — a file and a directory of the same name make
`/discovery` ambiguous and the host serves neither.

The hours running total on section 04 multiplies the visitor's own figures by
fifty weeks. It is not a savings claim and must not be dressed up as one.

## The questionnaire email

`netlify/functions/submission-created.js` runs after every verified form
submission and emails that person a link to the questionnaire, prefilled with
what they just told us. It skips questionnaire submissions so nobody is sent
the thing they just finished.

It needs one environment variable, set in **Project configuration → Environment
variables**:

| Variable | Notes |
|---|---|
| `RESEND_API_KEY` | resend.com key on a verified sending domain |
| `MAIL_FROM` | optional, defaults to hello@forward-framework.com |

**Without the key it logs what it would have sent and returns 200.** Never make
it throw — the submission is already stored, and failing here would show the
visitor an error for something unrelated to them.

**Functions only deploy from Git or the CLI.** A drag-and-dropped zip does not
carry them, so this feature does nothing until the repo is connected in Netlify.

## Carrying answers between forms

`CARRY` in `main.js` lists the fields the lead forms and questionnaires share.
On submit they go to `localStorage`; on a questionnaire they are read back from
storage or from query parameters (how the email link carries them), the fields
are marked "already answered", and the parameters are then stripped from the
address bar. Nobody is asked the same question twice.

Keep the field `name` attributes identical across forms or this silently stops
working.

## Regenerating the fillable PDF

`assets/docs/discovery-questionnaire.pdf` is a build product committed on
purpose — the Netlify build runs Python only and cannot rebuild it. After
changing any question:

```bash
python3 tools/build_discovery_pdf.py   # writes dist/discovery-questions.json
cd tools && npm install                # once, for pdf-lib
node tools/build_fillable_pdf.mjs      # rewrites the committed PDF
```

## Domain

`www.forward-framework.com`, registered at GoDaddy, DNS stays at GoDaddy.
Two records point it at Netlify: `A @ -> 75.2.60.5` and
`CNAME www -> <site>.netlify.app`. The nameservers are deliberately **not**
moved to Netlify, because that would move the MX records that deliver
hello@forward-framework.com. See DEPLOY.md for the full procedure.

## Before changing site content

`index.html` is hand-authored and is the source of truth for the site shell
(header, nav, footer, mobile CTA). `tools/build.py` extracts that shell and
stamps it onto every other page. Edit `index.html` for shell changes and
`tools/build.py` for service copy and pricing, then rebuild.

## Pricing is currently withheld

Prices were removed from the public site. The figures still live in each
service's `prices` list in `tools/build.py` and are gated by `SHOW_PRICING`.

- To restore pricing: set `SHOW_PRICING = True` and run `python3 tools/build.py`.
  That brings back the pricing page, the per-service price cards, the homepage
  teaser and the `Offer` prices in the structured data.
- The copy that framed the site around published pricing was rewritten when
  pricing came off (the "our prices are on the website" section, the FAQ
  answers that quoted figures, the About page's transparency claim). Restoring
  the flag does not restore that copy — it would need revisiting.
- `python3 tools/build_pricing_pdf.py` regenerates the archive from the same
  data, so it can never disagree with what the site would publish.

## SEO / AEO / GEO notes

- **`og:image` must stay a PNG.** Facebook, LinkedIn and X ignore an SVG
  og:image and show no card at all. `assets/img/og-image.svg` is the source;
  `og-image.png` is what the meta tags point at. Re-render after editing the
  SVG. Its text uses `textLength`/`lengthAdjust` because the brand faces are
  webfonts — without that the subtitle runs off the edge wherever Jost is
  missing, which is most renderers.
- **Titles ≤ 60 characters, descriptions 110–165.** Both are checked by eye
  easily; anything outside gets truncated or rewritten by Google.
- **One heading level at a time.** No h1 → h3. Footer column labels are
  `<p class="footer-col-h">` inside a labelled `<nav>` for exactly this reason —
  they label navigation, not document sections.
- **`evidence()` blocks need a verified source.** Sourced statistics are one of
  the few things shown to raise the odds of being quoted by an AI assistant.
  That only holds while the citation is real — never add one without checking
  the study.
- **Facebook is the only real social profile.** LinkedIn, Instagram and YouTube
  were placeholder handles and have been removed from the footer and from
  `sameAs`. Do not add a profile back until the channel exists — `sameAs` is a
  claim that the account is ours, and a dead one weakens entity resolution
  rather than helping it.
- **robots.txt allows every AI crawler on purpose.** Blocking training crawlers
  also costs citations from the retrieval crawlers on several platforms.
- **`llms.txt` stays, but expect little from it.** Google confirmed in May 2026
  that it ignores the file entirely. It costs nothing and is read by agentic
  tools, so it is worth keeping and not worth optimising.
- **FAQPage schema no longer produces rich results** (Google retired them in
  May 2026) but is still valid and still read by AI systems. Keep the existing
  markup; there is no reason to add more of it for new pages.
- `build.py` refreshes `index.html`'s JSON-LD `dateModified` on every build so
  the hand-authored homepage does not freeze while generated pages move.

## Invariants worth not breaking

- **FAQ schema must match the visible copy word for word.** Every FAQ answer
  appears twice — in the page and in `FAQPage` JSON-LD. Keep one source and
  render both from it.
- **One `<h1>` per page.**
- **No `AggregateRating` or `Review` schema** until real, verifiable reviews
  exist. Invented ratings risk a Google manual action.
- **Scroll reveals are progressive enhancement.** All content must render with
  JavaScript disabled — AI crawlers often do not execute it.
- **The absolute domain lives in one place.** Change it with
  `tools/set_domain.py`, never by hand; it also moves the email addresses.
- **The phone number likewise.** `tools/set_phone.py` updates the `tel:` links,
  the visible text and the JSON-LD `telephone` field together — editing one
  shape by hand leaves a dead click-to-call on mobile.
- **Asset caching stays short.** `styles.css` and `main.js` are not
  fingerprinted, so a long cache serves stale CSS after a deploy.

## Verifying a change

```bash
python3 -m http.server 8000     # then load the site
```

Check before pushing: one `<h1>` per page, JSON-LD parses, FAQ answers still
match their schema, no horizontal scroll at 390 / 768 / 1440px, no JS errors.
