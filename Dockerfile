# Aritmates served by nginx. Build dist/ first (npm run build); release.yml does it and pushes
# the image to ghcr.io/ateeducacion/aritmates on every published release.
#   docker run -p 8080:80 -e SITE_URL=https://example.org/aritmates/ ghcr.io/ateeducacion/aritmates:latest
FROM nginx:1.31-alpine
COPY dist/ /usr/share/nginx/html/
COPY docker/default.conf /etc/nginx/conf.d/default.conf
COPY docker/40-aritmates-site-url.sh /docker-entrypoint.d/
