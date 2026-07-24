
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
    decimales,
    decimalesMaximo,
  } = {}
  ) {
    const tag = '[DivisionEntera.constructor]';
    // const debug = true;
    if ( debug ) console.log( tag );
    if ( debug ) {
      console.log( tag, 'llamado con: \n\t',
          'nivel', nivel, '\n\t',
          'cantidadOperandos', cantidadOperandos, '\n\t',
          'permitirNegativos', permitirNegativos, '\n\t',
          'operandos', operandos, '\n\t',
          'incognita', incognita, '\n\t',
          'enfocado', enfocado, '\n\t',
          'posicion_nivel', posicion_nivel, '\n\t',
          'multiplo10', multiplo10, '\n\t',
          'multiplo100', multiplo100, '\n\t',
          'complementario', complementario, '\n\t');
    }
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
    });

    if ( debug ) {
      console.log( tag,
          'operandos', this.operandos,
          'operandosIniciales', operandosIniciales,
          'deep', this.deep );
    }
    if (err) this.errors.push(err);
    this.operandosIniciales = operandosIniciales;
    this.calcularResultado();

    this.simbolo = '/';
    this.tipo = 'division_entera';
    if ( multiplo10 || multiplo100) {
      this.generarNumerosOperandos();
      this.calcularResultado();
    }

    if ( debug ) {
      console.log( tag,
          'final constructor, operandos:', this.operandos, 'resultado', this.resultado );
    }
  }


  generarNumerosOperandos() {
    const tag = '[DivisionEntera.generarNumerosOperandos] ';
    if ( debug ) console.log(tag);

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
    // const debug= true;
    const tag = '[DivisionEntera._generarDivisionPorMultiplicacionInvertida]';
    if ( debug ) console.log( tag );
    if ( debug ) {
      console.log(tag, 'div: operandos division: ', this.operandos );
      console.log(tag, 'div: posicion incognita: ', this.posicion_incognita );
      console.log(tag, 'div: posicion nivel: ', this.posicion_nivel );
      console.log(tag, this.deep, 'deep' );
    }
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
      // if ( debug ) {
      //   console.log( tag, 'opciones multiplicación pre',
      //       JSON.stringify(opciones, null, 2) );
      // }
      if ( opciones.operandos[0] ) {
        opciones.resultado = opciones.operandos[0];
      }
      opciones.operandos = opciones.operandos.slice(1).reverse();
      // if (this.resultadoUsuario) opciones.operandos.unshift(this.resultado);
      opciones.operandos.unshift(undefined);
      // if ( debug ) {
      //   console.log( tag, 'opciones multiplicación post',
      //       JSON.stringify(opciones, null, 2) );
      // }
    }
    const mul = new Multiplicacion(Object.assign({}, opciones));

    // if ( debug ) {
    //   console.log(tag, 'pos incognita', mul.posicion_incognita );
    //   console.log(tag, 'enfocado', mul.enfocado );
    //   console.log(tag, 'pos nivel', mul.posicion_nivel );
    //   console.log(tag, 'nivel', mul.nivel );
    //   console.log(tag, 'operandos', JSON.stringify(mul.operandos) );
    //   console.log(tag, 'multiplicación invertida', mul );
    // }

    // this.revertirOperacionEnOtra(mul, this);
    const mulOperandos = mul.operandos.slice(1);
    mulOperandos.push(mul.resultado);
    // invierte una multiplicación para crear la division entera
    this.operandos = mulOperandos.reverse();
    if ( debug ) console.log(tag, 'this.operandos (division):', this.operandos);
    this.resultado = mul.operandos[0];
    this.posicion_incognita = this.cantidad_operandos+2 -mul.posicion_incognita;
    this.posicion_nivel = this.cantidad_operandos+2 -mul.posicion_nivel;

    // para evitar problem comprobamos que el resultado sea cierto:
    // let pruebaresul = this.operandos[0];
    // if ( debug ) {
    //   console.log(tag, 'operandos', JSON.stringify(mul.operandos) );
    // }
    const pruebaresul = this.dividirValores(this.operandos);
    let notanum = false;
    for (let i = 1; i < this.operandos.length; i++) {
      if ( isNaN(this.operandos[i]) ) notanum = true;
    }
    if ((pruebaresul !== this.resultado || notanum) && this.deep<20) {
      this.deep++;
      this.generarNumerosOperandos();
      // if ( debug ) {
      //   console.log( tag,
      //       'operandosIniciales', this.operandosIniciales,
      //       'cantidad operandos', this.cantidad_operandos
      //   );
      //   console.log(tag, 'nuevos num : ', this.operandos );
      //   console.log(tag, 'deep: ', this.deep );
      //   console.log('llamando calcular resultado desde ' + tag);
      // }
      this.calcularResultado();
    } else {
      // this.errors.push({
      //   error: 'tal',
      //   msg: 'no se puede calucal el resultado \n' + JSON.stringify(this)
      // });
      return false;
    }
  }

  calcularResultado() {
    // const debug = true;
    // let id = '['+ this.getRandomMinMax(0,100000)+ ']';
    // const tag = '[DivisionEntera.calcularResultado] ';
    const tag = this.id+'[DivisionEntera.calcularResultado] ';
    if ( debug ) console.log( tag );

    if (this.complementario) {
      if ( debug ) console.log(tag+ 'es complementario');
      this.resultado = this.complementario;
      this.resolverIncognita();
      return;
    }

    if (this.multiplo10 || this.multiplo100) {
      this.operandos_por_usuario = true;
      this.operandos.sort().reverse();
    }

    if ( debug ) {
      console.log( tag,
          'this.operandos_por_usuario', this.operandos_por_usuario );
    }

    if ( this.operandosIniciales && this.operandosIniciales!=[] ) {
      if ( debug ) {
        console.log( tag,
            'operandos iniciales', this.operandosIniciales );
      }
      if (this.operandosIniciales !== [] &&
        this.operandosInicialesLength() !== this.cantidad_operandos
      ) {
        if ( debug ) {
          console.log( tag,
              'generar division con operandos iniciales',
              this.operandosIniciales,
              'this.operandos', this.operandos );
        }
        this._generarDivisionPorMultiplicacionInvertida();
        if ( debug ) {
          console.log( tag, 'operandos generados por mulInvert',
              'this.operandos', this.operandos );
        }
        return;
      }
    }

    if (!this.operandos_por_usuario) {
      // if (this.posicion_nivel-1 == this.operandos.length)
      if ( debug ) {
        console.log( tag,
            'generar division', this.operandos );
      }
      this._generarDivisionPorMultiplicacionInvertida();
    } else {
      if ( debug ) {
        console.log('operandos por usuario',
            this.operandos_por_usuario);
      }
      this.resultado = this.dividirValores(this.operandos);

      if ( this.resultado % 1 == 0) {
        this.errors.push({
          'error': 'Resultado no es entero',
          'msg': 'los datos que se enviaron generar un resultado con decimales ',
        });
      }
    }
  }

  _generarOperandosComplementario() {
    const tag = '[DivisionEntera._generarOperandosComplementarios]';
    if ( debug ) console.log(tag);

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
    if ( debug ) {
      console.log('obtener mul de', this.complementario,
          ' hasta ', maximo, ' resultado:', mulResultado);
    }


    // escojemos uno al azar como primer operador :
    const rmul = Math.floor( Math.random()*(mulResultado.length-2)+2 );
    this.operandos[0] = mulResultado[rmul];
    const divisor = rmul+2;
    const factores = this.factorizar(divisor);
    const factoresRestantes = factores;
    let nFactoresRestantes = factores.length;
    const grupoFactores = [];

    if ( debug ) console.log(tag, 'factores de '+ divisor, factores, 'rmul', rmul);


    if (this.cantidad_operandos == 2) {
      this.operandos[1]= divisor;
      return;
    }
    let operandosRestantes = this.cantidad_operandos-1;

    for (let grupoN = 1; grupoN < this.cantidad_operandos; grupoN++) {
      // const op = this.operandos[index];
      const maxSize = Math.ceil(nFactoresRestantes/operandosRestantes);
      let groupSize;

      if ( maxSize>2 ) {
        // entre 1 y maxSize
        groupSize = Math.round( Math.random()*(maxSize-1) ) +1;
      } else groupSize = 1;
      if ( operandosRestantes == 1 ) {
        groupSize = maxSize;
      }
      grupoFactores[grupoN] = [];
      let op;
      if ( nFactoresRestantes > 0) {
        for (let index = 0; index < groupSize; index++) {
          const r = Math.floor(Math.random()*nFactoresRestantes);
          if ( debug ) console.log( tag, 'factor que se agrega a grupo:', factores[r] );
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
    // this.operandos = operandos_temp;
  }

  resolverIncognita() {
    const tag = '[DivisionEntera.resolverIncognita()] ';
    if ( debug ) console.log(tag);
    const posIncognita = this.posicion_incognita-1;
    if ( debug ) {
      console.log(tag,
          (posIncognita !== this.cantidad_operandos),
          'pos incognita', posIncognita);
    }
  }

  obtenerSimbolo() {
    return '/';
  }
  getTipo() {
    return OPERACIONES.DIVISION_ENTERA;
  }

  comprobarResultado() {
    const tag = '[Division.comprobarResultado]';
    if ( debug ) console.log( tag );
    if ( debug ) {
      console.log( tag,
          'this.resultadoNegativo', this.resultadoNegativo,
          'this.permitir_negativos', this.permitir_negativos );
    }

    if ( this.resultadoNegativo || this.permitir_negativos ) {
      console.log( tag, 'grabar error negativos divisiones', this.errors );
      this.errors.push({
        error: 'Division con negativos / resultado negativo',
        msg: 'no se puede permiten números negativos en las divisiones'});
      // console.log( tag, 'grabar error negativos divisiones', this.errors );
      return {resultado: false};
    }

    return super.comprobarResultado();
  }

  getTipo() {
    return OPERACIONES.DIVISION_ENTERA;
  }
}
