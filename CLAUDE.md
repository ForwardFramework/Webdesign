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

**One dashboard step is required, once:** Netlify → Forms → Form notifications →
add an email notification to hello@forward-framework.com. Netlify stores
submissions without it, but nobody is emailed.

Attribution (UTM parameters, gclid, landing page, referrer) rides along in
hidden inputs. Those inputs must stay in the markup — Netlify only records
fields it saw in the deployed HTML, so adding them from JavaScript would not work.

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
- **Asset caching stays short.** `styles.css` and `main.js` are not
  fingerprinted, so a long cache serves stale CSS after a deploy.

## Verifying a change

```bash
python3 -m http.server 8000     # then load the site
```

Check before pushing: one `<h1>` per page, JSON-LD parses, FAQ answers still
match their schema, no horizontal scroll at 390 / 768 / 1440px, no JS errors.
