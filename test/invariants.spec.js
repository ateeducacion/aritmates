import Suma from '../src/operaciones/suma';
import Resta from '../src/operaciones/resta';
import Multiplicacion from '../src/operaciones/multiplicacion';
import DivisionEntera from '../src/operaciones/divisionEntera';
import OperacionMultiple from '../src/operaciones/OperacionMultiple';
import {asRandom, seededRandom, setDefaultRandom} from '../src/operaciones/random';
import {evaluateArithmetic} from '../src/operaciones/evaluate';
import {
  subtractionsAsNegativeSums,
  groupSimilarOperations,
} from '../src/operaciones/expression';
import OPERACIONES from '../src/operaciones/operaciones';
import {TIPO_NUMERO} from '../src/operaciones/tipoNumero';
import {scoreBadges, speedBadges} from '../src/application/badges';
import {createSessionTimer} from '../src/application/timer';
import {canEnableNegativeResult, operationAvailability, requiresTwoOperands} from '../src/application/optionAvailability';
import {addQuestionTime, createSessionScore, nextOperation, recordAnswer, shouldReloadInfiniteOperations} from '../src/application/exerciseSession';
import {countDecimalOperands, countFollowingOperands, countNegativeOperands, decimalPlaces, decimalPlacesForLevel, multiplesUntil} from '../src/operaciones/numberRules';
import {factorize} from '../src/operaciones/factorization';

const expect = require('chai').expect;

describe('Fuente aleatoria', () => {
  it('permite fijar y restaurar el generador por defecto sin tocar Math.random', () => {
    const originalMathRandom = Math.random;
    const previous = setDefaultRandom(seededRandom(123));
    const first = asRandom()();
    setDefaultRandom(seededRandom(123));
    expect(asRandom()()).to.equal(first);
    expect(Math.random).to.equal(originalMathRandom);
    setDefaultRandom(previous);
  });

  it('rechaza fuentes no funcionales', () => {
    expect(() => setDefaultRandom(null)).to.throw(TypeError);
  });
});

describe('Invariantes del motor', () => {
  const seeds = [];
  for (let seed = 1; seed <= 25; seed++) seeds.push(seed);

  it('suma: a + b coincide con el resultado y no hay negativos', () => {
    seeds.forEach((seed) => {
      const op = new Suma({nivel: 10, random: seededRandom(seed)});
      expect(op.operandos).to.have.length(2);
      const sum = op.operandos.reduce((a, b) => a + b, 0);
      expect(sum).to.equal(Number(op.resultado));
      op.operandos.forEach((n) => expect(n).to.be.at.least(0));
    });
  });

  it('resta sin negativos: el resultado no es negativo', () => {
    seeds.forEach((seed) => {
      const op = new Resta({nivel: 12, permitirNegativos: false, random: seededRandom(seed)});
      expect(Number(op.resultado)).to.be.at.least(0);
    });
  });

  it('multiplicación: el producto de los operandos es el resultado', () => {
    seeds.forEach((seed) => {
      const op = new Multiplicacion({nivel: 9, random: seededRandom(seed)});
      const product = op.operandos.reduce((a, b) => a * b, 1);
      expect(product).to.equal(Number(op.resultado));
    });
  });

  it('división entera: no divide por cero y el cociente es exacto', () => {
    seeds.forEach((seed) => {
      const op = new DivisionEntera({nivel: 10, random: seededRandom(seed)});
      expect(op.operandos[1]).to.not.equal(0);
      expect(op.operandos[0] % op.operandos[1]).to.equal(0);
      expect(op.operandos[0] / op.operandos[1]).to.equal(Number(op.resultado));
    });
  });

  it('el evaluador aritmético coincide con JavaScript en el subconjunto permitido', () => {
    const samples = [
      '1+2*3',
      '21 - (-3) + 126 / 21',
      '(2+3)*4',
      '8/2',
      '3 * 2 + 5',
      '50 - 4 * 552 / 46',
    ];
    samples.forEach((expr) => {
      const js = Function(`"use strict"; return (${expr});`)();
      expect(evaluateArithmetic(expr)).to.equal(js);
    });
  });

  it('convertir restas en sumas con signo conserva el valor', () => {
    const rewritten = subtractionsAsNegativeSums(
        [10, 3, 2],
        [OPERACIONES.RESTA, OPERACIONES.SUMA],
    );
    expect(rewritten.operaciones).to.deep.equal([OPERACIONES.SUMA, OPERACIONES.SUMA]);
    const original = 10 - 3 + 2;
    const asSums = rewritten.operandos.reduce((a, b) => a + b, 0);
    expect(asSums).to.equal(original);
  });
});

