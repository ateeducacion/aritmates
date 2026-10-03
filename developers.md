# Guía de desarrollo

La documentación principal está en el [README](./README.md) y en  
[docs/SIMPLIFICACION.md](./docs/SIMPLIFICACION.md).

## Entorno

```bash
git clone https://github.com/ateeducacion/aritmates.git
cd aritmates
npm ci
npm run dev
```

Abre http://127.0.0.1:9012/

## Producción

```bash
npm run build
# publicar la carpeta dist/
```

## Configuración

Opciones por defecto y URL de backend (si aplica): `src/config.json`  
(se copia a `dist/config.json` en el build).

Use en `baseurl` la URL pública de **su** despliegue, no valores de entornos  
internos de desarrollo.

La vista previa al compartir un enlace (WhatsApp, Telegram, redes sociales) necesita
URLs absolutas. El build las toma de `homepage` en `package.json`; en otro despliegue:
`SITE_URL=https://example.org/aritmates/ npm run build`. La imagen `src/img/og-image.jpg`
(1200x630) se regenera con `npm run build && node scripts/make-og-image.mjs`.

## Pruebas

```bash
npm test
npm run lint
npm run e2e
```

Node 24 o superior. El detalle está en [docs/TESTING.md](./docs/TESTING.md).

## Agentes

Quien modifica el repositorio sigue [AGENTS.md](./AGENTS.md): reglas del motor, comandos y actualización de los skills.

## Documentación de la simplificación

- [docs/SIMPLIFICACION.md](./docs/SIMPLIFICACION.md)
- [docs/COMPONENTES.md](./docs/COMPONENTES.md)
