# Changelog

## Aritmates 1.2.0 - UI nativa y build minificado

* Sustitución completa de controles Polymer / MDC / xy-ui por componentes nativos o vendored en `src/components/`.
* Sin dependencias `@polymer/*`, `@material/*` ni `xy-ui`.
* Build: esbuild con **minify**; Material Icons vía `material-design-icons` + `css/material-icons.css` (sin wrapper webpack).
* Versión de aplicación en UI: `1.2.0`.

## Aritmates 1.1.0 - Versión simplificada (estática)

* Publicación como aplicación web estática (HTML/CSS/JS + `dist/vendor`), sin Webpack/Babel en producción.
* Créditos: texto de versión simplificada basada en desarrollo previo de Netex y Altia (sin logos de ambas empresas).
* Eliminación de dependencias no usadas: `whatwg-fetch`, `mustache`, `mathjs`, `html2pdf.js`.
* Eliminación de entradas de prueba antiguas (`src/view/pruebas*`, etc.) y assets de logos Netex/Altia.
* Build con scripts Node nativos + Sass + esbuild; jQuery, Bootstrap, html2canvas y jsPDF cargados desde `vendor/`.
* `paper-checkbox` nativo en lugar de Polymer para ese control.
* Versión de aplicación en UI: `1.1.0`.

## Aritmates 1.0.6 - Actualización y liberación de código

Esta sección describe las tareas y mejoras planificadas para la versión 1.0.6:

* Publicar el proyecto en GitHub siguiendo buenas prácticas.
* Aplicar actualizaciones para corregir vulnerabilidades de seguridad.
* Refactorizar el código para mejorar mantenibilidad y legibilidad.
* Añadir o mejorar pruebas unitarias e integración.
* Actualizar y fijar dependencias.
* Mejorar documentación y ejemplos de uso.
* Configurar integración continua y pipelines de despliegue.

## Aritmates 1.0.5

* Descargar resultados de ejercicios en PDF.
* Enlaces actualizados para aviso legal y privacidad.
* Actualizada la opción de imprimir ejercicios en PDF.
* Cambio logos en creditos y pdf

### notas para despligue:

Agregar o revisar que en config.json este configurada la url de la pagina en **baseurl**

```json
{
    "nivel": 10,
    "cuentaAtras": 0,
    ...
    "baseurl": "https://www3-pre.gobiernodecanarias.org/medusa/apps/aritmates/"
        o
    "baseurl": "https://www.gobiernodecanarias.org/medusa/apps/aritmates/"
}
```

## Aritmates 1.0.4

* Eliminada la funcionalidad de enviar los resultados por correo electrónico

## Aritmates 1.0.3

* Solucionar incidencia con mwc-switch

## Aritmates 1.0.2

* Cambios logos gobierno de canarias
* Actualización librerías JS
* Actualización librerías JS

### Notas para instalación

Seguir el proceso del readme.md, conservando los archivos **smtpconfig.php** y **config.json** actuales para no borrarlos con los que están en la carpeta **dist**
Seguir el proceso del readme.md, conservando los archivos **smtpconfig.php** y **config.json** actuales para no borrarlos con los que están en la carpeta **dist**

## Aritmates 1.0.1

* Archivo de opciones predeterminadas (config.json)
* Nuevas ilustraciones en la sección de ayuda

## Aritmates 1.0.0

Versión inicial