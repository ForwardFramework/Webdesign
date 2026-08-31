# Fonts

Barlow and Barlow Condensed, latin subset, self-hosted as WOFF2 (~153 KB total).

Both are licensed under the [SIL Open Font License 1.1](https://openfontlicense.org/),
which permits redistribution and self-hosting. Source: <https://fonts.google.com/specimen/Barlow>.

Self-hosting instead of linking `fonts.googleapis.com` removes a render-blocking
third-party request and a DNS/TLS round trip on first paint. `@font-face` rules live
in `assets/css/fonts.css`; the two faces used above the fold are preloaded in `index.html`.
