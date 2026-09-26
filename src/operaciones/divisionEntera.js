
import Operacion from './operacion';
import Multiplicacion from './multiplicacion';
import OPERACIONES from './operaciones';
/**
 * Operacion division entera
 *
 * @author Fernando Ramírez Pérez
 * @author Área de Tecnología Educativa (versión simplificada 1.3+)
 * @export
 * @class DivisionEntera
 * @extends {Operacion}
 */
export default class DivisionEntera extends Operacion {
  // darle la vuelta a una multiplicación para hacer division entera
  constructor({
    nivel,
    lower_bound,
    upper_bound,
    cantidadOperandos,
    permitirNegativos,
    operandos=[],
    incognita,
    enfocado,
    posicion_nivel,
    multiplo10 = false,
    multiplo100 = false,
    complementario = false,
    resultadoNegativo,
    decimalesMaximo,
    random,
  } = {}
  ) {
    let err;
    if ( permitirNegativos ) {
      err = {
        'error': 'Escogió division con números negativos',
        'msg': 'No se permiten divisiones negativas',
      };
      permitirNegativos = false;
    }
    if ( !upper_bound ) upper_bound = nivel;
    if ( !lower_bound ) lower_bound = 1;
    let operandosIniciales;
    if ( operandos ) operandosIniciales = operandos.slice(0);

    super({
      nivel: nivel, lower_bound: lower_bound, upper_bound: upper_bound,
      cantidadOperandos: parseInt(cantidadOperandos),
      permitirNegativos: permitirNegativos,
      operandos: operandos, incognita: incognita, enfocado: enfocado,
      posicion_nivel: posicion_nivel,
      multiplo10: multiplo10, multiplo100: multiplo100,
      complementario: complementario,
      resultadoNegativo: resultadoNegativo,
      decimalesMaximo: decimalesMaximo,
      random,
    });

    if (err) this.errors.push(err);
    this.operandosIniciales = operandosIniciales;
    this.calcularResultado();

    this.simbolo = '/';
    this.tipo = 'division_entera';
    if ( multiplo10 || multiplo100) {
      this.generarNumerosOperandos();
      this.calcularResultado();
    }

  }


  generarNumerosOperandos() {

    if (this.complementario && this.complementario>0) {
      super.generarNumerosOperandos();
      return;
    }

    this.operandos = [];

    if ( this.multiplo100 || this.multiplo10 ) {
      super.generarNumerosOperandos();
    } else {
      if (this.lower_bound==0) this.lower_bound=1;
      this.posicion_nivel = 2; // para que enfocado siempre este en el divisor
      super.generarNumerosOperandos();

      // enfocado siempre en el divisor:
      for (let index = 0; index < this.cantidad_operandos; index++) {
        if (this.posicion_nivel - 1 == index && this.enfocado ) {
          this.operandos[index] = this.nivel;
        }
      }
    }
  }

  _generarDivisionPorMultiplicacionInvertida() {
    const posIncognitaInvertida = this.cantidad_operandos+2 -
        this.posicion_incognita;
    const opciones = {
      nivel: this.nivel,
      lower_bound: this.lower_bound,
      upper_bound: this.upper_bound,
      cantidadOperandos: this.cantidad_operandos,
      permitirNegativos: this.permitir_negativos,
      incognita: posIncognitaInvertida,
      enfocado: this.enfocado,
      posicion_nivel: 2,
      multiplo10: this.multiplo10,
      multiplo100: this.multiplo100,
      decimales: this.decimales,
      decimalesMaximo: this.decimalesMaximo,
    };

    if ( this.operandosIniciales && this.operandosIniciales != []) {
      opciones.operandos = this.operandosIniciales.slice();
      if ( opciones.operandos[0] ) {
        opciones.resultado = opciones.operandos[0];
      }
      opciones.operandos = opciones.operandos.slice(1).reverse();
      opciones.operandos.unshift(undefined);
    }
    const mul = new Multiplicacion(Object.assign({random: this._rng}, opciones));


    const mulOperandos = mul.operandos.slice(1);
    mulOperandos.push(mul.resultado);
    // invierte una multiplicación para crear la division entera
    this.operandos = mulOperandos.reverse();
    this.resultado = mul.operandos[0];
    this.posicion_incognita = this.cantidad_operandos+2 -mul.posicion_incognita;
    this.posicion_nivel = this.cantidad_operandos+2 -mul.posicion_nivel;

    // para evitar problem comprobamos que el resultado sea cierto:
    const pruebaresul = this.dividirValores(this.operandos);
    let notanum = false;
    for (let i = 1; i < this.operandos.length; i++) {
      if ( isNaN(this.operandos[i]) ) notanum = true;
    }
    if ((pruebaresul !== this.resultado || notanum) && this.deep<20) {
      this.deep++;
      this.generarNumerosOperandos();
      this.calcularResultado();
    } else {
      return false;
    }
  }

