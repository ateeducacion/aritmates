
import DivisionEntera from './divisionEntera';
import Decimal from 'decimal.js';
import OPERACIONES from './operaciones';
 
/**
 * Genera divisiones con resto
 *
 * @export
 * @class DivisionResto
 * @extends {DivisionEntera}
 * @author Fernando Ramírez Pérez
 * @author Área de Tecnología Educativa (versión simplificada 1.3+)
 */
export default class DivisionResto extends DivisionEntera {
  /**
   * Constructor
   * @param {*} Objeto con distintos parametros, permite llamar al contructror
   *            tanto separado por comas como con {parametro: valor}
   *  [{
   *     nivel, lower_bound, upper_bound, cantidadOperandos, permitirNegativos,
   *     operandos=[], incognita, enfocado, posicion_nivel,
   *     multiplo10 = false, multiplo100 = false, complementario = false,
   *   }={}]
   */
  constructor({
    nivel, lower_bound, upper_bound, cantidadOperandos, permitirNegativos,
    operandos=[], incognita, enfocado, posicion_nivel,
    multiplo10 = false, multiplo100 = false, complementario = false,
  } = {}) {
    const tag = '[DivisionResto] ';
    if ( debug ) console.log(tag);
    const cantidadOperandosEnviados = cantidadOperandos;
    if (cantidadOperandos>2 ) {
      operandos = operandos.slice(0, 2);
      cantidadOperandos = 2;
    }
    let errorComplementario;
    if ( complementario ) {
      // no tiene sentido complementario con division con resto
      complementario = false;
      errorComplementario= true;
    }
    if ( !lower_bound ) lower_bound = 1;
    if ( lower_bound == 0 ) lower_bound = 1;

    super({
      nivel, lower_bound, upper_bound, cantidadOperandos, permitirNegativos,
      operandos,
      incognita, enfocado, posicion_nivel,
      multiplo10, multiplo100, complementario,
    });

    if ( cantidadOperandosEnviados>2 ) {
      this.errors.push({
        'error': 'Cantidad de operandos',
        'msg': 'No se permiten más de dos operandos para esta operación, se ' +
            'enviaron ' + cantidadOperandosEnviados,
      });
      this.cantidad_operandos = 2;
      this.generarNumerosOperandos();
      this.calcularResultado();
    }
    if (errorComplementario) {
      this.errors.push({
        'error': 'Complementario para divisiones con resto',
        'msg': 'No se permite esta combinación de operaciones',
      });
    }

    this.simbolo = '/';
    this.tipo = 'division_resto';

    if ( this.posicion_nivel > this.cantidad_operandos +1 ) {
      this.errors.push({
        'error': 'posicion nivel mayor que numero de operandos'});
      this.posicion_nivel = this.cantidad_operandos;
    }
  }

  calcularResultado() {
    const tag = '[DivisionResto.calcularResultado] ';
    if ( debug ) console.log( tag );
    // calcula el resultado y buca operandos para resultado entero
    super.calcularResultado();

    if ( debug ) {
      console.log(tag, 'operandos post super.calcularResultado: ',
          this.operandos, ', resultado: ', this.resultado );
    }

    if (this.operandos_por_usuario) {
      if ( debug ) console.log(tag, 'operandos por usuario');
    }

    const dividendo = this.operandos[0];
    let divisor = this.operandos[1];
    if (this.cantidad_operandos>2) {
      // let divisores = 1;
      // for (let index = 1; index < this.operandos; index++) {
      //   divisores *= this.operandos[index];
      // }
      // divisor = divisores;
      // si hay mas de dos operandos el divisor es la mul de todos los
      // poteriores al primero
      divisor = this.multiplicarValores(
          this.operandos.slice(1, this.operandos.length)
      );
    }

    // this.resto = dividendo % divisor;
    this.resto = new Decimal(dividendo).modulo(divisor);
    if ( debug ) console.log(tag, 'resto: ', this.resto );
    const calcResultado = () => {
      return new Decimal(this.operandos[0]).div(divisor)
          .floor().toString();
    };
    this.resultado = calcResultado();

    if ( this.resto == 0 ) {
      this.resto = Math.abs(this.numeroRandom(true, false, 0, this.resultado));
      if (this.operandos_por_usuario) {
        // maximo para que el resultado no se vaya a otro numero seria
        // el minimo multiplo
        let minMultiplo;
        if ( this.resultado != 1 ) {
          const factores = this.factorizar(this.resultado);
          // factores.push(1);// si no agrego un uno da infinito  el resto
          minMultiplo = Math.min(...factores);
          if ( debug ) console.log(tag, 'mínimo multiplo: ', minMultiplo, factores );
        } else {
          minMultiplo = 1;
        }

        this.resto = Math.round(Math.random()*(minMultiplo-1))+1;
        if ( debug ) console.log(tag, 'op por usuario, resto: ', this.resto );
      }

      if ( debug ) console.log(tag, ' agregar resto: ', this.resto );
      if (this.operandos[0]<0) this.resto *= -1;
      this.operandos[0] += this.resto;

      // dejamos como resultado solo la parte entera
      this.resultado = calcResultado();

      // el resto es negativo si el dividendo es negativo, pero para
      // simplificar en el input, lo dejamos como positivo
      this.resto = new Decimal(this.operandos[0]).modulo(divisor)
          .abs().toString();

      if ( debug ) console.log(tag, 'resto: ', this.resto );
    }
  }

