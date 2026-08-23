# {{SITE_NAME}}

Static site deployed to Netlify. Every push to `main` triggers a rebuild and publish.

- Site source lives in `public/`
- Build settings live in `netlify.toml`
- Pull requests get their own Netlify deploy preview URL

## Local preview

```bash
netlify dev     # serves public/ with Netlify's redirects and headers applied
```

## Deploy

```bash
git add -A && git commit -m "Update site" && git push
```

Netlify picks it up from GitHub — no manual deploy step.
