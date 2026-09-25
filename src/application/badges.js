/**
 * Badge thresholds shown on the results screen.
 * The UI only reveals the icons these functions name.
 *
 * Score is correct answers over the exercise count (default 10).
 * Speed compares time spent with the countdown the user chose, in seconds.
 */

export function scoreBadges(puntuacion, maximo = 10) {
  if (!puntuacion) {
    return {bronze: false, silver: false, gold: false, platinum: false, perfect: false};
  }
  const ratio = puntuacion / maximo;
  return {
    bronze: ratio > 0,
    silver: ratio > 0.25,
    gold: ratio > 0.5,
    platinum: ratio > 0.75,
    perfect: ratio === 1,
  };
}

export function speedBadges(tiempoGastadoMs, maximoSeconds) {
  if (!maximoSeconds) {
    return {bronze: false, silver: false, gold: false, platinum: false};
  }
  const maximoMs = maximoSeconds * 1000;
  const ratio = tiempoGastadoMs / maximoMs;
  if (ratio === 1) {
    return {bronze: false, silver: false, gold: false, platinum: false};
  }
  return {
    bronze: ratio < 1,
    silver: ratio < 0.75,
    gold: ratio < 0.5,
    platinum: ratio < 0.2,
  };
}
