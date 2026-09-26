# Informe de modernización de Aritmates

Qué ha cambiado entre la versión original de Aritmates (rama `upstream`) y la versión que mantenemos hoy (rama `main`).

| | |
|---|---|
| **Para qué sirve** | Ver qué ha mejorado, qué ha empeorado y qué queda pendiente tras renovar Aritmates. |
| **Versiones comparadas** | La original (`upstream`, `a78fc91`, versión 1.0.5, entregada por el proveedor) y la actual (`main`, `ae338b6`, versión 1.3). |
| **Fecha de las mediciones** | 26 de septiembre de 2026. |
| **Cómo se ha medido** | Con el script `scripts/informe-modernizacion.mjs`, que cualquiera puede volver a ejecutar. Los datos están en [`docs/informe/metricas.json`](informe/metricas.json). |
| **Elaborado por** | Área de Tecnología Educativa. |

## 1. Objeto

Este informe compara la aplicación original con la actual en cuatro aspectos: lo que pesa y lo rápido que carga, la
seguridad, las pruebas automáticas y lo fácil que es mantenerla. Las cifras se han medido sobre el código de cada
versión y se separan de las opiniones. La idea es decidir qué hacer a partir de ahora, no justificar lo hecho, así
que también se señalan los puntos débiles de la versión actual.

## 2. Conclusión

**La versión actual es claramente mejor que la original: pesa mucho menos, es más segura, está mucho mejor probada
y es más fácil de publicar. Lo que más queda por mejorar es la parte que genera los ejercicios, que sigue siendo
prácticamente la original.**

- Lo que se publica pasa de 24 MB a 3,1 MB. Al abrir la portada, el navegador descarga 1,1 MB de la aplicación en
  lugar de 2,9 MB, y deja de descargar los 30 MB de vídeos de otras webs que cargaba la versión original.
- Ya no hace falta un servidor con PHP. También desaparecen el código que enviaba correos, una clave que estaba
  escrita dentro del propio código y la función `eval`, que ejecutaba texto como si fuera código.
- Se pasa de 100 librerías de terceros a 15. Antes nadie comprobaba automáticamente si las pruebas pasaban; ahora
  GitHub impide integrar un cambio si falla alguna de las 457 pruebas, si falla alguna de las 14 pruebas en el
  navegador o si la parte del código que cubren las pruebas baja del 80 %.
- La parte que genera los ejercicios conserva su diseño original: piezas muy grandes, difíciles de seguir, y
  algunos comportamientos raros que se han dejado igual a propósito para no cambiar los ejercicios que ya se
  generan (apartado 7).

## 3. Resumen de la valoración

| Aspecto | Versión original | Versión actual | Comentario |
|---|---|---|---|
| Publicación | Necesita PHP | Ficheros estáticos | La actual funciona en cualquier servidor web o en GitHub Pages. |
| Tamaño publicado | 24 MB, 628 ficheros | 3,1 MB, 75 ficheros | 87 % menos. 10,6 MB de la original eran librerías del servidor. |
| Descarga de la portada | 2,9 MB + 30 MB de vídeos externos | 1,1 MB | La ayuda enlaza los vídeos en lugar de cargarlos dentro de la página. |
| Librerías de terceros | 56 + 44 | 8 + 7 | La original incluía React y Material UI sin usarlos. |
| Seguridad | Clave en el código, `eval`, servidor PHP | Nada de eso | La configuración se lee sin bloquear la página. |
| Pruebas automáticas | 300, 13 vacías, sin comprobación automática | 457 + 14 en el navegador | Las de la original solo podían ejecutarse a mano, con herramientas antiguas. |
| Cobertura de pruebas | Sin medir | 86 % | GitHub rechaza cambios que la bajen del 80 %. |
| Restos de depuración | 589 mensajes de consola y 506 bloques | Ninguno | Contando solo código que se ejecuta. |
| Generación de ejercicios | 2962 líneas en una sola pieza | 1423 líneas en la misma pieza | Más limpia, pero con el mismo diseño. |
| Interfaz | Polymer, MDC, xy-ui y React sin usar | Componentes propios y jQuery | En ambas, el formulario está repetido para escritorio y para móvil. |
| Licencia | Ninguna (`UNLICENSED`) | AGPL-3.0 | Imprescindible para poder publicar y compartir el código. |

: Tabla 1. Resumen de la comparación.

## 4. Cifras

![Figura 1. Librerías de terceros: 56 y 44 en la versión original frente a 8 y 7 en la actual.](informe/dependencias.svg)

