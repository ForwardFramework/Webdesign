# Top Dog Exteriors — website

Source for **[topdogexteriors.com](https://topdogexteriors.com)**, the marketing and
lead-generation site for Top Dog Exteriors, a veteran-owned exterior contractor in Bethel
Park, PA serving the Greater Pittsburgh area.

The site lives in **[`site/`](site/)** — start with [`site/README.md`](site/README.md).

```bash
cd site
npm install
npm run dev      # http://localhost:4321
```

## What's here

| Path | What it is |
|---|---|
| [`site/`](site/) | The Astro site: 35 static pages, nine service landing pages, eight local landing pages, an instant roof estimator, and a lead router that emails `info@topdogexteriors.com` |
| [`site/docs/`](site/docs/) | Setup and maintenance guides — forms, the roof estimator, reviews, SEO/AEO/GEO |
| [`.claude/skills/`](.claude/skills/) | Vendored [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) design skills used to build it |
| [`.mcp.json`](.mcp.json) | Project-scoped [21st.dev](https://21st.dev) MCP server registration |

## Design tooling

`.claude/skills/` holds seven vendored skills (`ui-ux-pro-max`, `ui-styling`, `design`,
`design-system`, `brand`, `banner-design`, `slides`). They auto-activate on UI/UX work and
need only Python 3.x. See [`.claude/skills/VENDORED.md`](.claude/skills/VENDORED.md) for the
upstream version and update procedure.

### 21st.dev MCP server

`.mcp.json` registers the `21st` HTTP MCP server at project scope. The API key is **not**
stored in the repo — the config reads `${API_KEY_21ST}` from the environment, the same
variable the official [21st plugin](https://github.com/21st-dev/claude-code-plugin) uses.

```bash
export API_KEY_21ST="21st_sk_..."   # get a key at https://21st.dev/settings/api-keys
claude                              # approve the project MCP server when prompted
```

Verify with `claude mcp list` (or `/mcp` in a session). `21st.dev:443` must be reachable —
in sandboxed or proxied environments with an egress allowlist, add it, otherwise the
server registers fine but reports `Needs authentication`, which is the proxy's `403`
surfacing as an auth failure rather than a bad key.
