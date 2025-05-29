# Aritmates 1.0.5

Aplicación para realizar ejercicios de matemáticas 
desarrollada por la Consejería de Educación del Gobierno de Canarias

## Empezando

A continuación se describe el proceso de instalación, así como los requisitos previos necesarios para su correcto funcionamiento

### Requisitos previos

* Servidor web, p. ej. Nginx, Apache...
* Instalación local de git
* PHP >= 7.1.3 con las siguientes extensiones: 
   - BCMath PHP Extension
   - Ctype PHP Extension
   - JSON PHP Extension
   - Mbstring PHP Extension
   - OpenSSL PHP Extension
   - PDO PHP Extension
   - Tokenizer PHP Extension
   - XML PHP Extension   
   - DOM extension
   - GD extension

## Instalación

### 1.  Clonar el proyecto

```Shell
$ git clone https://www3.gobiernodecanarias.org/educacion/cau_ce/repositoriocodigo/UCTICEE/OperacionesMatematicas.git
```

### 2.  Moverse a nueva carpeta que aparece

```shell
$ cd OperacionesMatematicas
```

### 3. Cambiar al tag de la versión

```shell
$ git checkout tags/1.0.5
```

### 4. Configurar servidor web para que sirva ./dist

Si ya existen los ficheros de configuración **smtpconfig.php** y **config.json** crear una copia de seguridad.

Copiar el contenido de la carpeta **dist** a donde se va a acceder el servidor web, y borrar el resto de archivos.

Restaurar la copia de seguridad de **smtpconfig.php** y **config.json**.

### 5. Configurar envío de correo (opcional)

En el archivo **smtpconfig.php** se pueden cambiar las opciones del servidor SMTP y el correo que aparecerá como el remitente 
desde el que se envía 

```PHP
$smtpconfig = array(
    'host'         => 'smtp.server.com',
    'port'         => '465',
    'auth'         =>  TRUE,
    'username'     => 'usuario',
    'password'     => 'contraseña'
);

$from = 'noreply@example.com';
```

### 6. Archivo de configuración "config.json"
 
Se pueden cambiar las opciones por defecto modificando config.json, la mayoría de opciones son descriptivas, detallamos las que necesitan valores especiales

```json 
{
    "nivel": 5,
    "cuentaAtras": 0,
    "cantidadOperaciones": 20,
    "cantidadOperandos": 3,
    "posicionIncognitaAlAzar": false,
    "resultadoNegativo": false,
    "maximoPrimo": 4999,
    "maximoOperandos": 3,
    "recargarOperacionesInfinitas": 3,
    "reCalcTries": 300,
    "tiposOperaciones": ["suma", "resta","multiplicacion", "division"],
    "tiposNumero": [0,1]
}
```

#### Nivel

Estos son los valores válidos:

* 1
* 2
* 3
* 4
* 5
* 6
* 7
* 8
* 9
* 10
* 11
* 12
* 13
* 14
* 15
* 16
* 17
* 18
* 19
* 20
* 50
* 100
* 500
#### N.º Operaciones "cantidadOperaciones"

Estos son los valores válidos:

* 10
* 20
* 30
* 40
* 50
* 60
* 70
* 80
* 90
* 100

#### Cronometro "cuentaAtras" 

Esta define el tiempo que aparece en el cronómetro o lo desactiva, estos son los valores válidos, el necesario de las comillas dobles en donde no es 0:

   * 0 => sin cronómetro
   * "0:30" => el cronómetro aparece activo y con 30 segundos
   * "1:00"
   * "2:00"
   * "3:00"
   * "4:00"
   * "5:00"
   * "10:00"
   * "20:00"
   * "30:00" => el cronómetro aparece activo con 30 minutos

#### Número de operandos "cantidadOperandos" 

Se refiere al Número de operandos, solo puede valer 2 o 3

  * 2
  * 3

#### Incógnita "posicionIncognitaAlAzar"

* true => la incógnita aparecerá predefinida como "al azar"
* false => la incógnita aparecerá "en el resultado"

#### Resultado Negativo "resultadoNegativo"

En la sección "resultado" cambiará la posición del control de "resultado negativo"

* true => Resultado negativo activado
* false => Resultado negativo desactivado

#### OPERACIONES MATEMÁTICAS "tiposOperaciones"

Debemos de poner entre corchetes, separados por comas y entre paréntesis uno o varios de los siguientes valores

* "suma"
* "resta"
* "multiplicacion"
* "division"

quedando como este ejemplo 
```
"tiposOperaciones": ["suma", "resta","multiplicacion", "division"],
```

#### Tipos de números "tiposNumero"

Debemos de poner entre corchetes y separados por comas los siguientes valores que se corresponden con los tipos de número señalados.

* 0 => Positivos
* 1 => Negativos
* 2 => Decimales*
* 3 => Múltiplos de 10*
* 4 => Múltiplos de 100*
  
\*Hay que tener en cuenta que solo se puede poner una de las 3 últimas opciones, ya que al seleccionar Decimales y Múltiplos de 10 o 100 se desmarcan las otras opciones marcadas con asterisco

Ejemplos: 
```
    "tiposNumero": [0,1,2],
    "tiposNumero": [0,3],
    "tiposNumero": [0,4],
```

Ejemplos no válido:
```
"tiposNumero": [0,1,2,3,4],
"tiposNumero": [0,3,4],
```
#### "maximoPrimo", "recargarOperacionesInfinitas", "reCalcTries"

Estas opciones cambian la manera en la que se calculan las operaciones internamente, como normal general si se alteran y se pone un número mayor, la aplicación tardará más en generar las operaciones, no recomendamos cambiarlas