![Figura 2. Tamaño de lo que se publica, por tipo de fichero. La original incluía 10,6 MB de código de servidor y 5 MB de fuentes.](informe/despliegue.svg)

![Figura 3. Lo que descarga el navegador al abrir la portada, separando lo de la aplicación de lo que viene de otras webs.](informe/carga.svg)

![Figura 4. Código propio de la aplicación: líneas, comentarios y restos de depuración.](informe/codigo.svg)

![Figura 5. Pruebas automáticas: cuántas hay, cuántas estaban vacías y cuántas líneas ocupan.](informe/pruebas.svg)

Dos cifras no mejoran tanto como las demás, y conviene explicar por qué:

- **Las líneas de código propio solo bajan un 18 %** (de 12 686 a 10 406). La versión original usaba librerías
  externas para la interfaz, y ese código no cuenta como propio. La actual las ha sustituido por componentes
  propios y ha añadido piezas pequeñas y probadas. Lo que sí ha desaparecido es el código que no se usaba y el de
  depuración, pero la parte que genera los ejercicios sigue siendo grande.
- **Las fuentes que se descargan al abrir la portada siguen siendo más que en la original** (110 KB frente a
  43 KB). La original no cargaba la tipografía Roboto y usaba la del sistema. La actual sí la carga, aunque solo
  con los caracteres del español y los tres grosores que se usan, y sin hacer esperar al texto mientras llega.

## 5. Mejoras aplicadas

### Publicación y velocidad

- La aplicación son ficheros estáticos: no necesita PHP, ni Composer, ni un servidor propio. `npm run build`
  genera la carpeta `dist/`, que es lo que se publica.
- Las herramientas de construcción antiguas (webpack y Babel) se han sustituido por esbuild y Sass: construir la
  aplicación tarda menos de un segundo y no necesita configuración propia.
- Las librerías para generar PDF solo se descargan cuando alguien imprime. La portada aparece sin esperar a
  imágenes ni librerías.
- Se han quitado 95 imágenes y fuentes que nada usaba, copias de librerías que nadie cargaba, Font Awesome (se
  usaba para tres iconos) y dos hojas de estilo de MDC.
- La tipografía Roboto se reduce a los caracteres del español y a los tres grosores que se usan: la portada
  descarga 110 KB de fuentes en lugar de 234 KB, y lo publicado pasa de 2,2 MB de fuentes a 110 KB.
- La configuración (`config.json`) se lee sin bloquear la página y se puede seguir editando después de publicar.

### Seguridad

- Se ha quitado todo el código de servidor en PHP: el que enviaba correos (que ya no se usaba) y el que generaba
  PDF. Con él desaparece una clave que estaba escrita dentro del código publicado.
- La función `eval`, que ejecutaba texto como código, se ha sustituido por una calculadora propia que solo acepta
  operaciones matemáticas. Se ha comprobado que rechaza, por ejemplo, `alert(1)`.
- Las tareas automáticas de GitHub tienen solo los permisos que necesitan y revisan las librerías en busca de
  fallos de seguridad conocidos.

### Calidad del código

- Se han quitado 414 bloques de depuración, unas 600 líneas de código comentado y casi 50 funciones que nadie
  usaba. Se comprobó una a una que nada las llamaba.
- Se han sacado de las piezas grandes las partes que se pueden probar por separado: las operaciones aritméticas,
  las reglas de los números y del azar, el temporizador, la sesión de ejercicios y los resultados.
- Ya no existe un modo de depuración dentro del código: la aplicación genera siempre lo mismo para la misma
  configuración.
- GitHub rechaza cambios que dejen variables sin usar.

### Pruebas automáticas

- Hay una sola batería de 457 pruebas, sin pruebas vacías. Los ejercicios se pueden repetir exactamente usando
  una semilla, y una prueba de referencia guarda lo que genera la aplicación para 1184 combinaciones de opciones:
  si algo cambia sin querer, la prueba avisa.
- Los componentes de la interfaz (casillas, interruptores, desplegables, paneles y ventanas) tienen pruebas de su
  comportamiento: cómo responden al ratón y al teclado y qué avisos dan a los lectores de pantalla.
- 14 pruebas se ejecutan en un navegador real: el recorrido completo de un alumno, la vista previa del PDF, la
  accesibilidad, la ayuda, las ventanas y la carga de la configuración. Fallan también si la página muestra algún
  error.
