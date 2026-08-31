# Design tooling (Webdesign workspace)

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

### Network requirement

`21st.dev:443` must be reachable. In sandboxed or proxied environments with an egress
allowlist, add `21st.dev` to it — otherwise the server registers fine but reports
`Needs authentication`, which is the proxy's `403` surfacing as an auth failure rather than
a bad key.
