# guion 

## Aritmates

Una aplicacion para generar operaciones matematicas
sumas retas multiplicaciones divisiones
con numero enteros, deciameles,con multiplos de 10
numeros negativos
operaciones entre parentenisis 


## Estructura e informacion en gitlab

Ahora vamos a apsar a explicar la estructuora y la informacion disponible de la aplicacion

## Estructura

## Versiones de javascript y php

la aplicacion usa principalmnte javascript, usando solo php para un caso de 
generar pdfs en los resultados la ultima parte 

## Archvos

### comentar la estrucura del arbol

tenemos la carpeta src donde esta todo le codigo js
dentro la carpeta templates que tiene el html
dentro view que tiene el codigo js especifico para cada template
widgets que son el codigo de controles especificos que se reutilizan
css carpeta con estilos css en sass

### appjs

La aplicacion empieza en app.js donde esta gran la logica que carga el resto de 
clases y librerias,

lo que vemos en  la imagen es parte de las librerias que carga

 destacando

liberrias polymer(material desing), css, Clases de operciones, generar examen 

generarExamen.js
ImprimirPdf.js
OptionsShortcode.js


### Operacion

Clases que no tienen una parte grafica solo crean la operacion con laso opciones dadas

tienen metodos para comprobar el resultado y generar un html basico

el estilo se aplica en el css y los templates de "ejercicio"

contienen los métodos ara generar 
 un tipo de operacion especifico, 
comprobar el resultado
y generar esta como texto o el html base (sin estilo)

### ejemplo resta

muestar que hereda de operacion y la serie de opciones que podemos poner directamte recaliciandas con los que
no  aparece en las opciones iniciales

### ejemplo uso

simple ejemplo de lo que hace la clase resta,

para generar un conjutno de operacionse se usa la clase generarexamen

toda la funcionalidad de los botones , pasar a la siguiente operacion, mostrar  una u otra cosa en pantalla se hace en app.js y en la vista que se este usando en ese momneto

### widgets

los widgets son controles reutilizables en la aplicacion
como los sliders, los botones de operaciones, tipos de numeros, paneles y delplegables que apareccen 

se usan muchos widgets que son librerias direcatmetne viene tal cual 
otros como los que se muestran
se han modificado o creados nuevo

Por poner un ejemuplo el de paper-expansion-panel.js

tenemol eltitulo en la propuiedad header de la tag y el texto detro de la etiqueta paper-item-body

        <paper-expansion-panel id="thisapp"  header="¿Qué es Aritmates?" icon="help-outline"  opened >
          <paper-item>
            <paper-item-body >
              <div style="white-space: normal;">
                texto
              </div>
            </paper-item-body>
          </paper-item>
        </paper-expansion-panel>

## Templates - plantillas html

muestra un caso contreco de lo que viene en part_ejercicio.html
 y como se podria editar


## Liberias

esto es parte de las librerias de javascript que se usan

se pueden ver todas en el archivo package.json, estan en la carpeta vendor instalada
y cuando se hacer el build para version de pro se cargan en varios arcihvos vendor.#####.buldle.js

los widgtes ya se han comnetado en la antterior n o me exntiendo mas


## decimal js

esta fue na libreria imprescindible ya que la libreria math.js y las opciones
que vienen en javascript resultaban en muchos problemas con numeros grandes y 
decimales

cometar ejemlpo de resta numueros deciamles senicllos da problemas 

## jsPDF

permite generar pdf directamente desde javascript

## docuemntacion

documentocion generada con los comentarios y analisi del codigo

## guia desarorllador
 
 mas en detalle que en ldevelopers.md 

## desplegar aplicacion



