# Ejectuar Tests

## Mocha 

Algunos test no se puede ejecutar directamente porque necista pasarlos por babel
asi que hay que crear primero el testBundle.js con

    $ npm run testwatch 

Y luego ejecutar
   
    $ npx mocha dist/testBundle.js 

Se puede ejecutar un test concreto o un grupo  de tests con -g 

    $ npx mocha -g "Nombre test" dist/testBundle.js 

en Mocha Explorer en el vscode se pueden ejecutar los test configurandolo con 
esta opcion:

    "mochaExplorer.files": "dist/testBundle.js",


## selenium

En este caso no hace falta usar testBundle.js se pueden ejecutar todos desde 

    npx mocha ./testSelenium

    npx mocha ./testSelenium/test_selenium.js -g "test1"

Por alguna razón me fallan desde la terminal de vscode pero van bien en otra 
terminal normal del sistema

# configurar entorno

Instalar drivers para distintos nagevadores 

    npm install -g chromedriver
    npm install -g geckodriver
    npm install -g iedriver
    npm install -g edgedriver




