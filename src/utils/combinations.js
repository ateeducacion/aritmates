/**
 * Genera combinaciones de un array (compatible con el paquete `combinations`).
 * Mismo comportamiento que combinations@1.0.0:
 * - min por defecto 1
 * - incluye subconjuntos de tamaño 1..n-1 y el conjunto completo
 *
 * @param {Array} a
 * @param {number} [min=1]
 * @param {number} [max]
 * @return {Array<Array>}
 */
export default function combinations(a, min, max) {
  min = min || 1;
  max = max < a.length ? max : a.length;
  const fn = function(n, src, got, all) {
    if (n == 0) {
      if (got.length > 0) {
        all[all.length] = got;
      }
      return;
    }
    for (let j = 0; j < src.length; j++) {
      fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
    }
  };
  const all = [];
  for (let i = min; i < a.length; i++) {
    fn(i, a, [], all);
  }
  if (a.length == max) all.push(a);
  return all;
}
