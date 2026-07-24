import DivisionDecimal from './divisionDecimales';
import DivisionEntera from './divisionEntera';

// import Operacion from './operacion';
/**
 * Operación División
 *
 * @author Fernando Ramírez Pérez
 * @author Área de Tecnología Educativa (versión simplificada 1.3+)
 * @export
 * @class Division
 */
export default class Division {
  constructor( {
    nivel, lower_bound, upper_bound, cantidadOperandos, permitirNegativos,
    operandos = [], incognita = cantidadOperandos + 1, enfocado, posicion_nivel,
    multiplo10 = false,
    multiplo100 = false, complementario = false, resultado = null,
    resultadoNegativo, decimales = false, decimalesMaximo} = {}
  ) {
    const tag = '[Division]';
    if ( debug ) console.log( tag );
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

    let division;
    if ( debug ) console.log( tag, 'decimales', decimales );
    if (decimales) {
      division = new DivisionDecimal({
        nivel: nivel,
        lower_bound: lower_bound,
        upper_bound: upper_bound,
        cantidadOperandos: cantidadOperandos,
        permitirNegativos: permitirNegativos,
        operandos: operandos,
        incognita: incognita,
        enfocado: enfocado,
        posicion_nivel: posicion_nivel,
        multiplo10: multiplo10,
        multiplo100: multiplo100,
        complementario: complementario,
        resultadoNegativo: resultadoNegativo,
        decimalesMaximo: decimalesMaximo}
      );
    } else {
      division = new DivisionEntera({
        nivel, lower_bound, upper_bound, cantidadOperandos, permitirNegativos,
        operandos, incognita, enfocado, posicion_nivel, multiplo10,
        multiplo100, complementario,
        resultadoNegativo}
      );
    }
    return division;
  }
  getTipo() {
    return OPERACIONES.Division;
  }
}
