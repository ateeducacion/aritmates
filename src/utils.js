 
import './debug.js';

function sameElements(array1, array2) {
  if (array1.length !== array2.length) return false;
  for (let i = 0; i < array1.length; i++) {
    if (!Object.is(array1[i], array2[i])) return false;
  }
  return true;
}
/**
* Funciones útiles
*/

/**
 * Distintas funciones que se pueden ser utilidad
 * 
 * @author Fernando Ramirez <fernando.ramirez@altia.es>
 * @author Área de Tecnología Educativa <ate.educacion@gobiernodecanarias.org> (versión simplificada 1.3+)
 * @version 1.0.0-rc1
 *
 * @class Utils
 */
class Utils {
  constructor() {
  }

  /**
   * Convierte un string estilo "1:00" en "60"
   * @param {str} t tiempo
   * @return {number} segundos
   */
  strTiempoASegundos( t ) {
    const time = t.split(':');
    const a = parseInt(time[0])*60 + parseInt(time[1]);
    return a;
  }

  /**
   * Rellena el str con tantos caracteres sean necesarios parar completar el
   * numero de caracteres
   *
   * @param {str} str
   * @param {number} numCaracteres
   * @param {str} relleno
   * @return {str}
   */
  rellenaIzq(str, numCaracteres, relleno) {
    str = str.toString();
    const cfalta = numCaracteres - str.length;
    if (cfalta >0) {
      return relleno.repeat(cfalta) + str;
    }
    return str;
  }

  /**
   * Convierte milisegundos en string de estilo: "01:03"
   * @param {int} milis Milisegundos
   * @return {str} del tipo '01:30'
   */
  milisToMinSg(milis) {
    let seconds = Math.floor( (milis/1000) % 60 );
    let minutes = Math.floor( (milis/1000/60) % 60 );
    seconds = this.rellenaIzq(seconds.toString(), 2, '0');
    minutes = this.rellenaIzq(minutes.toString(), 2, '0');
    return minutes + ':' + seconds;
  }

  /**
   * Convierte segundos en string de estilo: "1:03"
   * @param {int} sg segundos
   * @return {str} del tipo '1:30'
   */
  sgToMinSg(sg) {
    let seconds = Math.floor( (sg) % 60 );
    const minutes = Math.floor( (sg/60) % 60 );
    seconds = this.rellenaIzq(seconds.toString(), 2, '0');
    return minutes + ':' + seconds;
  }

  /**
   * Compara si [1,2] es similar a [2,1] verdadero!
   * sin embargo es falso si tienen distinto tamaño y valores
   * [1,2,3] no es [2,1]
   * @param {Array} array1
   * @param {Array} array2
   * @return {boolean}
   */
  isArraysCompareSimilar(array1, array2) {
    if ( !(array1 instanceof Array && array2 instanceof Array) ) return false;

    if (array1.length == array2.length) {
      return sameElements(array1, array2);
    } else {
      return false;
    }
  }

  /**
   * Busca un array en un array de arrays
   * ej. busca [1,2] en [[0],[3,4],[1,2]]
   * @param {Array} aguja Array a buscar en el pajar
   * @param {Array} pajar Array de arrays
   * @return {integer} posicion de aguja en pajar o -1 si no lo encuentra
   */
  findArrayInArray(aguja, pajar) {

    let place = -1;
    pajar.some( (el, indx) => {
      if (this.isArraysCompareSimilar(el, aguja)) {
        place = indx;
        return true;
      }
      return false;
    });

    return place;
  }

  alphabetArray() {
    const alf = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return alf;
  }
  /**
   * Shuffles array in place. ES6 version
   * @param {Array} a items An array containing the items.
   * @return {Array}
   */
  shuffle(a, random = Math.random) {
    const next = typeof random === 'function' ? random : Math.random;
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  organizeInTables(data, columns, tableClass, celClass, maxRows, rows2=maxRows ) {
    let txt = '';
    const colunmnas = columns;
    let cantidadCeldas = data.length;
    let celdasEscritas = 0;
    let celdasPorTabla = cantidadCeldas;
    if ( maxRows ) {
      celdasPorTabla = Math.floor(maxRows * columns);
    }
    cantidadCeldas++; // +1 por que i empieza en 1 s
    let tablas = 0;
    do {
      tablas++;
      let trAbierto = true;
      if (tablas>1) {
        txt += '<table class="'+tableClass+'"><tr>';
        celdasPorTabla = Math.floor(rows2 * columns);
      } else {
        txt += '<table class="'+tableClass+' primera"><tr>';
      }
      for (let i = celdasEscritas+1; (i <= celdasPorTabla*tablas && celdasEscritas+1 < cantidadCeldas ); i++) {
        const celData = data[i-1];
        if (i % colunmnas+1 == 0 ) {
          txt += '<tr>';
          trAbierto = true;
        }
        txt += `<td class="${celClass}"><span class="num">${i}.)</span> ${celData} </td>`;
        if (i % colunmnas == 0 ) {
          txt += '</tr>';
          trAbierto = false;
        }
        celdasEscritas++;
      }
      if (trAbierto) txt+= '</tr>';
      txt += '</tr></table>';
    } while (celdasEscritas+1 < cantidadCeldas && celdasEscritas<1000);

    return txt;
  }

  organizeInLines( data, classLine ) {
    let html = '';
    for (let i = 0; i < data.length; i=i+2) {
      const el = data[i];
      let el2='';
      if (i+1 < data.length) {
        el2 = data[i+1];
      }
      const ihtml = `
      <div class="${classLine}">
        ${i+1}) ${el}
        <span class="separator">&nbsp;</span>
        ${i+2}) ${el2}
      </div>`;

      html = html + ihtml;
    }
    return html;
  }

  organizeSimpleNum( data, classLine ) {
    let html = '';
    for (let i = 0; i < data.length; i++) {
      const el = data[i];
      const ihtml = `
      <div class="${classLine}">
        ${i+1}) ${el}
      </div>`;
      html = html + ihtml;
    }
    return html;
  }
}

// probe findArrayInArray de esta manera pero no va por que llama a this
// supongo que tiene que haber una forma de que funcione

export default new Utils();
export const {shuffle} = new Utils();
