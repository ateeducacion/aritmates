# Arquitectura

`upstream` es la referencia histórica del desarrollo original (Webpack, Polymer, PHP).
`main` es la versión que se mantiene: un sitio estático.

```text
index.html
  └─ UI (plantillas, app.js, custom elements)
       └─ aplicación (opciones, examen, insignias)
            └─ motor matemático (src/operaciones, generarExamen.js)
                 └─ reglas puras (arithmetic, expression, evaluate, random)
```

El motor no lee el DOM. La interfaz no decide si una división es exacta ni qué
precedencia tienen los operadores.

## Entrada

`src/templates/index.html` es la portada. `scripts/build.mjs` la copia a
`dist/index.html` y le añade el CSS y los scripts de `dist/vendor/`. El
JavaScript propio sale de `src/app.js` empaquetado con esbuild.

## UI

jQuery y Bootstrap siguen en la portada, el ejercicio y los resultados. Están
muy ligados a los manejadores actuales; sustituirlos no simplificaría el
proyecto.

Los controles que eran Polymer o MDC se quedaron como custom elements pequeños
(`src/components/`). Reproducen `checked`, `value` y los eventos que `app.js`
ya escuchaba. Pasarlos a `<input>` nativo obligaría a reescribir plantillas y
el cableado, y el CSS de la apariencia seguiría ahí. Se mantienen. El detalle
está en [COMPONENTES.md](./COMPONENTES.md).

## Aplicación

`src/app.js` sigue siendo el sitio donde se enganchan los clics. Las reglas que
no necesitan el DOM viven aparte:

- `src/application/badges.js` — qué insignias corresponden a una puntuación o a un tiempo
- `src/generarExamen.js` — arma la lista de ejercicios a partir de las opciones
- `src/OptionsShortcode.js` — código `#A0B1…` para compartir una configuración

## Motor

Ver [MATH-ENGINE.md](./MATH-ENGINE.md).

## Configuración

Hay una sola cascada:

1. `src/defaultOptions.js` — valores de fábrica
2. `src/config.json` — los pisa al arrancar, si el archivo carga
3. la portada — el usuario cambia la selección
4. el código corto — restaura una selección ya codificada

`config.json` no es un segundo modelo de opciones. Es el mismo objeto
`DEFAULTS`, con los campos que ese despliegue quiere fijar. `baseurl` es la URL
pública usada en el enlace de compartir. En este repositorio vale `./`.

## Build

`npm run build` vacía `dist/`, compila el SCSS, empaqueta el JS, copia imágenes,
plantillas, fuentes y las librerías UMD. No hace falta un servidor de
aplicación: cualquier HTTP estático sirve, también en un subdirectorio.

## Tests

Ver [TESTING.md](./TESTING.md).

## Seguridad

La aplicación no tiene backend. El texto de un ejercicio lo genera el motor a
partir de números, y el resultado se calcula con `evaluateArithmetic`, no con
`eval`. El parámetro `c` de la URL se interpreta como código corto de opciones,
no como HTML.

Queda HTML dinámico en la interfaz (plantillas y el enlace para compartir).
Esas cadenas salen del propio sitio o de un código con letras y dígitos. No
hay un formulario que inserte texto libre del alumno en la página.
