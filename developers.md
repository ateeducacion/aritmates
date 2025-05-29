# Developers Aritmates

- [Developers Aritmates](#developers-aritmates)
  - [Configurar entorno de desarrollo](#configurar-entorno-de-desarrollo)
    - [1.  Clonar el proyecto](#1--clonar-el-proyecto)
    - [2.  Moverse a nueva carpeta que aparece](#2--moverse-a-nueva-carpeta-que-aparece)
    - [3. Cambiar a la rama de desarrolo](#3-cambiar-a-la-rama-de-desarrolo)
  - [5. Instalar dependencias de javascript con NPM](#5-instalar-dependencias-de-javascript-con-npm)
  - [7. Generar version desarrollo de los archivos](#7-generar-version-desarrollo-de-los-archivos)
  - [7. Generar version de producción de los archivos](#7-generar-version-de-producción-de-los-archivos)
- [Algunas notas útiles en el desarrollo](#algunas-notas-útiles-en-el-desarrollo)
  - [Aritmates y PHP](#aritmates-y-php)
  - [Iniciar servidor de pruebas javascript](#iniciar-servidor-de-pruebas-javascript)
  - [Crear archivos para distribución](#crear-archivos-para-distribución)
  - [Opciones predeterminadas](#opciones-predeterminadas)
  - [Instalar y actualizar dependencias](#instalar-y-actualizar-dependencias)
    - [Actualizar a las siguientes mayor versions del los paquetes](#actualizar-a-las-siguientes-mayor-versions-del-los-paquetes)
    - [Buscar "debug = true;" sin // delante](#buscar-debug--true-sin--delante)
  - [Documentación](#documentación)
  - [Tests](#tests)
    - [Mocha](#mocha)
  - [Instalar con BUN](#instalar-con-bun)
  - [Copiar dist a un contenedor de Docker](#copiar-dist-a-un-contenedor-de-docker)


## Configurar entorno de desarrollo

### 1.  Clonar el proyecto

```Shell
git clone https://www3.gobiernodecanarias.org/educacion/cau_ce/repositoriocodigo/UCTICEE/OperacionesMatematicas.git
```

### 2.  Moverse a nueva carpeta que aparece

```shell
cd OperacionesMatematicas
```

Esto creará el directorio *vendor*

## 5. Instalar dependencias de javascript con NPM

```shell
   npm install
```

Esto creará el directorio *node_modules*

## 7. Generar version desarrollo de los archivos

Con Npm podemos inicar un servidor para ver la version de la aplicación que solo usa javascript

```shell
   npm run dev
```

Esto lanzara el navegador en localhost:9012 y se actualizara según cambiemos los ficheros


## 7. Generar version de producción de los archivos

```Shell
   npm run build
```

Esto crea la carpeta **dist** y todos los archivos de su interior que son la version  optimizada y preparada para producción con webpack

El contenido es debe ser similar a esto:

📁 dist

* 📁 fonts
* 📁 img
* 📁 plantilla
* 📁 templates
* 📁 vendor
* index.php
* app.~filehash~.bundle.js
* app.~filehash~.css
* vendors.~filehash~.css
* vendors.~filehash~.bundle.js

Podremos probar los archivos php en esta version al poner la carpeta dist en un servidor web con php

# Algunas notas útiles en el desarrollo

## Aritmates

La aplicacion es principalmente en javascript

## Iniciar servidor de pruebas javascript

Esto lanzara una version en la que no se puede usar la parte de php de enviar el correo pero el resto de la aplicacion esta completamente en javascript asi que puede ser mas ultil para el desarrollo

> npm run dev

## Crear archivos para distribución

Crea los archivos html, js y css mimizados en la capeta ./dist

> npm run build

## Opciones predeterminadas

Existe un archivo que tiene las versiones predeterminadas de las opciones.
Se pueden modificar el archivo *./src/defaultOptions.js*

Para mayor facilidad y camibos en la versiond ya desplegada se puede usar el archivo **config.json** para modificar estas opciones o diferenciarlas en distintos entornos.

config.json
```json
{
    "nivel": 10,
    "cuentaAtras": 0,
    "cantidadOperaciones": 10,
    "tiposOperaciones": ["suma", "resta","multiplicacion", "division"],
    "cantidadOperandos": 2,
    "posicionIncognitaAlAzar": false,
    "resultadoNegativo": false,
    "maximoOperandos": 3,
    "tiposNumero": [0],
    "baseurl": "https://www.gobiernodecanarias.org/medusa/apps/aritmates/",
    "version": "1.0.5"
}
```

Los ids para las opciones de de "tiposNumero" se corresponden con:

    NATURAL: 0, // 1 .. Infinito
    ENTERO: 1, // (NEGATIVOS) -Infinito .. Infinito
    DECIMAL: 2,
    MULTIPLO10: 3, // 10,20,30...
    MULTIPLO100: 4, // 100,200

## Instalar y actualizar dependencias

```shell
      npm update
```

### Actualizar a las siguientes mayor versions del los paquetes

```shell
      ncu -u 
      npm update
```


### Buscar "debug = true;" sin // delante

Expresion regular para elimitar los debug = true

```regex
 ^(\s+)?(?!(\/\/))(\s+)?(const |let )?debug(\s)?=(\s)?true;(\s+)?$
```

## Documentación

generar documentación con :

```shell
npm run docs
```

Esto creara o actualizara la documentacion en ./docs
el archivo conf.js tiene la configuracion para como se crean los archivos, se puede ver mas informacion en <https://jsdoc.app/about-configuring-jsdoc.html>

## Tests

### Mocha

Ahora mismo con el php si ejecutas npm run build borra los test asi que hay que generarlos con :

```shell
      npm run test
```


Tambien esta la tarea 'testwatch' que genera testBundle.js cada vez que se modifican los test

```shell
      npm run testwatch 
```

La extension de vscode "Mocha Explorer" muestra todos los test y permite ejecutarlos sin usar la terminal, es necesario configurar esta opción para que cargue los test:

> settings.json

```json
   "mochaExplorer.files": "dist/testBundle.js",
```

también se puede ejecutar en la terminal toda la bateria de pruebas con:

> npx mocha dist/testBundle.js

o si solo se quiere ejecutar un test concreto o un grupo de tests con -g :

> npx mocha -g "01 debería devolver operacion de 3 operandos, suma y resta" dist/testBundle.js 

Si mocha esta instalado de forma globlal no hace falta poner 'npx' delante del comando



## Instalar con BUN

bun es un gestor de paquetes como npm o yarn , pero mas rapido,  npm no me estaba funcionando asi que probe con esto

<https://bun.sh/> mas info

instalar bun:

> curl -fsSL <https://bun.sh/install> | bash
> bun install

para instalar paquetes de packages.json

para ejecutar npm scripts

> bun run <nombre>

para crear la version de distribucion de aritmates deberia ser

> bun run build

como alternativa si el comando anterior falla  podemos ejecutar:

> bunx webpack --progress --mode production

bunx es el equivalente a npx

## Copiar dist a un contenedor de Docker

> bun run build && docker cp dist/ <container_id>:./var/www/html/

con `docker ps` podemos ver los ids de los containers activos

ejemplo:

> bun run build && docker cp dist/ fda1306f06af:./var/www/html/

o

> npm run build && docker cp dist/ <nombre_contenedor>:./var/www/html/

y podremos acceder con una url similar a http://localhost:8000/dist/