describe('Agrupación de expresiones', () => {
  it('agrupa operadores consecutivos sin depender de OperacionMultiple', () => {
    const groups = groupSimilarOperations(
        [OPERACIONES.SUMA, OPERACIONES.SUMA, OPERACIONES.MULTIPLICACION],
    );
    expect(groups[0]).to.deep.include({
      tipo: OPERACIONES.SUMA,
      cantidadOperandos: 3,
    });
    expect(groups[2]).to.deep.include({
      tipo: OPERACIONES.MULTIPLICACION,
      cantidadOperandos: 2,
    });
  });

  it('conserva operandos y posiciones cuando vienen del usuario', () => {
    const groups = groupSimilarOperations(
        [OPERACIONES.SUMA, OPERACIONES.SUMA],
        [2, 3, 4],
        true,
    );
    expect(groups[0].operandos).to.deep.equal([2, 3, 4]);
    expect(groups[0].posicionOperadores).to.deep.equal([0, 1, 2]);
  });
});

describe('Insignias de resultados', () => {
  it('puntuación 0 no muestra insignias', () => {
    expect(scoreBadges(0).bronze).to.equal(false);
  });

  it('puntuación perfecta activa todas', () => {
    const badges = scoreBadges(10, 10);
    expect(badges.perfect).to.equal(true);
    expect(badges.platinum).to.equal(true);
  });

  it('gastar exactamente el tiempo no da insignia de velocidad', () => {
    const badges = speedBadges(60000, 60);
    expect(badges.bronze).to.equal(false);
  });

  it('gastar menos del 20% da platino', () => {
    expect(speedBadges(10000, 60).platinum).to.equal(true);
  });
});


describe('Reglas numéricas puras', () => {
  it('genera múltiplos hasta alcanzar el límite', () => {
    expect(multiplesUntil(5, 16)).to.deep.equal([10, 15, 20]);
  });

  it('cuenta decimales incluyendo notación exponencial', () => {
    expect(decimalPlaces(22.111)).to.equal(3);
    expect(decimalPlaces('1.23e-2')).to.equal(4);
    expect(decimalPlaces(10)).to.equal(0);
  });

  it('cuenta operandos definidos después de una posición', () => {
    expect(countFollowingOperands([1, undefined, 3, null, 5], 0, 5)).to.equal(2);
    expect(countFollowingOperands([1, 2, 3], 1, 3)).to.equal(1);
  });
});