- La cobertura, es decir, la parte del código que ejecutan las pruebas, es del 86 %. GitHub rechaza cambios que
  la bajen del 80 %, y las piezas ya renovadas deben estar por encima del 98 %.
- La web de demostración solo se actualiza si todas las comprobaciones han pasado.

### Errores corregidos

| Error | Origen | PR |
|---|---|---|
| Las sumas con «resultado igual a» salían mal (`12 + (-18) = 30`) | Original | #127 |
| Un reintento con paréntesis podía dejar la página colgada | Original | #141 |
| El navegador y las pruebas trataban los decimales de forma distinta | Original | #140 |
| Se avisaba de «resultado no entero» justo cuando sí lo era | Original | #146 |
| Las ventanas repetían acciones y «Atrás» no cerraba | Original | #137 |
| Un cero escrito por el usuario se trataba como un hueco | Original | #120, #121 |
| El modo de depuración cambiaba los ejercicios | Original | #114 |
| Una división inexacta se daba por buena (`7 / 2 = 3`) | Original | #151 |
| Añadir una operación ya elegida daba error | Original | #153 |
| No se generaba el ZIP de cada versión | Proyecto | #134 |

: Tabla 2. Errores corregidos durante la modernización.

## 6. Valoración crítica de la versión original

- **Demasiado pesada para lo que hace.** Una aplicación de ejercicios que funciona en el navegador necesitaba un
  servidor PHP, cinco configuraciones de webpack y 100 librerías, entre ellas React y Material UI sin usarlas.
- **Poco cuidado con la seguridad.** Tenía una clave escrita dentro del código publicado, ejecutaba texto como
  código con `eval` y seguía publicando un script de envío de correos que ya no se usaba.
- **Código de pruebas mezclado con el de producción.** 589 mensajes de consola y 506 bloques de depuración, que
  además cambiaban los ejercicios cuando se activaban, y 1450 líneas de comentarios, muchas con código desactivado.
- **Pruebas que no protegían nada.** Había 300 pruebas, pero 13 estaban vacías, solo se podían ejecutar a mano y
  nada comprobaba automáticamente que pasaran.
- **Errores que veía el alumnado**, como las sumas incorrectas con «resultado igual a».
- **Sin licencia**, lo que impedía reutilizar o publicar el código.

Hay que reconocer que la parte pedagógica (niveles, tipos de número, incógnita en distintas posiciones, enfoque,
múltiplos) es rica y está pensada para el aula. La modernización la ha conservado entera.

## 7. Valoración crítica de la versión actual

- **La generación de ejercicios no se ha rediseñado.** Las dos piezas principales (1423 y 1183 líneas) siguen
  siendo difíciles de seguir: guardan estado que cambia por el camino y repiten intentos hasta que un ejercicio
  sale bien. Se ha preferido mantener el comportamiento antes que cambiarlo, lo que protege a los usuarios pero
  deja algunas rarezas:
  - una división entre números que no dan un resultado exacto se sigue mostrando recortada, como `7 / 2 = 3`.
    Ahora se registra como error, pero el resultado no se corrige. En 15 000 ejercicios generados por la
    aplicación no apareció ningún caso;
  - dos partes crean unas 20 operaciones de más por ejercicio que luego se descartan. Quitarlas cambia qué
    ejercicios salen, así que se probó y se dejó como estaba.
- **`app.js` sigue teniendo 1526 líneas.** Es el fichero que une la interfaz con el resto, y usa jQuery y
  variables compartidas. Se han sacado piezas, pero el formulario repetido para escritorio y móvil sigue ahí.
- **Dos componentes son copias de código de terceros** (el control deslizante y su etiqueta, 734 líneas). Solo
  los prueban las pruebas en el navegador.
- **Se han hecho muchos cambios en poco tiempo** (139 PRs), buena parte con ayuda de agentes de IA. Cada cambio es
  pequeño y se comprueba, pero revisar a fondo tanto volumen es difícil para una persona.
- **Las pruebas tienen límites:** la prueba de referencia ocupa unos 525 KB, las pruebas en el navegador solo se
  hacen en Chrome y no hay una revisión automática de accesibilidad o velocidad más allá de casos concretos.

## 8. DAFO de la versión actual

