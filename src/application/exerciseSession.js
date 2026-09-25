/**
 * Estado y transiciones puras de una sesión de ejercicios.
 */

export function createSessionScore() {
  return {
    puntuacion: 0,
    completados: 0,
    aciertos: 0,
    fallos: 0,
    tiempoConsumido: 0,
    tiempoMedioEjercicio: 0,
    operacionesMal: [],
  };
}

export function addQuestionTime(score, durationMs, configuredOperations) {
  score.tiempoConsumido += durationMs;
  score.tiempoMedioEjercicio =
    score.tiempoConsumido / configuredOperations;
  return score;
}

export function recordAnswer(score, {index, answer, correct}) {
  if (answer != '') {
    score.completados++;
    if (correct) {
      score.aciertos++;
    } else {
      score.fallos++;
      score.operacionesMal[index] = answer;
    }
  } else {
    score.fallos++;
    score.operacionesMal[index] = answer;
  }
  return score;
}

export function nextOperation(currentIndex, operationCount) {
  const index = currentIndex + 1;
  if (index >= operationCount) {
    return {index: 0, finished: true};
  }
  return {index, finished: false};
}

export function shouldReloadInfiniteOperations({
  configuredOperations,
  currentIndex,
  reloadEvery,
}) {
  return (
    configuredOperations == 0 &&
    (currentIndex + 1) % reloadEvery == 0
  );
}
