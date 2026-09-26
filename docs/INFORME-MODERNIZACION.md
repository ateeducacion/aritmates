# Informe de modernización de Aritmates

Comparación técnica entre la versión original (rama `upstream`) y la versión mantenida (rama `main`).

| | |
|---|---|
| **Objeto** | Valorar qué ha mejorado, qué ha empeorado y qué queda pendiente tras la modernización de Aritmates. |
| **Versiones comparadas** | `upstream` (`a78fc91`, versión 1.0.5 entregada por el proveedor) y `main` (`14147f2`, versión 1.3). |
| **Fecha de las mediciones** | 26 de septiembre de 2026. |
| **Método** | Script reproducible `scripts/informe-modernizacion.mjs`. Datos en [`docs/informe/metricas.json`](informe/metricas.json). |
| **Elaborado por** | Área de Tecnología Educativa. |

## 1. Objeto

Este informe compara la aplicación original con la actual en cuatro aspectos: tamaño y rendimiento, seguridad,
pruebas y mantenibilidad. Las cifras se han medido sobre el código de cada rama y se presentan separadas de las
valoraciones. El objetivo es decidir los siguientes pasos, no justificar lo hecho, por lo que también se señalan
los puntos débiles de la versión actual.

## 2. Conclusión

**La versión actual es claramente mejor que la original en tamaño, seguridad, pruebas y facilidad de despliegue.
La principal deuda es el motor que genera los ejercicios, que conserva el diseño original.**

- Lo desplegado pasa de 24 MB a 3,1 MB. Al abrir la portada el navegador descarga 1,1 MB propios en lugar de
  2,9 MB, y ya no descarga los 30 MB de vídeos externos que cargaba la versión original.
- Desaparecen el servidor PHP, el código de envío de correo, una clave escrita en el propio código y el uso de
  `eval`.
- Se pasa de 100 dependencias a 15. El CI, que antes no ejecutaba las pruebas, bloquea ahora cualquier cambio si
  falla el lint, alguna de las 482 pruebas unitarias o de las 14 de extremo a extremo, o si la cobertura baja del
  90 %.
- El motor mantiene clases muy grandes con estado mutable y algunos comportamientos incorrectos que se han dejado
  como están para no cambiar los ejercicios que se generan (apartado 7).

> [!TIP]
> **Funciona en cualquier servidor web básico.** La aplicación son solo ficheros HTML, CSS y JavaScript: no necesita
> PHP, base de datos ni ningún programa en el servidor. Basta con copiar la carpeta `dist/` a un servidor web
> cualquiera o a GitHub Pages.

## 3. Resumen de la valoración

| Aspecto | upstream | main | Observaciones |
|---|---|---|---|
| Despliegue | Requiere PHP | Ficheros estáticos | Funciona en cualquier servidor web o en GitHub Pages. |
| Tamaño desplegado | 24 MB, 628 ficheros | 3,1 MB, 75 ficheros | 87 % menos. 10,6 MB de la original eran librerías PHP. |
| Descarga de la portada | 2,9 MB + 30 MB externos | 1,1 MB | La ayuda enlaza los vídeos en lugar de incrustarlos. |
| Dependencias | 56 + 44 | 8 + 7 | La original declaraba React y Material UI sin usarlos. |
| Seguridad | Clave en el código, `eval`, PHP | Sin servidor ni `eval` | La configuración se lee sin peticiones síncronas. |
| Pruebas | 300 (13 vacías), sin CI | 482 unitarias + 14 E2E en CI | Las de la original solo se ejecutaban a mano. |
| Cobertura | Sin medir | 94 % de líneas | El CI rechaza cambios que la bajen del 90 %. |
| Código de depuración | 589 `console.log` y 506 bloques | 0 y 0 | Contando solo código ejecutable. |
| Motor de ejercicios | 2962 líneas en una clase | 1423 en la misma clase | Más limpio, pero con el mismo diseño. |
| Interfaz | Polymer, MDC, xy-ui y React sin uso | Componentes propios y jQuery | En ambas, el formulario está duplicado para escritorio y móvil. |
| Licencia | `UNLICENSED` | AGPL-3.0 | Necesaria para publicar y reutilizar el código. |

: Tabla 1. Resumen de la comparación.

## 4. Cifras

![Figura 1. Dependencias: 56 y 44 en la versión original frente a 8 y 7 en la actual.](informe/dependencias.svg)