| | Positivo | Negativo |
|---|---|---|
| **Interno** | **Fortalezas.** Ligera (1,1 MB en la portada) y sin servidor. Sin claves en el código. Todo cambio pasa 457 pruebas, 14 en el navegador y un 80 % de cobertura. Licencia libre y documentación en español. | **Debilidades.** La generación de ejercicios mantiene su diseño original y algunas rarezas. `app.js` tiene 1526 líneas con jQuery. Formulario repetido para escritorio y móvil. Componentes copiados de terceros. Pruebas en el navegador solo en Chrome. |
| **Externo** | **Oportunidades.** La prueba de referencia permite corregir la generación de ejercicios con seguridad. Podría funcionar como aplicación instalable sin conexión. Otras comunidades pueden reutilizarla gracias a la licencia. | **Amenazas.** Depender de jQuery y Bootstrap a largo plazo. Que el ritmo de cambios con IA supere la capacidad de revisión. Que el conocimiento de la generación de ejercicios quede en pocas personas. Que cambios en Medusa Mediateca rompan los enlaces a los vídeos. |

: Tabla 3. DAFO de la versión actual.

## 9. Propuestas

1. Corregir la generación de ejercicios poco a poco, revisando en cada cambio qué ejercicios cambian. Empezar por
   que una división inexacta se genere de nuevo en lugar de mostrarse recortada.
2. Unificar el formulario de escritorio y móvil en uno solo que se adapte a la pantalla.
3. Ejecutar también las pruebas en el navegador en Firefox y Safari.
4. Añadir una revisión automática de accesibilidad y velocidad (por ejemplo con Lighthouse), primero solo como
   aviso.
5. Ir más despacio con los cambios para que la revisión de una persona siga siendo real.

<!-- salto de página -->

## Anexo A. Cómo se ha medido

- **Código.** Se lee directamente de cada versión en git. Se cuenta el código JavaScript de `src/`, sin librerías
  de terceros. Los mensajes de consola, `eval` y los bloques de depuración solo se cuentan si no están comentados.
- **Lo publicado.** La versión original guarda en git la carpeta `dist/` que se publicaba; la actual se construye
  con `npm run build`. Los ficheros se clasifican por tipo, y el código PHP cuenta como servidor.
- **La descarga de la portada.** Cada versión se sirve en local, sin comprimir, y se abre la portada cinco veces
  con un navegador automático (Playwright), empezando cada vez sin caché. Se toma el tiempo del valor central.
  Para la versión original se reconstruye la página tal como la montaba su PHP. Lo que llega de otras webs (los
  vídeos) se cuenta aparte y varía un poco entre mediciones.
- **Límites.** Los tiempos en local no son los de una red real; solo sirven para comparar. Las pruebas de la
  versión original no se han ejecutado, porque necesitan sus herramientas antiguas; se cuentan las que había. La
  cobertura se mide sobre lo que cargan las pruebas; `app.js` queda fuera porque se prueba en el navegador. No se
  ha medido con Lighthouse.
- **Repetir la medición.** `node scripts/informe-modernizacion.mjs` regenera `docs/informe/`. El PDF se genera
  con la plantilla de documentos del ATE a partir de este fichero.

## Anexo B. Todas las cifras

| Qué se mide | Versión original | Versión actual |
|---|---:|---:|
| Librerías de terceros (aplicación / desarrollo) | 56 / 44 | 8 / 7 |
| Ficheros de código propio / líneas | 31 / 12 686 | 49 / 10 406 |
| Fichero más grande (líneas) | `OperacionMultiple.js` (2962) | `app.js` (1526) |
| Mensajes de consola / bloques de depuración | 589 / 506 | 0 / 0 |
| Usos de `eval` | 1 | 0 |
| Líneas de comentario | 1450 | 513 |
| Código de servidor PHP (ficheros / líneas) | 3 / 778 | 0 / 0 |
| Pruebas escritas / vacías | 300 / 13 | 445 / 0 (431 en Node y 14 en el navegador) |
| Pruebas ejecutadas en cada comprobación | Ninguna | 457 en Node y 14 en el navegador |
| Cobertura de pruebas (líneas / funciones) | Sin medir | 86,5 % / 86,1 % |
| Tamaño de lo publicado | 24 056 KB (628 ficheros) | 3131 KB (75 ficheros) |
| Ficheros que usa el navegador (sin PHP ni ayudas de depuración) | 13 006 KB | 2363 KB |
| Portada: descarga de la aplicación / peticiones | 2904 KB / 45 | 1088 KB / 47 |
| Portada: descarga de otras webs / peticiones | 29 849 KB / 90 | 0 / 0 |
| Portada: tiempo hasta que termina de cargar (local) | 1498 ms | 30 ms |

: Tabla 4. Cifras medidas el 26 de septiembre de 2026.
