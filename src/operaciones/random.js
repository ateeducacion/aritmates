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

/**
 * @param {unknown} random
 * @return {() => number}
 */
export function asRandom(random) {
  return typeof random === 'function' ? random : Math.random;
}
