
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
    random,
  } = {}) {
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
      random,
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
    // calcula el resultado y buca operandos para resultado entero
    super.calcularResultado();


    if (this.operandos_por_usuario) {
    }

    const dividendo = this.operandos[0];
    let divisor = this.operandos[1];
    if (this.cantidad_operandos>2) {
      // si hay mas de dos operandos el divisor es la mul de todos los
      // poteriores al primero
      divisor = this.multiplicarValores(
          this.operandos.slice(1, this.operandos.length)
      );
    }

    this.resto = new Decimal(dividendo).modulo(divisor);
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
          minMultiplo = Math.min(...factores);
        } else {
          minMultiplo = 1;
        }

        this.resto = Math.round(this.rng()*(minMultiplo-1))+1;
      }

      if (this.operandos[0]<0) this.resto *= -1;
      this.operandos[0] += this.resto;

      // dejamos como resultado solo la parte entera
      this.resultado = calcResultado();

      // el resto es negativo si el dividendo es negativo, pero para
      // simplificar en el input, lo dejamos como positivo
      this.resto = new Decimal(this.operandos[0]).modulo(divisor)
          .abs().toString();

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
    let html = super.toHtml();
    if (show) {
      html = html.substring(0, html.length-4);
      // TODO: id para operaciones ( con randseed?? )
      const inputResto ='<input type="number" id="resto" class="resto" size=3 >';
      html +=' &nbsp; <br><span class="resto">Resto: ' + inputResto + '</span></p>';
    }
    return html;
  }

  generarNumerosOperandos() {


    super.generarNumerosOperandos(); // genera operandos de division entera -

    if (this.complementario && this.complementario>0) {
      return;
    }


    // si el numero que define el nivel es el resultado lo generamos primero
    // if ( debug ) console.log(tag,'posicion nivel en resultado',
    // this.cantidad_operandos, this.posicion_nivel);
    if ( this.cantidad_operandos+1 == this.posicion_nivel ) {
      // tambien generamos un resto para obligarle que sea distinto a cero
      this.resultado = this.numeroRandom(true, false, 1);

      this.resto = Math.abs(this.numeroRandom(true, false, 0, this.resultado));
    }
  }

  esRespuesta( respuestaUsuario ) {

    return ( JSON.stringify(respuestaUsuario) === JSON
        .stringify(this.respuesta()) );
  }

  respuesta() {
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

    const txtini = this.toString(true, true);
    const regex = /\[-?[0-9]+(.[0-9]+)?\]/gi;
    let txt = txtini.replace( regex, '[ '+ input.incognita +' ]');
    const regexResto = /(Resto: .+)$/gi;
    txt = txt.replace( regexResto, 'Resto: [ '+ input.resto +' ]');

    return txt;
  }

  /** @inheritdoc */
  requiereCocienteEntero() {
    return false;
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
