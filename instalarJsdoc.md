# Instalación y configuración de jsdoc 

<!-- Table of contents  -->
- [Instalación y configuración de jsdoc](#instalación-y-configuración-de-jsdoc)
  - [Instalación de npm](#instalación-de-npm)
  - [Instalar los paquetes para generar la documentación](#instalar-los-paquetes-para-generar-la-documentación)
  - [Fichero de configuracion de jsdoc](#fichero-de-configuracion-de-jsdoc)
  - [Crear script para generar la documentación](#crear-script-para-generar-la-documentación)
  - [Ejemplos y Etiquetas comunes para lo documentación](#ejemplos-y-etiquetas-comunes-para-lo-documentación)
    - [Documentar Class](#documentar-class)
    - [Etiquetas comunes](#etiquetas-comunes)
      - [Generales para indicar Autor y version](#generales-para-indicar-autor-y-version)
      - [Tipo de variables](#tipo-de-variables)
      - [Funciones y metodos](#funciones-y-metodos)
      - [Clases](#clases)
    - [Cosas que pueden dar problemas en document this](#cosas-que-pueden-dar-problemas-en-document-this)
    - [Mas información](#mas-información)

## Instalación de npm 

Una de las maneras más sencillas es usando NPM en nuestro proyecto para instalar el gestor de paquetes de js NPM
aquí podemos encontrar información actualizada de como instalarlo junto a node:

https://www.npmjs.com/get-npm

Una vez instalado si estamos en un proyecto nuevo tememos que ejecutar, en los proyectos con Laravel ya usan NPM con un plug-in especial llamado *laravel.mix* y **este paso no es necesario**

```Shell
$ npm init
```

Esto generara un fichero package.json

## Instalar los paquetes para generar la documentación

Con estos comandos instalamos los dos paquetes que vamos a usar, el _--save-dev_ indica que solo son para desarrollo

```Shell
$ npm install jsdoc --save-dev
$ npm install docdash --save-dev
```
Una vez instalados aparecen así en nuestro archivo package.json algo similar a esto:

```json
{
  "name": "Nombre",
  "version": "1.0.0",
  "description": "Desc...",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",

  },
  "author": "Nombre Apellido Apellido",
  "dependencies": {
    "docdash": "^1.2.0",
    "jsdoc": "^3.6.6"
  }
}
```

## Guardar la configuración de jsdoc

Podemos guardar la configuración que usara jsdoc para generar la documentación en un fichero, vamos a llamarlo *jsdocConf.js* en este ejemplo y estará en la raíz del proyecto

**source.include** 
tenemos un array de los directorios y subdirectorios donde va a buscar el código JS.

**source.includePattern** 
son las extensiones de los archivos que va a revisar.

**opts.destination** 
es la carpeta destino donde se guarda el HTML generado

**docdash** 
son las opciones del template que estamos usando para generar la documentación 

Podemos ver más sobre las opciones de jsdoc aquí:
https://jsdoc.app/about-configuring-jsdoc.html
Y sobre las de docdash, al final de esta página nos especifica las opciones disponibles: 
http://clenemt.github.io/docdash/index.html

Ejemplo de fichero:
```js
module.exports = {
  plugins: [
    'plugins/markdown',
  ],
  recurseDepth: 10,
  source: {
    include: ['src'],
    includePattern: '\\.(jsx|js|ts|tsx)$',
  },
  tags: {
    'allowUnknownTags': true,
    'dictionaries': ['jsdoc'],
  },
  opts: {
    'encoding': 'utf8',
    'destination': './docs/',
    'recurse': true,
    'private': true,
    'verbose': true,
    'template': './node_modules/docdash',
  },
  templates: {
    'search': true,
    'cleverLinks': false,
    'monospaceLinks': true,
    'useLongnameInNav': false,
    'showInheritedInNav': true,
  },
  'docdash': {
    'static': true,         // Display the static members inside the navbar
    'sort': true,           // Sort the methods in the navbar
    'search': true,         // Display seach box above navigation which allows to search/filter navigation items
    'collapse': true,       // Collapse navigation by default except current object's navigation of the current page
    'wrap': true,           // Wrap long navigation names instead of trimming them
    'typedefs': true,       // Include typedefs in menu
    'menu': {                       // Adding additional menu items after Home
      'Project Website': {        // Menu item name
        'href': 'https://myproject.com', //the rest of HTML properties to add to manu item
        'target': '_blank',
        'class': 'menu-item',
        'id': 'website_link',
      },
      'Forum': {
        'href': 'https://myproject.com.forum',
        'target': '_blank',
        'class': 'menu-item',
        'id': 'forum_link',
      },
    },
  },
};
```


## Crear script para generar la documentación


En package.json hay una sección llama da **scripts**, en esta crearemos una nueva linea con el comando jsdoc -c jsdocConf.js.
que lanzará el generador de la documentación

```json
{
  "name": "Nombre",
  ...
  "scripts": {
    "docs": "jsdoc -c jsdocConf.js"
  },
  ..
}
```

Una vez creado basta con ejecutar 

```shell
$ npm run docs 
```

y nos creará la documentación en HTML en el directorio indicado, en este ejemplo es en *./docs*

# Etiquetas y ejemplos

## Ejemplos y Etiquetas comunes para lo documentación

Si usas _documentThis_ en vscode puedes poner estas opciones en **settings.json** para agregar tu nombre a la documentación, no está la opción para agregar @version como hace _php-docblocker_ así que tendremos que agregarlo a mano

```json
...
 "docthis.includeAuthorTag": true,
 "docthis.authorName": "TuNombre Apellido",
...
```

Para escribir la documentación basta con comenzar con /** al principio de un archivo, clase, función o variable que queramos documentar.

En estos ejemplos uso *var*, *let* y *const* indistintamente para definir variables, según los ejemplos de los que se ha sacado, no es algo que se tenga en cuenta a la hora de la documentación ni tienen un objetivo concreto


### Documentar Class

```js
/**
 * Clase base para las distintas operaciones ( ver Suma, Resta, Multiplicacion, Division )
 * 
 * Los parametro entre llaves, esta hecho para poder cargar cualquier parametro por su nombre como objeto
 * de esta manera se podria escribir:
 * new Operacion(10, 1, 0, 100, 4 ) ;
 * como:
 * new Operacion( cantidadOperandos = 4 );
 * sin necesidad de poner los campos anteriores
 *
 * @author Fernando Ramírez Pérez <fernando.ramirez@altia.es>
 * @version 1.0.0-rc1
 * 
 * @param {number} [nivel=50] nivel de la operacion decide los numeros que se van a generar
 * @param {number} [posicion_nivel=1] posicion donde se fija el nivel y el enfocado
 *
 *
 * @export
 * @class Operacion
 */
export default class Operacion {
  ...
}
```

### Etiquetas usadas

#### Generales para indicar Autor y versión

@author 
@version 

```js
 /**
 * ..
 * @author Fernando Ramírez Pérez <fernando.ramirez@altia.es>
 * @version 1.0.0-rc1
 * ...
 */ 
```

#### Tipo de variables 

Se puede Indicar el tipo de variable
```js
/** @type array  */
const lista = [];

/** @type MiClase */
let micla = new MiClase() */

```

#### Funciones y métodos

En este ejemplo el @memberof se puede usar para casos en los que no este claro
a que padre pertenece…

```js
  /**
   * Comprueba que la operacion es correcta y revisa la incognita
   *
   * @author Fernando Ramírez Pérez
   * @memberof Operacion
   */
   function comprobar(){
     ...
   }

   // Podria estar dentro de una clase o podria luego hacer esto para agergarla
   const Operacion = {};
   Operacion.comprobar = comprobar();

   // O tambien
  /** @memberof Heorramientas */
  var martillo = function() {
  };

  Herramientas.martillo = martillo;

```

#### Clases

Clase simple

```
/** Class representado un punto. */
class Point {
    /**
     * Crea un punto
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        // ...
    }

    /**
     * Obtener valor de x
     * @return {number} el valor de x
     */
    getX() {
        // ...
    }

    /**
     * Obtener valor de y
     * @return {number} el valor de y
     */
    getY() {
        // ...
    }

    /**
     * Convierte un string de dos numeros separados en comas a un punto
     * @param {string} str cadena tipo "1, 5"
     * @return {Point} Un objeto Point
     */
    static fromString(str) {
        // ...
    }
}
```

Ese ejemplo es un modulo tipo ES6 que se exporta 

```js
/**
 * @author Fernando Ramírez Pérez <fernando.ramirez@altia.es>
 * @version 1.0.0-rc1
 * 
 * @class Operacion
 * @param {number} [nivel=50] nivel de la operacion decide los numeros que se van a generar
 * @param {number} [posicion_nivel=1] posicion donde se fija el nivel y el enfocado
 * @param {number} [lower_bound=1] limite inferior minimo valor de operando
 * ...
 */
export default class Operacion {
  ...
}
```


### Problemas conocidos

Algunas cosas no son detectadas automáticamente por document this y tendremos que
escribir nosotros las etiquetas 

Funciones con parámetros desestructurados:

```js
/** 
* nombre y departamento
* @fuction 
* @param Object
* @param Object.name nombre
* @param Object.departament departamento 
*/
function({name, department}) {
  var tal = name;
  var cual = department;
};
```

Funciones anónimas
```js
/** 
* Saludo
* @fuction 
* @param {Object} Object
* @param {String} Object.name nombre
* @param {String} Object.surname apellido
*/
var sayHello = function({ name, surname }) {
  console.log(`Hello ${name} ${surname}! How are you?`);
};
```

Funciones lambda:
```js
/** 
 * Funcion escrita tipo lambda 
 * 
 * @function
 * @param {Object} x Equis
 * @return {Object} cual
 */
const tal = (x) => {
  const cual = x;
  return cual;
};

tal(5);

/**
* Otra manera de escribirlas de manear abreviada, misma documentación
* Foo es x mas diez
*
* @function
* @param {number} x numero a sumar 
* @return {number} resultado
*/
var foo = (x)=>10+x 

console.log(foo(10))
```

### Referencias

* https://jsdoc.app/howto-es2015-classes.html
* https://jsdoc.app/howto-es2015-modules.html
* https://devhints.io/jsdoc 
