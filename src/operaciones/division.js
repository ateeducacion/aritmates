import DivisionDecimal from './divisionDecimales';
import DivisionEntera from './divisionEntera';
import OPERACIONES from './operaciones';

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
    multiplo100 = false, complementario = false,
    resultadoNegativo, decimales = false, decimalesMaximo, random} = {}
  ) {

    let division;
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
        decimalesMaximo: decimalesMaximo,
        random}
      );
    } else {
      division = new DivisionEntera({
        nivel, lower_bound, upper_bound, cantidadOperandos, permitirNegativos,
        operandos, incognita, enfocado, posicion_nivel, multiplo10,
        multiplo100, complementario,
        resultadoNegativo, random}
      );
    }
    return division;
  }
  getTipo() {
    return OPERACIONES.Division;
  }
}
