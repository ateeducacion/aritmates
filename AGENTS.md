# Guía para agentes

Reglas para quien modifica este repositorio. Si un skill de terceros dice otra cosa, manda este archivo.

## Qué es

Aritmates es una aplicación estática de ejercicios de matemáticas (HTML, CSS y JavaScript). `main` es la versión que se mantiene. La rama `upstream` guarda el código original y solo sirve de historia.

No hay servidor de aplicación ni PHP. Node 24 o superior hace falta para desarrollar, probar y construir. En producción se publica `dist/`.

La demo está en GitHub Pages. El `baseurl` del repositorio es `./`. El workflow `pages.yml` lo reescribe al publicar. No se commitean hosts de entornos internos.

## Comportamiento que se conserva

La portada, los ejercicios generados, los códigos cortos y los resultados se quedan como están. Un cambio de ese comportamiento lleva antes un test que fije el caso actual, con `random: seededRandom(n)`.

El detalle del motor está en [docs/MATH-ENGINE.md](docs/MATH-ENGINE.md). Estas piezas se dejan como están:

- El símbolo de multiplicación es `∙`.
- Productos y divisiones van antes que sumas y restas, de izquierda a derecha.
- `indexOf(OPERACIONES.RESTA != -1)` es siempre verdadero. Corregirlo haría que el resultado compartiera el array de quien llama. El test de `10 - 3 + 2` lo fija.
- El reintento de un resultado con el signo equivocado se corta en `deep > 2`. Si se agota, `resultado` queda en `false` y el examen pide otro ejercicio. Alargar el tope cambia qué ejercicios aparecen.
- Los paréntesis y «resultado igual a» viven en el motor y en el código corto. En la portada `ENABLE.parentesis` y `ENABLE.resultadoIgualA` están apagados.
- `cantidadOperaciones` en el código corto solo acepta `0` y múltiplos de 10, de 10 a 100.
- Las divisiones no admiten operandos negativos.
- No hay flag de depuración. Para trazar un caso se usa el depurador o un log temporal que no se commitea; el motor no puede tener ramas que solo existan para depurar.
- No se añaden `it(...)` vacíos ni tests `pending` para representar ideas futuras. Un comportamiento soportado lleva una aserción; uno no soportado se documenta sin fingir cobertura.

El correo de resultados no forma parte del producto. Se quitó en 1.0.4. En `upstream` el PHP sigue, con la llamada comentada.

## Cómo está partido el código

La UI llama a la aplicación, y la aplicación llama al motor. `src/operaciones/arithmetic.js`, `expression.js`, `evaluate.js` y `random.js` no usan el DOM y se prueban en Node. Las expresiones combinadas se calculan con `evaluateArithmetic`.

Sin `random` inyectado, la generación usa `Math.random`. La suite configura `setDefaultRandom(seededRandom(1))` solo dentro del proceso de test; no toca `Math.random`. Un spec nuevo pasa su propia semilla.

jQuery, Bootstrap y los custom elements de `src/components/` se quedan: la plantilla depende de ellos. El build sigue siendo scripts de Node, Sass y esbuild.

Se queda fuera TypeScript, React, Vue, Angular, Redux, Webpack, Polymer y un backend. Una dependencia nueva tiene que quitar más complejidad de la que añade.

La cobertura se publica en Codecov y `npm run coverage:ci` la exige en el CI: un 80 % en líneas, funciones, ramas y sentencias sobre todo lo que cargan las pruebas unitarias, y un mínimo más alto en los módulos ya saneados. El detalle está en [docs/TESTING.md](docs/TESTING.md). El end-to-end son los specs de `e2e/`: los flujos críticos (`critical.spec.js`), accesibilidad, ayuda y diálogos. Importan `playwright/test`, el paquete que ya está en el proyecto. `npm run visual` genera la galería humana de `docs/visual/`. Esa galería no bloquea el CI.

El HTML de un ejercicio sale de números del motor. El parámetro `c` de la URL es un código corto, no HTML. Un sanitizador nuevo solo entra si aparece un sumidero concreto. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) lo resume en «Seguridad».

## Comandos

```bash
npm ci
npm test          # suite única
npm run lint
npm run build
npm run check
npm run e2e       # hace falta dist/ y Chromium
```

El CI (`.github/workflows/ci.yml`) ejecuta esas comprobaciones en Node 24 y falla si alguna falla. Los tests unitarios corren una sola vez, dentro de `npm run coverage:ci`.
GitHub Pages se despliega únicamente después de un CI correcto en `main`; no se debe volver a un workflow de despliegue paralelo al quality gate. Los releases ejecutan la misma validación esencial antes de publicar artefactos.
Los workflows usan mínimo privilegio: CI solo necesita `contents: read` e `id-token: write` para subir la cobertura a Codecov por OIDC; un workflow no recibe permisos de escritura salvo para la acción concreta que los requiere (release, Pages o PR automático de skills).
La configuración del repositorio debe exigir el check `CI` antes de fusionar en `main`; el workflow de Pages es una segunda barrera y no sustituye la protección de rama.