describe('Temporizador de sesión', () => {
  it('actualiza la cuenta atrás y dispara timeup una sola vez', () => {
    let current = 1000;
    let callback;
    let cancelled = 0;
    let timedOut = 0;
    const clock = {innerHTML: ''};

    const timer = createSessionTimer({
      formatTime: (value) => String(value),
      onTimeUp: () => timedOut++,
      now: () => current,
      schedule: (fn) => {
        callback = fn;
        return 7;
      },
      cancel: (id) => {
        expect(id).to.equal(7);
        cancelled++;
      },
    });

    timer.startCountdown(clock, 500);
    current = 1250;
    callback();
    expect(clock.innerHTML).to.equal('250');
    expect(timedOut).to.equal(0);

    current = 1500;
    callback();
    expect(clock.innerHTML).to.equal('0');
    expect(timedOut).to.equal(1);
    expect(cancelled).to.equal(1);

    timer.stop();
    expect(cancelled).to.equal(1);
  });

  it('actualiza el tiempo transcurrido y cancela un temporizador anterior', () => {
    let current = 2000;
    const callbacks = [];
    const cancelled = [];
    const clock = {innerHTML: ''};

    const timer = createSessionTimer({
      formatTime: (value) => String(value),
      onTimeUp: () => {},
      now: () => current,
      schedule: (fn) => {
        callbacks.push(fn);
        return callbacks.length;
      },
      cancel: (id) => cancelled.push(id),
    });

    timer.startCountUp(clock);
    current = 2750;
    callbacks[0]();
    expect(clock.innerHTML).to.equal('750');

    timer.startCountUp(clock);
    expect(cancelled).to.deep.equal([1]);
    timer.stop();
    expect(cancelled).to.deep.equal([1, 2]);
  });
});


describe('Disponibilidad de opciones', () => {
  it('identifica las divisiones que restringen tipos de número', () => {
    expect(operationAvailability([OPERACIONES.DIVISION])).to.deep.equal({
      onlyDivision: true,
      disableNegativeNumbers: true,
      disableDecimals: false,
    });
    expect(operationAvailability([OPERACIONES.DIVISION_RESTO])).to.deep.equal({
      onlyDivision: true,
      disableNegativeNumbers: true,
      disableDecimals: true,
    });
  });

  it('limita a dos operandos en división decimal o con resto', () => {
    expect(requiresTwoOperands(
        [OPERACIONES.DIVISION],
        [TIPO_NUMERO.DECIMAL],
    )).to.equal(true);
    expect(requiresTwoOperands(
        [OPERACIONES.SUMA],
        [TIPO_NUMERO.DECIMAL],
    )).to.equal(false);
    expect(requiresTwoOperands(
        [OPERACIONES.DIVISION_RESTO],
        [TIPO_NUMERO.NATURAL],
    )).to.equal(true);
  });

  it('permite resultado negativo con las mismas reglas de la interfaz', () => {
    expect(canEnableNegativeResult({
      negativeNumbersSelected: true,
      sumSelected: true,
      subtractionSelected: false,
      divisionSelected: false,
      multiplicationSelected: false,
      onlyDivision: false,
      operandCount: 2,
    })).to.equal(true);

    expect(canEnableNegativeResult({
      negativeNumbersSelected: false,
      sumSelected: false,
      subtractionSelected: true,
      divisionSelected: false,
      multiplicationSelected: false,
      onlyDivision: false,
      operandCount: 2,
    })).to.equal(true);

    expect(canEnableNegativeResult({
      negativeNumbersSelected: true,
      sumSelected: false,
      subtractionSelected: false,
      divisionSelected: true,
      multiplicationSelected: false,
      onlyDivision: true,
      operandCount: 2,
    })).to.equal(false);
  });
});


describe('Factorización y reglas numéricas extraídas', () => {
  it('factoriza enteros positivos conservando el orden histórico', () => {
    expect(factorize(5000)).to.deep.equal([2, 2, 2, 5, 5, 5, 5]);
    expect(factorize(120)).to.deep.equal([2, 2, 2, 3, 5]);
  });

  it('conserva signo, primos y tratamiento histórico de decimales', () => {
    expect(factorize(-30)).to.deep.equal([2, 3, 5, -1]);
    expect(factorize(97)).to.deep.equal([97]);
    expect(factorize(12.4)).to.deep.equal([2, 2, 3]);
    expect(factorize(Infinity)).to.deep.equal([]);
  });

  it('calcula decimales y recuentos sin depender de Operacion', () => {
    expect(decimalPlacesForLevel(10)).to.equal(1);
    expect(decimalPlacesForLevel(11)).to.equal(2);
    expect(decimalPlacesForLevel(21)).to.equal(3);
    expect(countDecimalOperands([1, 2.5, 3.25])).to.equal(2);
    expect(countNegativeOperands([-1, 2, -3])).to.equal(2);
    expect(countDecimalOperands([1, 2, 3, 4, 5])).to.equal(0);
    expect(countNegativeOperands([1, -2, 3, -4, 5])).to.equal(0);
  });
});


