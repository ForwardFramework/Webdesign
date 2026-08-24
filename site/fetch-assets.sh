#!/usr/bin/env bash
# Downloads the site photography and writes the optimized .webp files that the
# pages reference. Run once after cloning:
#
#     cd site && ./fetch-assets.sh
#
# Needs curl, plus ImageMagick (`magick`/`convert`) or `cwebp` for the webp
# encode. If neither encoder is present the script keeps the PNGs and rewrites
# the pages to point at them, so the site still works either way.
set -euo pipefail
cd "$(dirname "$0")"

BASE="https://d8j0ntlcm91z4.cloudfront.net/user_3IL9tsARcNNDKmHrDHi3CGZRiYg"
OUT="assets/img"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$OUT"

# name|source file|resize width|quality
ASSETS=(
  "hero-driveway|hf_20260824_141808_462eec63-7a16-4b57-a4f7-80b3cc29512f.png|1500|72"
  "aerial-split|hf_20260824_141807_c9fa7831-feea-469d-b3a9-bd681c9fcb17.png|1280|70"
  "pittsburgh|hf_20260824_141807_034b70d0-6609-4a7e-ae62-431089ba29e4.png|1400|70"
  "neighborhood|hf_20260824_141914_4a45e9ad-2917-4021-af58-536e8d715b5c.png|1400|70"
  "equipment|hf_20260824_141807_f0b42444-53dc-4c83-8c61-532cc212c997.png|1100|70"
  "owner|hf_20260824_141808_a17a8d6c-af9a-424b-bce3-6811d5a1fea0.png|820|74"
  "svc-concrete|hf_20260824_141807_0e74599a-b171-4d2a-8545-a460d02b6938.png|1100|70"
  "svc-house|hf_20260824_141807_b3ef9f90-07e0-466d-8a59-3904b6593784.png|1100|70"
  "svc-deck|hf_20260824_141807_6cd7887c-7585-4ceb-8d28-a2d1fa6047c6.png|1100|70"
  "svc-commercial|hf_20260824_141807_0959f5ce-7d8d-4c33-9842-571c87f80550.png|1100|70"
  "svc-roof|hf_20260824_141914_604def94-98fd-40a2-93b0-a1ee7c59ebe9.png|1100|70"
  "svc-pavers|hf_20260824_141807_225e2fe2-60bf-4ff1-b493-852c7ad365c2.png|1100|70"
  "svc-fence|hf_20260824_141914_a3d7d301-db1a-4337-95dc-038188dd5193.png|1100|70"
)

# Pick an encoder.
ENCODER=""
if command -v magick >/dev/null 2>&1; then ENCODER="magick"
elif command -v convert >/dev/null 2>&1; then ENCODER="convert"
elif command -v cwebp >/dev/null 2>&1; then ENCODER="cwebp"
fi

if [ -z "$ENCODER" ]; then
  echo "!! No ImageMagick or cwebp found — keeping PNGs and repointing the pages."
  echo "   Install one of them and re-run for much smaller files."
fi

resize_to_webp() {   # <src png> <dest webp> <width> <quality>
  case "$ENCODER" in
    magick)  magick "$1" -resize "$3x" -strip -quality "$4" -define webp:method=6 "$2" ;;
    convert) convert "$1" -resize "$3x" -strip -quality "$4" -define webp:method=6 "$2" ;;
    cwebp)   cwebp -quiet -resize "$3" 0 -q "$4" -m 6 "$1" -o "$2" ;;
  esac
}

echo "Fetching site photography…"
for row in "${ASSETS[@]}"; do
  IFS='|' read -r name src width quality <<< "$row"
  printf '  %-16s' "$name"
  curl -sfL -o "$TMP/$name.png" "$BASE/$src" || { echo "FAILED to download"; exit 1; }
  if [ -n "$ENCODER" ]; then
    resize_to_webp "$TMP/$name.png" "$OUT/$name.webp" "$width" "$quality"
    printf 'ok (%s)\n' "$(du -h "$OUT/$name.webp" | cut -f1)"
  else
    cp "$TMP/$name.png" "$OUT/$name.png"
    printf 'ok (png)\n'
  fi
done

# Social share card, cropped to 1200x630.
printf '  %-16s' "og-image"
if [ "$ENCODER" = "magick" ] || [ "$ENCODER" = "convert" ]; then
  "$ENCODER" "$TMP/hero-driveway.png" -resize '1200x630^' -gravity center -extent 1200x630 \
    -strip -quality 76 -define webp:method=6 "$OUT/og-image.webp"
  printf 'ok (%s)\n' "$(du -h "$OUT/og-image.webp" | cut -f1)"
elif [ "$ENCODER" = "cwebp" ]; then
  cwebp -quiet -resize 1200 630 -q 76 -m 6 "$TMP/hero-driveway.png" -o "$OUT/og-image.webp"
  printf 'ok\n'
else
  cp "$TMP/hero-driveway.png" "$OUT/og-image.png"
  printf 'ok (png)\n'
fi

# Without an encoder the pages need to point at .png instead of .webp.
if [ -z "$ENCODER" ]; then
  echo "Repointing pages to .png…"
  for f in *.html _partials/*.html assets/css/style.css; do
    [ -f "$f" ] && sed -i.bak 's|\(assets/img/[a-z0-9-]*\)\.webp|\1.png|g' "$f" && rm -f "$f.bak"
  done
fi

echo
echo "Done. Open index.html, or serve it with:  python3 -m http.server 8000"