`no-unused-vars` es bloqueante en todo el repositorio. En el código legacy se permiten argumentos sin usar (el `ev` de un manejador); en `src/application/`, las reglas puras del motor, las operaciones, `src/pdfLibs.js` y E2E también los argumentos, salvo los que empiezan por `_`. No se desactiva la regla para hacer pasar un cambio; se corrige el código.

## Documentación

Código y comentarios en inglés. La documentación para personas está en español: `README.md`, `developers.md`, `changelog.md`, `docs/ARCHITECTURE.md`, `docs/MATH-ENGINE.md`, `docs/TESTING.md`, `docs/SIMPLIFICACION.md` y `docs/COMPONENTES.md`.

## Skills

`.agents/skills/` es el árbol canónico. `.claude/skills/` es una copia completa, sin enlaces simbólicos. **Esta duplicación es intencional** para dar compatibilidad a herramientas que descubren skills en rutas distintas; no se debe eliminar una copia, sustituirla por symlinks ni tratarla como código duplicado accidental. Al cambiar un skill, las dos copias quedan iguales en el mismo commit:

```bash
rsync -a --delete --exclude .DS_Store --exclude .venv .agents/skills/ .claude/skills/
```

Los skills de terceros se instalan así:

```bash
gh skill add OWNER/REPO PATH --dir .agents/skills
```

Ese comando escribe `metadata.github-repo`, `github-path`, `github-ref` y `github-tree-sha`. No se editan a mano. El origen para reinstalar está en [`.agents/upstream-skills.txt`](.agents/upstream-skills.txt). Las licencias están en [`.agents/licenses/`](.agents/licenses/). Catálogo: [`.agents/skills/README.md`](.agents/skills/README.md).

| Skill | Para qué | Origen | Licencia |
| --- | --- | --- | --- |
| `github-actions-hardening` | Workflows de Actions | [`github/awesome-copilot`](https://github.com/github/awesome-copilot) `skills/github-actions-hardening` | MIT |
| `security-audit` | Revisión de la aplicación cuando se pide una auditoría | [`cloudflare/security-audit-skill`](https://github.com/cloudflare/security-audit-skill) `skills/security-audit` | MIT |
| `playwright-cli` | Explorar la portada y depurar Playwright | [`microsoft/playwright-cli`](https://github.com/microsoft/playwright-cli) `skills/playwright-cli` | Apache-2.0 |
| `playwright-trace` | Leer una traza de un flujo que ha fallado | [`microsoft/playwright`](https://github.com/microsoft/playwright) `packages/playwright-core/src/tools/skills/playwright-trace` | Apache-2.0 |
| `test-gap-audit` | Proponer pruebas que faltan, sin editar salvo que se pida | [`github/awesome-copilot`](https://github.com/github/awesome-copilot) `skills/test-gap-audit` | MIT |

Esos skills no amplían el producto. El end-to-end del repositorio sigue siendo `npm run e2e`. No hace falta el paquete `@playwright/cli` ni reescribir los tests. Una auditoría no añade un sanitizador global si no hay un sumidero nuevo.

`test-gap-audit` sigue esta guía: la suite es `npm test`, cada spec nuevo lleva semilla, el umbral de cobertura solo cubre los módulos saneados y no se añaden `it` vacíos. `scripts/coverage_map.py` solo da pistas. Un archivo sin coincidencia de nombre no es un hueco confirmado.

`playwright-trace` lee un `.zip` con `npx playwright trace`, el paquete que ya está en el proyecto. No añade otro runner. El aviso de esa licencia está en [`.agents/licenses/microsoft-playwright-NOTICE.txt`](.agents/licenses/microsoft-playwright-NOTICE.txt).

[`.github/workflows/update-agent-skills.yml`](.github/workflows/update-agent-skills.yml) corre cada lunes a las 06:17 UTC y también a mano. Actualiza `.agents/skills` con `gh skill update --all`, copia el árbol a `.claude/skills/` y abre un pull request contra `main` en la rama `feature/update-agent-skills`. No empuja a `main`. Un pull request abierto con el token por defecto no dispara el resto de workflows. Los skills sin `metadata.github-*` los omite el actualizador. Hoy no hay skills locales.

En ese workflow las actions quedan fijadas a tag de versión: `actions/checkout@v7`, `devantler-tech/actions/update-agent-skills@v13.3.3` y `peter-evans/create-pull-request@v8`. Dependabot ya sigue el ecosistema `github-actions` cada semana. Esos tags no se sustituyen por un SHA en un cambio de paso.

## Integración

Los cambios compartidos van en una rama y un pull request. No se empuja `main` directamente y no se usa `--force`. Los mensajes de commit van en inglés, sobre un solo cambio, sin atribución de agente.
