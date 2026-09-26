
import DivisionEntera from './divisionEntera';
import {Decimal} from 'decimal.js';
import OPERACIONES from './operaciones';
/**
 * Operacion division con decimales
 *
 * @author Fernando Ramírez Pérez
 * @author Área de Tecnología Educativa (versión simplificada 1.3+)
 * @export
 * @class DivisionDecimales
 * @extends {DivisionEntera}
 */
export default class DivisionDecimales extends DivisionEntera {
  constructor({
    nivel, lower_bound, upper_bound, cantidadOperandos, permitirNegativos,
    operandos=[],
    incognita = cantidadOperandos + 1, enfocado, posicion_nivel,
    multiplo10 = false, multiplo100 = false, complementario = false,
    decimales = false, decimalesMaximo,
    random,
  } = {}) {
    if ( !lower_bound ) lower_bound = 0.1;
    if ( lower_bound==0 ) lower_bound = 0.1;
    super({
      nivel: nivel,
      lower_bound: lower_bound,
      upper_bound: upper_bound,
      cantidadOperandos: parseInt(cantidadOperandos),
      permitirNegativos: permitirNegativos,
      operandos: operandos,
      incognita: incognita,
      enfocado: enfocado,
      posicion_nivel: posicion_nivel,
      multiplo10: multiplo10,
      multiplo100: multiplo100,
      complementario: complementario,
      decimales: decimales,
      decimalesMaximo: decimalesMaximo,
      random,
    });

    this.deep = 0;


    if (cantidadOperandos>2 ) {
      this.errors.push({
        'error': 'Cantidad de operandos',
        'msg': 'No se permiten más de dos operandos para esta operación, se ' +
            'enviaron ' + cantidadOperandos});
      this.cantidad_operandos = 2;
      // mueve la posicion de la incognita al resultado
      if ( this.posicion_incognita > 2 ||
         this.posicion_incognita === undefined ) {
        this.posicion_incognita = this.cantidad_operandos+1;
      }
      this.generarNumerosOperandos();
      this.calcularResultado();
      this.comprobarResultado();
    }

    this.simbolo = '/';
    this.tipo = 'division_decimales';

  }

  calcularResultado() {

    this.intentos = 0;

    if (this.operandosIniciales &&
        this.operandosInicialesLength() !== this.cantidad_operandos
    ) {
      this._generarDivisionPorMultiplicacionInvertida();
      // la multiplicacion es entera
      return;
    }

    if ( !this.operandos_por_usuario) {
      super.calcularResultado();


      if (this.comprobarDecimalesValidos(this.operandos)) {
        if (this.resultado &&
          this.resultado == new Decimal(this.operandos[0])
              .div(this.operandos[1])
        ) {
          this.operandosDecimalToFloat();
          return;
        } else {
        }
      }

      // FIXME:  POR ALGUNA RAZON HAY VECES QUE LOS OPERANDOS PASAN DOS VECES
      // POR AQUI

      const nDecimales = this.obtenerDecimalesSegunNivel(this.nivel);
      const powDecimales = Math.pow(10, nDecimales);

      if ( this.enfocado ) {
        this.operandos[0] = this.operandos[0] / powDecimales;
        this.operandos[1] = this.operandos[1];
      } else if (this.complementario) {
        // sin decimales
        this.operandos[0] = this.operandos[0];
        this.operandos[1] = this.operandos[1];
        // this.resultado = complementario viene del super
      } else {
        const azar = this.getRandomMinMax(0, 1);

        switch (azar) {
          case 0:
            // decimal en dividendo y resultado
            this.operandos[0] = new Decimal(this.operandos[0])
                .div(powDecimales);
            this.operandos[1] = this.operandos[1];
            break;
          case 1:
            // decimal en dividendo y divisor
            this.operandos[0] = new Decimal(this.operandos[0]).div(powDecimales);
            this.operandos[1] = new Decimal(this.operandos[1]).div(powDecimales);
            break;
          case 3:
            // 1 decimal en divisor
            this.operandos[0] = this.operandos[0];
            this.operandos[1] = new Decimal(this.operandos[1]).div(10);
            break;
          //     break
          default:
            break;
        }

        this.resultado = new Decimal(this.operandos[0]).div(this.operandos[1]);
        // comprobar que van a dar números con decimales
        const listaNumeros = this.operandos.slice();
        if ( ! this.comprobarDecimalesValidos( listaNumeros ) ) {
          this.intentos = this.intentos +1;
          this.deep++;
          if (this.operandosIniciales) {
            this.operandos = this.operandosIniciales.slice();
          } else {
            this.operandos = [];
          }
          this.generarNumerosOperandos();
          this.calcularResultado();
        }

        // no usar this.operandos[0] / this.operandos[1]
        // tiende a dar mas errores de num periodicos
      }
    } else {
      this.resultado = new Decimal(this.operandos[0]).div(this.operandos[1]);
    }

    // si haces esto puede darte resultados como este:
    // 601349 / 317 = 1897
    // 601.349 / 317 = [1.8970000000000002]
    // cuando debería dar 1.897

    // el resultado del numero entero viene de "generar operandos "
    this.operandosDecimalToFloat();
  }

  _generarOperandoPosicion(posicion) {
    this.decimales = true;
    // super._generarOperandoPosicion(posicion);
    // NO GENERAR CEROS!
    let i = 0;
    const tries = 5;
    do {
      super._generarOperandoPosicion(posicion);
      i++;
    } while ( this.operandos[posicion] == 0 && i<tries );
  }

  comprobarDecimalesValidos(lista) {
    this.decimalToFloat(lista);

    let noHayDecimales = true;
    lista.forEach((element) => {
      if (element %1 !== 0) noHayDecimales = false;
    });
    if (noHayDecimales) {
      return false;
    }

    const nDecimales = this.obtenerDecimalesSegunNivel( this.nivel );
    for (let i = 0; i < lista.length; i++) {
      const num = lista[i];
      if ( undefined !== num ) {
        if (this.obtenerNumeroDecimales(num) > nDecimales) {
          return false;
        }
      }
    }
    return true;
  }

  operandosDecimalToFloat() {
    this.operandos[0] = parseFloat(this.operandos[0].toString());
    this.operandos[1] = parseFloat(this.operandos[1].toString());
    this.resultado = parseFloat(this.resultado.toString());
  }

  decimalToFloat(lista) {
    lista.forEach((element, i) => {
      // constructor.name is mangled in the minified bundle.
      if (Decimal.isDecimal(element)) {
        lista[i] = parseFloat(lista[i].toString());
      }
    });
  }

  obtenerSimbolo() {
    return '/';
  }
  getTipo() {
    return OPERACIONES.DIVISION_DECIMAL;
  }


}
