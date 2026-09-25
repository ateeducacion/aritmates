import Suma from '../src/operaciones/suma';
import Resta from '../src/operaciones/resta';
import Multiplicacion from '../src/operaciones/multiplicacion';
import DivisionEntera from '../src/operaciones/divisionEntera';
import OperacionMultiple from '../src/operaciones/OperacionMultiple';
import {asRandom, randomSign, roundedBetween, seededRandom, setDefaultRandom} from '../src/operaciones/random';
import {evaluateArithmetic} from '../src/operaciones/evaluate';
import {
  subtractionsAsNegativeSums,
  additionsAsSubtractions,
  groupSimilarOperations,
} from '../src/operaciones/expression';
import OPERACIONES from '../src/operaciones/operaciones';
import {TIPO_NUMERO} from '../src/operaciones/tipoNumero';
import {scoreBadges, speedBadges} from '../src/application/badges';
import {createSessionTimer} from '../src/application/timer';
import {canEnableNegativeResult, operationAvailability, requiresTwoOperands} from '../src/application/optionAvailability';
import {addQuestionTime, createSessionScore, nextOperation, recordAnswer, shouldReloadInfiniteOperations} from '../src/application/exerciseSession';
import {countDecimalOperands, countFollowingOperands, countNegativeOperands, decimalPlaces, decimalPlacesForLevel, isMissingOperand, multiplesUntil, shouldGenerateOperand} from '../src/operaciones/numberRules';
import {factorize} from '../src/operaciones/factorization';
import {selectExpressionOperations} from '../src/operaciones/operationSelection';
import {countDefinedOperands, hasOperandValue, invertAllOperandSigns, invertOperandSign, sortOperandsDescending} from '../src/operaciones/operandRules';

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
  it('100 semillas mantienen coherencia matemática también cuando se rechaza una generación', () => {
    let accepted = 0;
    let rejected = 0;

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
      const evaluated = evaluateArithmetic(expression);

      if (op.resultado === false) {
        rejected++;
        expect(
            evaluated,
            `seed=${seed}; expression=${expression}; resultadoPre=${op.resultadoPre}`,
        ).to.equal(Number(op.resultadoPre));
      } else {
        accepted++;
        expect(
            evaluated,
            `seed=${seed}; expression=${expression}; resultado=${op.resultado}`,
        ).to.equal(Number(op.resultado));
      }

      expect(op.operandos).to.have.length(3);
    }

    expect(accepted).to.be.greaterThan(0);
    expect(rejected).to.be.greaterThan(0);
    expect(accepted + rejected).to.equal(100);
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


describe('Selección de operadores', () => {
  it('incluye al menos una vez cada tipo cuando caben en la expresión', () => {
    const selected = selectExpressionOperations({
      operations: [
        OPERACIONES.SUMA,
        OPERACIONES.RESTA,
        OPERACIONES.MULTIPLICACION,
      ],
      operandCount: 4,
      numberTypes: [TIPO_NUMERO.NATURAL],
      random: seededRandom(7),
    });

    expect(selected).to.have.length(3);
    expect(selected).to.include(OPERACIONES.SUMA);
    expect(selected).to.include(OPERACIONES.RESTA);
    expect(selected).to.include(OPERACIONES.MULTIPLICACION);
  });

  it('rellena operadores adicionales de forma determinista', () => {
    const options = {
      operations: [OPERACIONES.SUMA, OPERACIONES.MULTIPLICACION],
      operandCount: 5,
      numberTypes: [TIPO_NUMERO.NATURAL],
    };
    const first = selectExpressionOperations({...options, random: seededRandom(9)});
    const second = selectExpressionOperations({...options, random: seededRandom(9)});

    expect(second).to.deep.equal(first);
    expect(first).to.have.length(4);
  });

  it('fuerza una resta cuando se exige resultado negativo con naturales', () => {
    const selected = selectExpressionOperations({
      operations: [OPERACIONES.SUMA, OPERACIONES.MULTIPLICACION],
      operandCount: 4,
      negativeResult: true,
      numberTypes: [TIPO_NUMERO.NATURAL],
      random: seededRandom(12),
    });

    expect(selected).to.include(OPERACIONES.RESTA);
  });

  it('no fuerza resta si los enteros ya permiten operandos negativos', () => {
    const selected = selectExpressionOperations({
      operations: [OPERACIONES.SUMA, OPERACIONES.MULTIPLICACION],
      operandCount: 4,
      negativeResult: true,
      numberTypes: [TIPO_NUMERO.ENTERO],
      random: seededRandom(12),
    });

    expect(selected).to.not.include(OPERACIONES.RESTA);
  });
});


describe('Reglas puras de operandos', () => {
  it('busca valores conservando la comparación histórica', () => {
    expect(hasOperandValue([1, 2, 3], '2')).to.equal(true);
    expect(hasOperandValue([1, 2, 3], 4)).to.equal(false);
  });

  it('invierte signos sin modificar el array original', () => {
    const original = [3, 0, -2];
    expect(invertOperandSign(original, 0)).to.deep.equal([-3, 0, -2]);
    expect(invertAllOperandSigns(original)).to.deep.equal([-3, 0, 2]);
    expect(original).to.deep.equal([3, 0, -2]);
  });

  it('ordena descendente y conserva la posición del operando de nivel', () => {
    const sorted = sortOperandsDescending([2, 10, 5], 1);
    expect(sorted.operands).to.deep.equal([10, 5, 2]);
    expect(sorted.levelPosition).to.equal(0);
  });

  it('con duplicados conserva la última coincidencia como el legacy', () => {
    const sorted = sortOperandsDescending([5, 2, 5], 0);
    expect(sorted.operands).to.deep.equal([5, 5, 2]);
    expect(sorted.levelPosition).to.equal(1);
  });

  it('cuenta solo operandos definidos', () => {
    expect(countDefinedOperands([1, undefined, 2, null, 0])).to.equal(3);
  });
});


describe('Debug observacional del motor', () => {
  it('la misma seed genera la misma operación múltiple con debug on/off', () => {
    const options = {
      nivel: 20,
      cantidadOperandos: 3,
      tiposOperacion: [
        OPERACIONES.SUMA,
        OPERACIONES.DIVISION_ENTERA,
      ],
      tiposOperacionAzar: false,
      tiposNumero: [TIPO_NUMERO.NATURAL],
    };

    const previousDebug = globalThis.debug;
    try {
      globalThis.debug = false;
      const withoutDebug = new OperacionMultiple({
        ...options,
        random: seededRandom(91),
      });

      globalThis.debug = true;
      const withDebug = new OperacionMultiple({
        ...options,
        random: seededRandom(91),
      });

      expect(withDebug.operandos).to.deep.equal(withoutDebug.operandos);
      expect(withDebug.tiposOperacion).to.deep.equal(withoutDebug.tiposOperacion);
      expect(withDebug.resultado).to.equal(withoutDebug.resultado);
      expect(withDebug.resultadoPre).to.equal(withoutDebug.resultadoPre);
      expect(withDebug.toString(false)).to.equal(withoutDebug.toString(false));
    } finally {
      globalThis.debug = previousDebug;
    }
  });

  it('debug no cambia la representación textual de una operación', () => {
    const op = new Suma({nivel: 10, random: seededRandom(15)});
    op.posicion_nivel = op.operandos.length + 1;

    const previousDebug = globalThis.debug;
    try {
      globalThis.debug = false;
      const normal = op.toString();

      globalThis.debug = true;
      const diagnostic = op.toString();

      expect(diagnostic).to.equal(normal);
    } finally {
      globalThis.debug = previousDebug;
    }
  });

  it('debug no añade errores que no existen en ejecución normal', () => {
    const op = new Suma({nivel: 10, random: seededRandom(18)});
    op.deep = 3;

    const previousDebug = globalThis.debug;
    try {
      op.errors = [];
      globalThis.debug = false;
      op.comprobarResultado();
      const normalErrors = op.errors.slice();

      op.errors = [];
      globalThis.debug = true;
      op.comprobarResultado();
      const debugErrors = op.errors.slice();

      expect(debugErrors).to.deep.equal(normalErrors);
    } finally {
      globalThis.debug = previousDebug;
    }
  });
});


describe('Aislamiento de reescrituras suma/resta', () => {
  it('devuelve copias nuevas aunque solo haya sumas', () => {
    const operandos = [2, 3, 4];
    const operaciones = [OPERACIONES.SUMA, OPERACIONES.SUMA];
    const rewritten = subtractionsAsNegativeSums(operandos, operaciones);

    expect(rewritten.operandos).to.deep.equal(operandos);
    expect(rewritten.operaciones).to.deep.equal(operaciones);
    expect(rewritten.operandos).to.not.equal(operandos);
    expect(rewritten.operaciones).to.not.equal(operaciones);

    rewritten.operandos[0] = 99;
    expect(operandos[0]).to.equal(2);
  });

  it('devuelve copias nuevas aunque solo haya restas', () => {
    const operandos = [10, 3, 2];
    const operaciones = [OPERACIONES.RESTA, OPERACIONES.RESTA];
    const rewritten = additionsAsSubtractions(operandos, operaciones);

    expect(rewritten.operandos).to.deep.equal(operandos);
    expect(rewritten.operaciones).to.deep.equal(operaciones);
    expect(rewritten.cambios).to.deep.equal([]);
    expect(rewritten.operandos).to.not.equal(operandos);
    expect(rewritten.operaciones).to.not.equal(operaciones);
  });
});


describe('Reglas puras de aleatoriedad', () => {
  it('conserva el redondeo histórico en intervalos', () => {
    expect(roundedBetween(() => 0, 1, 5)).to.equal(1);
    expect(roundedBetween(() => 0.24, 1, 5)).to.equal(2);
    expect(roundedBetween(() => 0.5, 1, 5)).to.equal(3);
    expect(roundedBetween(() => 0.99, 1, 5)).to.equal(5);
  });

  it('conserva la regla histórica de signo', () => {
    expect(randomSign(() => 0)).to.equal(-1);
    expect(randomSign(() => 0.49)).to.equal(-1);
    expect(randomSign(() => 0.5)).to.equal(1);
    expect(randomSign(() => 0.99)).to.equal(1);
  });

  it('una misma semilla conserva la secuencia al usar los helpers', () => {
    const a = seededRandom(1234);
    const b = seededRandom(1234);
    const seqA = [
      roundedBetween(a, 1, 20),
      randomSign(a),
      roundedBetween(a, 5, 10),
    ];
    const seqB = [
      roundedBetween(b, 1, 20),
      randomSign(b),
      roundedBetween(b, 5, 10),
    ];
    expect(seqB).to.deep.equal(seqA);
  });
});


describe('Cero como operando explícito', () => {
  it('solo considera ausentes null, undefined y cadena vacía', () => {
    expect(isMissingOperand(undefined)).to.equal(true);
    expect(isMissingOperand(null)).to.equal(true);
    expect(isMissingOperand('')).to.equal(true);
    expect(isMissingOperand(0)).to.equal(false);
    expect(isMissingOperand('0')).to.equal(false);
    expect(shouldGenerateOperand(0, 0)).to.equal(false);
    expect(shouldGenerateOperand(0, undefined)).to.equal(true);
    expect(shouldGenerateOperand(5, undefined)).to.equal(false);
  });

  it('Suma conserva un cero enviado por el usuario', () => {
    const op = new Suma({
      cantidadOperandos: 2,
      operandos: [0, 5],
      random: seededRandom(11),
    });
    expect(op.operandos).to.deep.equal([0, 5]);
    expect(Number(op.resultado)).to.equal(5);
  });

  it('Resta conserva un cero enviado por el usuario', () => {
    const op = new Resta({
      cantidadOperandos: 2,
      operandos: [5, 0],
      random: seededRandom(12),
    });
    expect(op.operandos).to.deep.equal([5, 0]);
    expect(Number(op.resultado)).to.equal(5);
  });

  it('Multiplicación conserva un cero enviado por el usuario', () => {
    const op = new Multiplicacion({
      cantidadOperandos: 2,
      operandos: [0, 5],
      random: seededRandom(13),
    });
    expect(op.operandos).to.deep.equal([0, 5]);
    expect(Number(op.resultado)).to.equal(0);
  });
});