  /**
   * Convierte la operacion en una cadena tipo 63 / 7 = 9
   * @param {Boolean} equal muestra igual y resultado
   * @param {Boolean} verbose muestra mas informacion
   * @param {Boolean} show muestra el resto
   * @return {string} Cadena con la operacion
   */
  toString(equal=true, verbose=false, show=true ) {
    const tag = '[DivisionResto.toString]';
    if ( debug ) console.log( tag, show );
    let txt = super.toString(equal, verbose);
    if (show) {
      txt += ' Resto: ' + this.resto;
      if (this.errors.length>0) {
        txt += '\nSe encontraron errores:\n' + this.showErrors();
      }
    }
    return txt;
  }

  toHtml(show=true) {
    const tag = '[DivisionResto.toHtml]';
    if ( debug ) console.log( tag );
    let html = super.toHtml();
    if (show) {
      html = html.substring(0, html.length-4);
      // const idnum = '0000';
      // const id = 'id="resto+' +idnum+ '"';
      // TODO: id para operaciones ( con randseed?? )
      const inputResto ='<input type="number" id="resto" class="resto" size=3 >';
      html +=' &nbsp; <br><span class="resto">Resto: ' + inputResto + '</span></p>';
    }
    return html;
  }

  toHtmlSolved() {
    const html = '<p>' + this.toString(true, true, true) + '</p>';
    return html;
  }

  formula() {
    const tag = '[formula]';
    if ( debug ) console.log( tag );
    const f = super.formula();
    const resto = this.resto;
    f.push(resto);
  }

  _generarDivisionPorMultiplicacionInvertida() {
    super._generarDivisionPorMultiplicacionInvertida();
  }

  generarNumerosOperandos() {
    // const debug = true;
    const tag = '[DivisionResto.generarNumerosOperandos] ';
    if ( debug ) console.log(tag);

    // let enfocado= this.enfocado;
    // //obtenemos operandos como si no fuera enfocado
    // if (this.enfocado)this.enfocado = false;

    if ( debug ) console.log( tag, 'enfocado', this.enfocado );
    super.generarNumerosOperandos(); // genera operandos de division entera -
    if ( debug ) console.log( tag, 'enfocado operandos antes', this.operandos );

    if (this.complementario && this.complementario>0) {
      return;
    }

    if ( debug ) {
      console.log(
          tag, 'operandos de super division entera:',
          this.operandos, '. resul: ', this.resultado );
    }

    // si el numero que define el nivel es el resultado lo generamos primero
    // if ( debug ) console.log(tag,'posicion nivel en resultado',
    // this.cantidad_operandos, this.posicion_nivel);
    if ( this.cantidad_operandos+1 == this.posicion_nivel ) {
      if ( debug ) console.log(tag, 'posicion nivel en resultado');
      // tambien generamos un resto para obligarle que sea distinto a cero
      this.resultado = this.numeroRandom(true, false, 1);

      this.resto = Math.abs(this.numeroRandom(true, false, 0, this.resultado));
      if ( debug ) {
        console.log(tag, 'resto al azar', this.resto,
            'tiene que ser menor que', this.resultado);
      }
    }
  }

  esRespuesta( respuestaUsuario ) {
    const tag = '[divisionResto.js.esRespuesta( respuestaUsuario )]';
    if ( debug ) console.log( tag, respuestaUsuario );
    if ( debug ) console.log( this.respuesta() );

    return ( JSON.stringify(respuestaUsuario) === JSON
        .stringify(this.respuesta()) );
  }

  respuesta() {
    const tag = '[divisionResto.js.respuesta()]';
    if ( debug ) console.log( tag );
    let respuesta = {};
    if (this.posicion_incognita != this.cantidad_operandos+1) {
      respuesta = {
        incognita: this.operandos[this.posicion_incognita-1],
        resto: this.resto,
      };
    } else {
      respuesta = {
        incognita: this.resultado,
        resto: this.resto,
      };
    }
    return respuesta;
  }

  toStringUserInput( input ) {
    const tag = '[divisionResto.js.toStringUserInput( input ) {]';
    if ( debug ) console.log( tag, input );

    const txtini = this.toString(true, true);
    const regex = /\[-?[0-9]+(.[0-9]+)?\]/gi;
    let txt = txtini.replace( regex, '[ '+ input.incognita +' ]');
    const regexResto = /(Resto: .+)$/gi;
    txt = txt.replace( regexResto, 'Resto: [ '+ input.resto +' ]');

    return txt;
  }

  getTipo() {
    return OPERACIONES.DIVISION_RESTO;
  }

  toPrint() {
    let html = '';
    let lastSymbol;
    const operandos = this.getOperandos();
    const inputIncognita = '<span class="input">&nbsp;</span>';
    for (let index = 0; index < operandos.length; index++) {
      let operan = operandos[index];
      if (operan<0 && lastSymbol == ' - ' ) operan = '('+operan+')';
      if (operan<0 && lastSymbol == ' + ' ) operan = '('+operan+')';
      operan = '<span class="operando">'+operan+'</span>';

      if (this.posicion_incognita - 1 == index) {
        operan = inputIncognita;
      }
      lastSymbol = `<span class="simbolo ${this.simbolo}">
          ${this.simbolo}</span>`;
      html += operan + lastSymbol;
    }
    html = html.substr(0, html.length - lastSymbol.length);

    let resultado = this.resultado;
    if (this.posicion_incognita == operandos.length + 1) {
      resultado = inputIncognita;
    } else {
      resultado = `<span class="resultado">${resultado}</span>`;
    }
    html += '<span class="simbolo igual"> = </span>'+ resultado;
    html += `<div class="resto">Resto: ${inputIncognita}</div>`;

    html = '<p class="operacion f-operacion">'+html+'</p>';

    return html;
  }
}