![Figura 2. Tamaño de lo desplegado por tipo de fichero. La original incluía 10,6 MB de PHP y 5 MB de fuentes.](informe/despliegue.svg)

![Figura 3. Lo que descarga el navegador al abrir la portada, separando lo propio de lo que llega de otras webs.](informe/carga.svg)

![Figura 4. Código propio: líneas, comentarios y código de depuración.](informe/codigo.svg)

![Figura 5. Pruebas automáticas: número de pruebas, pruebas vacías y líneas de test.](informe/pruebas.svg)

Dos cifras mejoran menos que el resto:

- **Las líneas de JavaScript propio solo bajan un 18 %** (de 12 686 a 10 406). La versión original delegaba la
  interfaz en librerías de npm, que no cuentan como código propio; la actual las sustituye por componentes propios
  y añade módulos pequeños y probados. El código muerto y el de depuración han desaparecido, pero el motor sigue
  siendo voluminoso.
- **Las fuentes de la portada siguen pesando más que en la original** (110 KB frente a 43 KB). La original no
  cargaba Roboto y usaba la fuente del sistema. La actual carga un subconjunto latino de Roboto con los tres pesos
  que usa y `font-display: swap`, así que el texto no espera a la fuente.

## 5. Mejoras aplicadas

### Despliegue y rendimiento

- Aplicación estática: sin PHP, sin Composer y sin servidor de aplicación. `npm run build` genera `dist/`.
- webpack y Babel sustituidos por esbuild y Sass: el build tarda menos de un segundo y no necesita configuración
  propia.
- jsPDF y html2canvas solo se descargan al imprimir; la portada no espera a imágenes ni librerías.
- Retirados 95 ficheros de imagen y fuente sin uso, copias de librerías que nadie cargaba, Font Awesome (se usaba
  para tres iconos) y dos hojas de estilo de MDC.
- Roboto en subconjunto latino y solo con los pesos que se usan: la portada descarga 110 KB de fuentes en lugar
  de 234 KB, y `dist/fonts` pasa de 2,2 MB a 110 KB.
- `config.json` se lee de forma asíncrona antes de arrancar y se puede seguir editando en `dist/` tras el build.

### Seguridad

- Eliminado el backend PHP (el envío de correo, que ya no se usaba, y la generación de PDF con dompdf) y, con él,
  la clave que `index.php` usaba para generar un hash diario y que estaba escrita en el repositorio.
- `eval` sustituido por un analizador aritmético propio que solo acepta operaciones; se ha comprobado que
  rechaza entradas como `alert(1)`.
- Los workflows de GitHub tienen los permisos mínimos, el CI audita las dependencias y la cobertura se sube a
  Codecov sin tokens guardados en el repositorio.

### Calidad del código

- Retirados 414 bloques de depuración, unas 600 líneas de código comentado y casi 50 métodos sin llamadas,
  verificados uno a uno.
- Extraídas del motor y de `app.js` las piezas que se pueden probar por separado: aritmética, reglas de números y
  de azar, temporizador, sesión de ejercicios y resultados.
- Eliminado el flag de depuración: con la misma configuración y semilla, el motor genera siempre lo mismo.
- ESLint rechaza variables sin usar en todo el repositorio.

### Pruebas e integración continua

- Una sola suite de 482 pruebas unitarias, sin pruebas vacías. Los ejercicios se pueden reproducir con una
  semilla, y una prueba de referencia guarda la salida del motor para 1346 combinaciones de opciones: si algo
  cambia sin querer, falla.
- Los componentes de la interfaz (casillas, interruptores, deslizadores, desplegables, paneles y diálogos) tienen
  pruebas de su comportamiento: atributos, teclado, eventos y estado accesible.
- 14 pruebas de extremo a extremo en un navegador real: el recorrido completo de un alumno, la vista previa del
  PDF, la accesibilidad, la ayuda, los diálogos y la carga de la configuración. También fallan si la página lanza
  algún error.
- Cobertura global del 94 % en líneas, 90,6 % en ramas y 96,9 % en funciones. El CI rechaza cualquier cambio que
  la baje del 90 %, y los módulos ya renovados deben superar el 98 % en líneas.
- GitHub Pages solo se actualiza si el CI ha pasado.

