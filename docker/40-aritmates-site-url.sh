#!/bin/sh
# Points the app at its public URL: link previews (og:url, og:image, twitter:image) in index.html
# and the share link (baseurl) in config.json.
#   SITE_URL  public URL of the app, ending in / (default: the GitHub Pages demo)
set -eu
default='https://ateeducacion.github.io/aritmates/'
root=/usr/share/nginx/html
[ -n "${SITE_URL:-}" ] || exit 0
# Only plain absolute URLs: it goes into an HTML attribute, JSON and a sed replacement.
printf '%s' "$SITE_URL" | grep -Eq '^https?://[^]["<>&|\\[:space:]]+$' || { echo "aritmates: invalid URL: $SITE_URL" >&2; exit 1; }
# Works from pristine copies so a restart with another value still finds the defaults.
for f in index.html config.json; do
  [ -f "$root/$f.orig" ] || cp "$root/$f" "$root/$f.orig"
done
sed "s|${default}|${SITE_URL}|g" "$root/index.html.orig" > "$root/index.html"
sed "s|\"baseurl\": *\"[^\"]*\"|\"baseurl\": \"${SITE_URL}\"|" "$root/config.json.orig" > "$root/config.json"