  calcularResultado() {

    if (this.complementario) {
      this.resultado = this.complementario;
      this.resolverIncognita();
      return;
    }

    if (this.multiplo10 || this.multiplo100) {
      this.operandos_por_usuario = true;
      this.operandos.sort().reverse();
    }


    if (this.operandosIniciales &&
        this.operandosInicialesLength() !== this.cantidad_operandos
    ) {
      this._generarDivisionPorMultiplicacionInvertida();
      return;
    }

    if (!this.operandos_por_usuario) {
      this._generarDivisionPorMultiplicacionInvertida();
    } else {
      this.resultado = this.dividirValores(this.operandos);

      if ( this.resultado % 1 != 0) {
        this.errors.push({
          'error': 'Resultado no es entero',
          'msg': 'los datos que se enviaron generar un resultado con decimales ',
        });
      }
    }
  }

  _generarOperandosComplementario() {

    let maximo = 500;
    if (this.cantidad_operandos>2) {
      maximo = maximo * this.cantidad_operandos;
    }
    // TODO revisar según resultados que surjan
    if (this.complementario==100) {
      maximo = 1000 * this.cantidad_operandos;
    }

    // multiplos de 10 hasta 100
    // 10*2 = 20; 30;40..100
    // 40/[ ]= 10  -> 40/10 = 4; 40/[4] =10
    // pero si son varios
    // 40 / [  ]   / [   ]  = 10
    // el segundo tiene que ser menor que 40 para ser positivo si decimales y
    // ser un factor de 4 =>
    // 40 / [2]/[2] = 10
    const mulResultado= this.obtenerMultiplosHasta(this.complementario, maximo);


    // escojemos uno al azar como primer operador :
    const rmul = Math.floor( this.rng()*(mulResultado.length-2)+2 );
    this.operandos[0] = mulResultado[rmul];
    const divisor = rmul+2;
    const factores = this.factorizar(divisor);
    const factoresRestantes = factores;
    let nFactoresRestantes = factores.length;
    const grupoFactores = [];


    if (this.cantidad_operandos == 2) {
      this.operandos[1]= divisor;
      return;
    }
    let operandosRestantes = this.cantidad_operandos-1;

    for (let grupoN = 1; grupoN < this.cantidad_operandos; grupoN++) {
      const maxSize = Math.ceil(nFactoresRestantes/operandosRestantes);
      let groupSize;

      if ( maxSize>2 ) {
        // entre 1 y maxSize
        groupSize = Math.round( this.rng()*(maxSize-1) ) +1;
      } else groupSize = 1;
      if ( operandosRestantes == 1 ) {
        groupSize = maxSize;
      }
      grupoFactores[grupoN] = [];
      let op;
      if ( nFactoresRestantes > 0) {
        for (let index = 0; index < groupSize; index++) {
          const r = Math.floor(this.rng()*nFactoresRestantes);
          grupoFactores[grupoN].push( factoresRestantes[r] );
          factoresRestantes.splice(r, 1);
          nFactoresRestantes--;
        }

        op = this.multiplicarValores(grupoFactores[grupoN]);
      } else {
        op = 1;
      }

      this.operandos[grupoN]= op;
      operandosRestantes -= 1;
    }
  }

  /**
   * Sin efecto: evita que se ejecute la versión de Operacion.
   */
  resolverIncognita() {}

  obtenerSimbolo() {
    return '/';
  }
  getTipo() {
    return OPERACIONES.DIVISION_ENTERA;
  }

  comprobarResultado() {

    if ( this.resultadoNegativo || this.permitir_negativos ) {
      this.errors.push({
        error: 'Division con negativos / resultado negativo',
        msg: 'no se puede permiten números negativos en las divisiones'});
      return {resultado: false};
    }

    return super.comprobarResultado();
  }
}