> [!TIP]
> **Qué es la cobertura de pruebas.** Es el porcentaje del código que llegan a ejecutar las pruebas automáticas.
> Un 94 % de líneas significa que, al pasar las pruebas, se ejecutan 94 de cada 100 líneas de la aplicación. No
> garantiza que no haya errores, pero sí que casi todo el código se ha ejercitado al menos una vez y que un cambio
> que rompa algo tiene muchas posibilidades de detectarse.

### Errores corregidos

| Error | Origen | PR |
|---|---|---|
| Sumas con «resultado igual a» incorrectas (`12 + (-18) = 30`) | Original | #127 |
| El reintento con paréntesis podía colgar la página | Original | #141 |
| Los decimales se trataban distinto en el navegador | Original | #140 |
| Aviso «no es entero» cuando sí lo era | Original | #146 |
| Los diálogos repetían acciones | Original | #137 |
| Un cero se tomaba por vacío | Original | #120, #121 |
| `debug` alteraba los ejercicios | Original | #114 |
| División inexacta dada por buena (`7 / 2 = 3`) | Original | #151 |
| Error al añadir una operación ya elegida | Original | #153 |
| No se generaba el ZIP de la versión | Proyecto | #134 |

: Tabla 2. Errores corregidos durante la modernización.

## 6. Valoración crítica de la versión original

- **Arquitectura sobredimensionada.** Una aplicación de ejercicios que funciona en el navegador dependía de PHP,
  Composer, cinco configuraciones de webpack y 100 dependencias, entre ellas React y Material UI sin usar.
- **Seguridad descuidada.** Una clave estaba escrita en el código publicado, se evaluaban expresiones con `eval` y
  seguía desplegado un script PHP de envío de correo que ya no se usaba.
- **Código de depuración mezclado con el de producción.** 589 `console.log` y 506 bloques `if (debug)`, que
  además cambiaban los ejercicios cuando se activaban, y 1450 líneas de comentario, muchas con código desactivado.
- **Pruebas que no protegían nada.** Había 300, pero 13 estaban vacías, solo se ejecutaban a mano con webpack y
  el CI se limitaba a un análisis estático de GitLab.
- **Errores visibles para el alumnado**, como las sumas incorrectas con «resultado igual a».
- **Sin licencia** (`UNLICENSED`), lo que impedía reutilizar o publicar el código.

La lógica pedagógica (niveles, tipos de número, incógnita en distintas posiciones, enfoque, múltiplos) es rica y
está pensada para el aula. La modernización la ha conservado íntegramente.

## 7. Valoración crítica de la versión actual

- **El motor no se ha rediseñado.** `OperacionMultiple.js` (1423 líneas) y `operacion.js` (1183) siguen basándose
  en clases con estado mutable y en reintentos difíciles de seguir. Se ha preferido fijar el comportamiento antes
  que cambiarlo, lo que protege a los usuarios pero mantiene algunas rarezas:
  - una división entera con operandos que no dividen exacto se sigue mostrando truncada (`7 / 2 = 3`). Ahora se
    registra como error, pero el resultado no se corrige. En 15 000 ejercicios generados por la aplicación no
    apareció ningún caso;
  - dos generadores crean unas 20 operaciones que luego se descartan en cada ejercicio. Quitarlas cambia qué
    ejercicios salen, así que se probó y se descartó.
- **`app.js` sigue teniendo 1526 líneas** con jQuery y estado global. Se han extraído piezas, pero el formulario
  duplicado para escritorio y móvil sigue ahí.
- **Dos componentes son código copiado de terceros** (el deslizador y su etiqueta, 734 líneas). Ya tienen pruebas,
  pero su mantenimiento depende de nosotros.
- **El volumen de cambios ha sido muy alto** (140 PRs), buena parte en pocos días y con ayuda de agentes de IA.
  Cada PR es pequeño y va validado, pero revisar a fondo semejante volumen es difícil.
- **Las pruebas tienen límites:** la prueba de referencia ocupa unos 590 KB, las de extremo a extremo solo se
  ejecutan en Chromium y no hay una auditoría automática de accesibilidad o rendimiento.

## 8. DAFO de la versión actual

