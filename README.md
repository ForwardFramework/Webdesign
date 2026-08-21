# Webdesign

Design tooling for Claude Code: the vendored [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
skills plus the [21st.dev](https://21st.dev) MCP server.

## Skills

`.claude/skills/` holds seven vendored skills (`ui-ux-pro-max`, `ui-styling`, `design`,
`design-system`, `brand`, `banner-design`, `slides`). They auto-activate on UI/UX work and
need only Python 3.x. See [.claude/skills/VENDORED.md](.claude/skills/VENDORED.md) for the
upstream version and update procedure.

## 21st.dev MCP server

`.mcp.json` registers the `21st` HTTP MCP server at project scope, so anyone working in this
repo is offered the server on their first session here.

The API key is **not** stored in the repo. The config reads it from the environment via
`${API_KEY_21ST}`, which is the same variable the official
[21st plugin](https://github.com/21st-dev/claude-code-plugin) uses, so one export serves both.

### Setup

```bash
# Get a key at https://21st.dev/settings/api-keys
export API_KEY_21ST="21st_sk_..."   # add to ~/.zshrc, ~/.bashrc, or a gitignored .env
claude                              # approve the project MCP server when prompted
```

Verify with `claude mcp list` (or `/mcp` inside a session); `21st` should report connected.

### Alternatives

Register the server privately instead of via `.mcp.json`:

```bash
claude mcp add --transport http 21st https://21st.dev/api/mcp \
  --header "x-api-key: $API_KEY_21ST"
```

Or install the official plugin, which bundles the same MCP server with the 21st CLI skills:

```
/plugin marketplace add 21st-dev/claude-code-plugin
/plugin install 21st@21st
```

### Troubleshooting `Needs authentication`

Claude Code reports `Needs authentication` for both of the ways this server can fail, and
they need different fixes. Check them in this order.

**1. `API_KEY_21ST` is not exported.** `.mcp.json` substitutes the variable from the
environment Claude Code was launched in, so a key set only in a shell you started *after*
Claude — or in a `.env` file nothing sources — does not reach it:

```bash
printenv API_KEY_21ST     # empty output means the header goes out unset
```

Export it in your shell profile and restart Claude Code so the new environment is inherited.

**2. `21st.dev:443` is not reachable.** In sandboxed, proxied, or allowlisted environments
the connection is refused before the key is ever checked, so a valid key still reports as an
auth failure:

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://21st.dev/api/mcp
```

`CONNECT tunnel failed, response 403` is an egress denial, not a bad key — add `21st.dev` to
the allowlist. On Claude Code on the web, this is the environment's network policy
([docs](https://code.claude.com/docs/en/claude-code-on-the-web)), where
`curl -sS "$HTTPS_PROXY/__agentproxy/status"` lists recent denied hosts under
`recentRelayFailures`.

A `401`/`403` **in the HTTP response body** (rather than at the CONNECT stage) is the real
bad-key case — regenerate the key at <https://21st.dev/settings/api-keys>.
