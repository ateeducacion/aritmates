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

## Pruebas

```bash
npm test          # suite estable
npm run test:all  # incluye tests legacy (pueden fallar)
```

## Documentación de la simplificación

- [docs/SIMPLIFICACION.md](./docs/SIMPLIFICACION.md)
- [docs/COMPONENTES.md](./docs/COMPONENTES.md)
