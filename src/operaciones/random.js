/**
 * Injectable randomness for exercise generation.
 *
 * Production passes nothing and uses Math.random.
 * Tests pass seededRandom(seed) and can replay a failure exactly.
 *
 * The generator is mulberry32: a few lines, no dependency, and a stable
 * sequence for a given uint32 seed.
 */

/**
 * @param {number} seed
 * @return {() => number} values in [0, 1)
 */
export function seededRandom(seed) {
  let state = seed >>> 0;
  if (state === 0) state = 0x6d2b79f5;
  return function mulberry32() {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let defaultRandom = Math.random;

/**
 * Override the default generator used when callers do not inject one.
 * Intended for the test harness only; production never calls this.
 *
 * @param {() => number} random
 */
export function setDefaultRandom(random) {
  if (typeof random !== 'function') throw new TypeError('random must be a function');
  const previous = defaultRandom;
  defaultRandom = random;
  return previous;
}

/** Reset the default generator to the browser/runtime source. */
export function resetDefaultRandom() {
  defaultRandom = Math.random;
}

/**
 * @param {unknown} random
 * @return {() => number}
 */
export function asRandom(random) {
  return typeof random === 'function' ? random : defaultRandom;
}


/**
 * Devuelve un entero entre min y max con el redondeo histórico del motor.
 *
 * Se conserva Math.round de forma deliberada: cambiar a una distribución
 * uniforme alteraría la secuencia de ejercicios de todas las semillas.
 *
 * @param {() => number} random
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
export function roundedBetween(random, min, max) {
  return Math.round(random() * (max - min) + min);
}

/**
 * Devuelve -1 o 1 usando exactamente la regla histórica del motor.
 *
 * @param {() => number} random
 * @return {-1|1}
 */
export function randomSign(random) {
  return Math.round(random()) === 0 ? -1 : 1;
}