| | Positivo | Negativo |
|---|---|---|
| **Interno** | **Fortalezas.** Estática y ligera (1,1 MB en la portada). Sin servidor ni claves en el código. CI con 482 pruebas unitarias, 14 E2E y cobertura mínima del 90 %. Licencia libre y documentación en español. | **Debilidades.** Motor heredado con estado mutable y rarezas conservadas a propósito. `app.js` de 1526 líneas con jQuery. Formulario duplicado. Componentes copiados de terceros. E2E solo en Chromium. |
| **Externo** | **Oportunidades.** La prueba de referencia permite corregir el motor de forma controlada. Podría ofrecerse como aplicación instalable sin conexión. Reutilizable por otras comunidades gracias a la licencia. | **Amenazas.** Dependencia de jQuery y Bootstrap a largo plazo. Que el ritmo de cambios asistidos por IA supere la capacidad de revisión. Conocimiento del motor concentrado en pocas personas. Cambios en Medusa Mediateca que rompan los enlaces a los vídeos. |

: Tabla 3. DAFO de la versión actual.

## 9. Propuestas

1. Corregir el motor en PRs pequeños, revisando en cada uno el cambio de la prueba de referencia; empezar por que
   una división inexacta se regenere en lugar de mostrarse truncada.
2. Unificar el formulario de escritorio y móvil en uno responsive.
3. Ejecutar las pruebas de extremo a extremo también en Firefox y WebKit.
4. Añadir una auditoría automática de accesibilidad y rendimiento (por ejemplo, Lighthouse), primero sin bloquear.
5. Reducir el ritmo de PRs para que la revisión humana siga siendo real.

<!-- salto de página -->

## Anexo A. Metodología

- **Código fuente.** Se lee de git en cada rama. Se cuentan los `.js` de `src/` sin librerías de terceros;
  `console.log`, `eval` y `if (debug)` solo en líneas que no son comentario.
- **Despliegue.** La rama `upstream` tiene su `dist/` versionado; el de `main` se construye con `npm run build`.
  Los ficheros se clasifican por extensión y el PHP cuenta como servidor.
- **Carga de la portada.** Cada `dist/` se sirve en local y sin compresión; Playwright abre la portada cinco veces
  con la caché vacía y se toma la mediana. Para `upstream` el HTML se reconstruye como lo componía su
  `index.php`. Lo que llega de otras webs (los vídeos) se cuenta aparte y varía un poco entre mediciones.
- **Límites.** Los tiempos en local no representan una red real y solo sirven para comparar. Las pruebas de
  `upstream` no se ejecutaron porque necesitan sus herramientas antiguas; se cuentan las declaradas. La cobertura
  se mide sobre el código que cargan las pruebas unitarias; `app.js` queda fuera porque se prueba de extremo a
  extremo. No se ha medido con Lighthouse.
- **Reproducción.** `node scripts/informe-modernizacion.mjs` regenera `docs/informe/`. El PDF se genera con la
  plantilla de documentos del ATE a partir de este fichero.

## Anexo B. Métricas completas

| Métrica | upstream | main |
|---|---:|---:|
| Dependencias / dependencias de desarrollo | 56 / 44 | 8 / 7 |
| Ficheros JS propios / líneas | 31 / 12 686 | 49 / 10 406 |
| Fichero más grande (líneas) | `OperacionMultiple.js` (2962) | `app.js` (1526) |
| `console.log` / bloques de depuración ejecutables | 589 / 506 | 0 / 0 |
| Usos de `eval` | 1 | 0 |
| Líneas de comentario | 1450 | 513 |
| PHP (ficheros / líneas) | 3 / 778 | 0 / 0 |
| Pruebas declaradas / vacías | 300 / 13 | 469 / 0 (455 unitarias y 14 E2E) |
| Pruebas ejecutadas en el CI | Ninguna | 482 unitarias y 14 E2E |
| Cobertura (líneas / ramas / funciones) | Sin medir | 94,4 % / 90,6 % / 96,9 % |
| Tamaño de `dist/` | 24 056 KB (628 ficheros) | 3131 KB (75 ficheros) |
| Recursos de cliente (sin PHP ni mapas de código) | 13 006 KB | 2363 KB |
| Portada: bytes propios / peticiones | 2904 KB / 45 | 1088 KB / 47 |
| Portada: bytes de otras webs / peticiones | 30 039 KB / 93 | 0 / 0 |
| Portada: evento `load` (mediana en local) | 1493 ms | 31 ms |

: Tabla 4. Métricas medidas el 26 de septiembre de 2026.
