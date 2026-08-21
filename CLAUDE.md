# Working in this repository

## Deployment policy

**Netlify is the live host. Every website change ships there.**

The flow is: commit → push to `claude/forward-framework-website-qwe3cg` →
`.github/workflows/netlify.yml` builds and deploys to production automatically.

So the rule for any change to the site: **rebuild the bundles, commit, and push.**
The push is the deploy. Do not leave site changes uncommitted.

```bash
python3 tools/build.py            # regenerate pages after content edits
python3 tools/build_netlify.py    # the live bundle
git add -A && git commit -m "…" && git push -u origin claude/forward-framework-website-qwe3cg
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
| `NETLIFY_SITE_ID` | Site configuration → General → Site details → Site ID |

Until both exist the workflow builds and uploads an artifact but skips the
deploy, so pushes are safe — they simply are not live yet.

## Before changing site content

`index.html` is hand-authored and is the source of truth for the site shell
(header, nav, footer, mobile CTA). `tools/build.py` extracts that shell and
stamps it onto every other page. Edit `index.html` for shell changes and
`tools/build.py` for service copy and pricing, then rebuild.

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