describe('Estado de sesión de ejercicios', () => {
  it('crea un marcador vacío y acumula tiempos con la regla histórica', () => {
    const score = createSessionScore();
    addQuestionTime(score, 1200, 10);
    addQuestionTime(score, 800, 10);
    expect(score.tiempoConsumido).to.equal(2000);
    expect(score.tiempoMedioEjercicio).to.equal(200);
  });

  it('registra aciertos, fallos y respuestas incorrectas', () => {
    const score = createSessionScore();
    recordAnswer(score, {index: 0, answer: '4', correct: true});
    recordAnswer(score, {index: 1, answer: '7', correct: false});
    recordAnswer(score, {index: 2, answer: '', correct: false});

    expect(score.completados).to.equal(2);
    expect(score.aciertos).to.equal(1);
    expect(score.fallos).to.equal(2);
    expect(score.operacionesMal[1]).to.equal('7');
    expect(score.operacionesMal[2]).to.equal('');
  });

  it('avanza y reinicia el índice al terminar', () => {
    expect(nextOperation(0, 3)).to.deep.equal({index: 1, finished: false});
    expect(nextOperation(2, 3)).to.deep.equal({index: 0, finished: true});
  });

  it('solo recarga operaciones en modo infinito al alcanzar el intervalo', () => {
    expect(shouldReloadInfiniteOperations({
      configuredOperations: 0,
      currentIndex: 9,
      reloadEvery: 10,
    })).to.equal(true);
    expect(shouldReloadInfiniteOperations({
      configuredOperations: 20,
      currentIndex: 9,
      reloadEvery: 10,
    })).to.equal(false);
  });
});


describe('Invariantes de OperacionMultiple', () => {
  it('100 semillas producen expresiones evaluables con resultado coherente', () => {
    for (let seed = 1; seed <= 100; seed++) {
      const op = new OperacionMultiple({
        nivel: 20,
        cantidadOperandos: 3,
        tiposOperacion: [
          OPERACIONES.SUMA,
          OPERACIONES.RESTA,
          OPERACIONES.MULTIPLICACION,
        ],
        tiposOperacionAzar: true,
        tiposNumero: [TIPO_NUMERO.NATURAL],
        random: seededRandom(seed),
      });

      const expression = op.toString(false).replace(/∙/g, '*');
      expect(
          evaluateArithmetic(expression),
          `seed=${seed}; expression=${expression}; resultado=${op.resultado}`,
      ).to.equal(Number(op.resultado));
      expect(op.operandos).to.have.length(3);
    }
  });

  it('una semilla reproduce exactamente una operación múltiple', () => {
    const options = {
      nivel: 20,
      cantidadOperandos: 4,
      tiposOperacion: [
        OPERACIONES.SUMA,
        OPERACIONES.RESTA,
        OPERACIONES.MULTIPLICACION,
      ],
      tiposOperacionAzar: true,
      tiposNumero: [TIPO_NUMERO.NATURAL],
    };

    const first = new OperacionMultiple({...options, random: seededRandom(42)});
    const second = new OperacionMultiple({...options, random: seededRandom(42)});

    expect(second.operandos).to.deep.equal(first.operandos);
    expect(second.tiposOperacion).to.deep.equal(first.tiposOperacion);
    expect(second.resultado).to.equal(first.resultado);
    expect(second.toString(false)).to.equal(first.toString(false));
  });
});
