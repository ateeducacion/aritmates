
/**
 * Dado el tiempo en formato 1:00 te devuelve el indice donde esta ese valor
 * @author Fernando Ramirez <fernando.ramirez@altia.es>
 * @author Área de Tecnología Educativa (versión simplificada 1.3+)
 * @param {string} valorTexto
 * @return {number} Indice de el valor de cronometro
 */
function keyCrono(valorTexto) {
    // console.log('keyCrono', valorTexto, textoCrono.indexOf(valorTexto) );
    return textoCrono.indexOf(valorTexto);
}

/**
 * Dado el indicie devuelve la cadena de texto con el tiempo
 * @author Fernando Ramirez <fernando.ramirez@altia.es>
 * @param {number} x Indice del cor
 * @return {string} texto con el tiempo "1:00"
 */
function valoresCrono(x) {
    x = parseInt(x);
    return textoCrono[x];
}


// --- sliders ----------------
// valores nivel para slider ( del 1 al 23 )
const keyNivel = [];
for (let index = 1; index < 21; index++) {
    keyNivel[index] = index;
}
for (let index = 21; index < 51; index++) {
    keyNivel[index] = 20;
}
keyNivel[50] = 21;
for (let index = 51; index < 100; index++) {
    keyNivel[index] = 21;
}
keyNivel[100] = 22;
for (let index = 101; index < 500; index++) {
    keyNivel[index] = 22;
}
keyNivel[500] = 23;
// -- fin valores nivel para slider
const textoCrono = [
    '', '0:30', '1:00', '2:00', '3:00',
    '4:00', '5:00', '10:00', '20:00', '30:00'];


export {
    keyCrono,
    valoresCrono,
    keyNivel,
    textoCrono
};