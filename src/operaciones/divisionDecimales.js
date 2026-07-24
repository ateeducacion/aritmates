
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
  } = {}) {
    const tag = '[DivisionDecimales]';
    // const debug= true;
    if ( !lower_bound ) lower_bound = 0.1;
    if ( lower_bound==0 ) lower_bound = 0.1;
    if ( debug ) console.log( tag, 'nivel', nivel );
    if ( debug ) {
      console.log( tag, '\n\t',
          'nivel', nivel, '\n\t',
          'lower_bound', lower_bound, '\n\t',
          'upper_bound', upper_bound, '\n\t',
          'cantidadOperandos', cantidadOperandos, '\n\t',
          'permitirNegativos', permitirNegativos, '\n\t',
          'operandos', operandos, '\n\t',
          'incognita', incognita, '\n\t',
          'enfocado', enfocado, '\n\t',
          'posicion_nivel', posicion_nivel, '\n\t',
          'multiplo10', multiplo10, '\n\t',
          'multiplo100', multiplo100, '\n\t',
          'complementario', complementario, '\n\t',
          'decimales', decimales, '\n\t',
          'decimalesMaximo', decimalesMaximo, '\n\t' );
    }
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
    });

    this.deep = 0;

    if ( debug ) {
      console.log( tag, 'this.posicion_incognita', this.posicion_incognita );
    }

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
      if ( debug ) {
        console.log( tag,
            'this.posicion_incognita post', this.posicion_incognita );
      }
      this.generarNumerosOperandos();
      // console.log('llamando calcular resultado desde cantOperandos>2');
      this.calcularResultado();
      const comprobarResultados = this.comprobarResultado();
      console.log(comprobarResultados);
    }

    this.simbolo = '/';
    this.tipo = 'division_decimales';

    if ( debug ) console.log( tag, 'FIN.' );
  }

  calcularResultado() {
    // const id = this.getRandomMinMax(1, 99999999);
    const tag = this.id+'[DivisionDecimales.calcularResultado]';
    // const tag = '[DivisionDecimales.calcularResultado]';
    // const debug = true;

    this.intentos = 0;
    if ( debug ) {
      console.log( tag );
      console.log( tag, 'Decimales: \n\t',
          'this.operandos', this.operandos, '\n\t',
          'this.decimales', this.decimales, '\n\t',
          'this.decimalesMaximo', this.decimalesMaximo, '\n\t',
          'this.deep', this.deep, '\n\t',
          'operandos por usuario', this.operandos_por_usuario, '\n\t'
          // 'this.operandosIniciales',this.operandosIniciales, '\n\t',
          // 'this.operandosInicalesLength()', this.operandosInicalesLength(),
          // '\n\t',
          // 'this.cantidad_operandos', this.cantidad_operandos, '\n\t',
      );
    }

    if ( this.operandosIniciales && this.operandosIniciales!=[] ) {
      if (this.operandosIniciales !== [] &&
        this.operandosInicialesLength() !== this.cantidad_operandos
      ) {
        this._generarDivisionPorMultiplicacionInvertida();
        if ( debug ) {
          console.log( tag, 'operandos generados por mulInvert',
              'this.operandos', this.operandos );
        }
        // la multiplicacion es entera
        if ( debug ) {
          console.log( tag,
              'operandos tran', this.operandandos );
        }
        return;
      }
    }

    if ( !this.operandos_por_usuario) {
      if ( debug ) {
        console.log( tag, 'this.nivel', this.nivel );
      }
      if ( debug ) {
        console.log( tag,
            'llamando super.calcular resultado desde', tag );
      }
      super.calcularResultado();
      if ( debug ) {
        console.log( tag,
            'operacion recibida de super', '\n\t',
            this.toString(), '\n\t',
            'operandos', JSON.stringify(this.operandos), '\n\t'
        );
      }


      if (this.comprobarDecimalesValidos(this.operandos)) {
        if ( debug ) {
          console.log( tag, 'decimales validos antes de crearlos' );
        }
        if (this.resultado &&
          this.resultado == new Decimal(this.operandos[0])
              .div(this.operandos[1])
        ) {
          this.operandosDecimalToFloat();
          return;
        } else {
          if ( debug ) {
            console.log( tag,
                'decimales validos pero no resultado',
                this.operandos, this.resultado );
          }
        }
      }

      // FIXME:  POR ALGUNA RAZON HAY VECES QUE LOS OPERANDOS PASAN DOS VECES
      // POR AQUI

      const nDecimales = this.obtenerDecimalesSegunNivel(this.nivel);
      const powDecimales = Math.pow(10, nDecimales);

      if ( this.enfocado ) {
        this.operandos[0] = this.operandos[0] / powDecimales;
        this.operandos[1] = this.operandos[1];
        // this.resultado = this.resultado / powDecimales;
      } else if (this.complementario) {
        // sin decimales
        this.operandos[0] = this.operandos[0];
        this.operandos[1] = this.operandos[1];
        // this.resultado = complementario viene del super
      } else {
        const azar = this.getRandomMinMax(0, 1);
        if ( debug ) {
          console.log('método division decimal', azar, this.toString(false) );
          console.log( tag, 'powDecimales', powDecimales );
        }

        switch (azar) {
          case 0:
            // decimal en dividendo y resultado
            this.operandos[0] = new Decimal(this.operandos[0])
                .div(powDecimales);
            // this.operandos[0] = parseFloat( this.operandos[0].toString() );
            this.operandos[1] = this.operandos[1];
            // this.resultado = this.resultado / powDecimales;
            break;
          case 1:
            // decimal en dividendo y divisor
            this.operandos[0] = new Decimal(this.operandos[0]).div(powDecimales);
            // this.operandos[0] = parseFloat( this.operandos[0].toString() );
            this.operandos[1] = new Decimal(this.operandos[1]).div(powDecimales);
            // this.operandos[1] = parseFloat( this.operandos[1].toString() );
            // this.resultado = this.resultado;
            break;
          case 3:
            // 1 decimal en divisor
            this.operandos[0] = this.operandos[0];
            this.operandos[1] = new Decimal(this.operandos[1]).div(10);
            // this.resultado = new Decimal(this.resultado).mul(10);
            break;
          // case 5:
          //     // 3 decimales
          //     // this.operandos[0] = this.operandos[0] / 1000;
          //     // this.operandos[1] = this.operandos[1]/10 ;
          //     // this.resultado = this.resultado / 100;
          //     break
          default:
            break;
        }

        this.resultado = new Decimal(this.operandos[0]).div(this.operandos[1]);
        if ( debug ) {
          console.log( tag,
              'this.tostri', this.toString() );
        }
        // comprobar que van a dar números con decimales
        const listaNumeros = this.operandos.slice();
        // listaNumeros.push(this.resultado);
        if ( debug ) {
          console.log( tag, 'intentos', this.intentos );
        }
        if ( ! this.comprobarDecimalesValidos( listaNumeros ) ) {
          this.intentos = this.intentos +1;
          this.deep++;
          if ( debug ) {
            console.log(
                tag, 'se hubiera vuelto a lanzar crear num y calcular' );
          }
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
      // console.log( tag,
      //     'operandosIniciales', this.operandosIniciales,
      //     'operandos Actuales', this.operandos,
      //     this.operandosInicialesLength(), 'this.operandosInicialesLength()',
      //     this.cantidad_operandos, 'this.cantidad_operandos'
      // );
      this.resultado = new Decimal(this.operandos[0]).div(this.operandos[1]);
    }

    // this.resultado = this.operandos[0]/ this.operandos[1]
    // si haces esto puede darte resultados como este:
    // 601349 / 317 = 1897
    // 601.349 / 317 = [1.8970000000000002]
    // cuando debería dar 1.897

    // el resultado del numero entero viene de "generar operandos "
    // this.resultado = this.resultado / 1000 ;
    this.operandosDecimalToFloat();
    if ( debug ) {
      console.log( tag, 'fin' );
    }
  }

  _generarOperandoPosicion(posicion) {
    const tag = '[divisionDecimales._generarOperandoPosicion(posicion)]';
    if ( debug ) console.log( tag, posicion );
    this.decimales = true;
    if ( debug ) {
      console.log( tag,
          'this.decimalesMaximo', this.decimalesMaximo,
          'this.decimales', this.decimales );
    }
    // super._generarOperandoPosicion(posicion);
    // NO GENERAR CEROS!
    let i = 0;
    const tries = 5;
    do {
      super._generarOperandoPosicion(posicion);
      i++;
    } while ( this.operandos[posicion] == 0 && i<tries );
    if ( debug ) {
      console.log( tag,
          'this.operandos[posicion]', posicion, this.operandos[posicion] );
    }
  }

  comprobarDecimalesValidos(lista) {
    // const debug = true;
    const tag = '[divisionDecimales.js.comprobarDecimalesValidos]';
    if ( debug ) console.log( tag );
    this.decimalToFloat(lista);
    if ( debug ) console.log( tag, lista );

    let noHayDecimales = true;
    lista.forEach((element) => {
      if (element %1 !== 0) noHayDecimales = false;
    });
    if (noHayDecimales) {
      if ( debug ) {
        console.log( tag, 'no hay decimales en ningun numero' );
      }
      return false;
    }

    const nDecimales = this.obtenerDecimalesSegunNivel( this.nivel );
    for (let i = 0; i < lista.length; i++) {
      const num = lista[i];
      if ( undefined !== num ) {
        if (this.obtenerNumeroDecimales(num) > nDecimales) {
          if ( debug ) {
            console.log( tag,
                'hay mas decimales de lo que deberia en algun numero' );
          }
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
      if ( element.constructor.name === 'Decimal') {
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

  // toString() {
  //   const txt = super.toString(false);
  //   return txt;
  // }

  // toHtml() {
  //   const html = super.toHtml(false);
  //   return html;
  // }
}
