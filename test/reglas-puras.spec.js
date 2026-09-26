import {expect} from 'chai';
import OPERACIONES from '../src/operaciones/operaciones';
import {TIPO_NUMERO} from '../src/operaciones/tipoNumero';
import {evaluateArithmetic} from '../src/operaciones/evaluate';
import {
  additionsAsSubtractions,
  countAdjacent,
  subtractionsAsNegativeSums,
  symbolFor,
} from '../src/operaciones/expression';
import {
  asRandom,
  randomSign,
  resetDefaultRandom,
  roundedBetween,
  setDefaultRandom,
} from '../src/operaciones/random';
import {decimalPlaces} from '../src/operaciones/numberRules';
import {factorize} from '../src/operaciones/factorization';
import {createSessionTimer} from '../src/application/timer';
import {
  canEnableNegativeResult,
  requiresTwoOperands,
} from '../src/application/optionAvailability';
import {speedBadges} from '../src/application/badges';
import {applyConfig} from '../src/defaultOptions';

describe('evaluateArithmetic: entradas que no son una expresión válida', () => {
  it('acepta el + unario y cualquier espacio en blanco', () => {
    expect(evaluateArithmetic('+3 *\t2\n- -1')).to.equal(7);
  });

  it('trata un identificador como NaN, igual que eval() con undefined', () => {
    expect(evaluateArithmetic('undefined + 1')).to.be.NaN;
  });

  it('no ejecuta código: una llamada es entrada sobrante', () => {
    expect(() => evaluateArithmetic('alert(1)')).to.throw(/Trailing input/);
  });

  it('rechaza un paréntesis sin cerrar', () => {
    expect(() => evaluateArithmetic('(1 + 2')).to.throw(/closing parenthesis/);
  });

  it('rechaza una expresión vacía o un operador sin operando', () => {
    expect(() => evaluateArithmetic('')).to.throw(/Expected number/);
    expect(() => evaluateArithmetic('2 *')).to.throw(/Expected number/);
  });

  it('rechaza un número mal formado', () => {
    expect(() => evaluateArithmetic('1.2.3')).to.throw(/Invalid number/);
  });

  it('rechaza números seguidos sin operador', () => {
    expect(() => evaluateArithmetic('2 3')).to.throw(/Trailing input/);
  });
});

describe('Reglas de expresión: ramas por defecto', () => {
  it('todas las divisiones usan / y un tipo desconocido cae en +', () => {
    expect([
      OPERACIONES.DIVISION, OPERACIONES.DIVISION_ENTERA,
      OPERACIONES.DIVISION_RESTO, OPERACIONES.DIVISION_DECIMAL,
    ].map(symbolFor)).to.deep.equal(['/', '/', '/', '/']);
    expect(symbolFor('potencia')).to.equal('+');
  });

  it('las reescrituras no aplican si hay multiplicaciones o divisiones', () => {
    const ops = [OPERACIONES.SUMA, OPERACIONES.MULTIPLICACION];
    expect(subtractionsAsNegativeSums([1, 2, 3], ops)).to.deep.equal({});
    expect(additionsAsSubtractions([1, 2, 3], ops)).to.deep.equal({});
  });

  it('las reescrituras ignoran un operador desconocido', () => {
    const ops = [OPERACIONES.SUMA, 'otro'];
    expect(subtractionsAsNegativeSums([1, 2, 3], ops)).to.deep.equal({
      operandos: [1, 2], operaciones: [OPERACIONES.SUMA],
    });
    expect(additionsAsSubtractions([1, 2, 3], ops)).to.deep.equal({
      operandos: [1, -2], operaciones: [OPERACIONES.RESTA], cambios: [1],
    });
  });

  it('la división entera cuenta los operadores contiguos hacia atrás', () => {
    const d = OPERACIONES.DIVISION_ENTERA;
    expect(countAdjacent([d, d, OPERACIONES.SUMA, d], 2, d)).to.equal(3);
    expect(countAdjacent([OPERACIONES.SUMA, d], 1, d)).to.equal(1);
  });
});

describe('Fuente aleatoria', () => {
  let saved;
  beforeEach(() => {
    saved = asRandom(undefined);
  });
  afterEach(() => setDefaultRandom(saved));

  it('setDefaultRandom exige una función y devuelve la anterior', () => {
    expect(() => setDefaultRandom(42)).to.throw(TypeError);
    const fixed = () => 0.5;
    const previous = setDefaultRandom(fixed);
    expect(previous).to.be.a('function');
    expect(asRandom(undefined)).to.equal(fixed);
  });

  it('resetDefaultRandom vuelve a Math.random', () => {
    resetDefaultRandom();
    expect(asRandom(null)).to.equal(Math.random);
  });

  it('asRandom respeta una fuente inyectada', () => {
    const own = () => 0.1;
    expect(asRandom(own)).to.equal(own);
  });

  it('roundedBetween y randomSign conservan el redondeo histórico', () => {
    expect(roundedBetween(() => 0, 3, 9)).to.equal(3);
    expect(roundedBetween(() => 0.999, 3, 9)).to.equal(9);
    expect(randomSign(() => 0.2)).to.equal(-1);
    expect(randomSign(() => 0.8)).to.equal(1);
  });
});

describe('Reglas numéricas: casos límite', () => {
  it('decimalPlaces entiende la notación exponencial', () => {
    expect(decimalPlaces(1.5e-7)).to.equal(8);
    expect(decimalPlaces('2.50')).to.equal(2);
    expect(decimalPlaces(12)).to.equal(0);
  });

  it('factorize se detiene si se queda sin primos en la tabla', () => {
    expect(factorize(1)).to.be.an('array');
    const factores = factorize(2 * 3 * 5 * 7);
    expect(factores.reduce((a, b) => a * b, 1)).to.equal(210);
  });
});

describe('Temporizador y opciones', () => {
  it('sin reloj inyectado usa Date.now()', () => {
    let tick;
    const timer = createSessionTimer({
      formatTime: (ms) => (ms >= 0 ? 'ok' : 'neg'),
      onTimeUp: () => {},
      schedule: (fn) => {
        tick = fn; return 1;
      },
      cancel: () => {},
    });
    const clock = {innerHTML: ''};
    timer.startCountUp(clock);
    tick();
    expect(clock.innerHTML).to.equal('ok');
    timer.stop();
  });

  it('requiresTwoOperands: decimales solo con división exacta o con resto', () => {
    const decimal = [TIPO_NUMERO.DECIMAL];
    expect(requiresTwoOperands([OPERACIONES.DIVISION], decimal)).to.equal(true);
    expect(requiresTwoOperands([OPERACIONES.DIVISION, OPERACIONES.SUMA], decimal))
        .to.equal(false);
    expect(requiresTwoOperands([OPERACIONES.DIVISION_RESTO], [])).to.equal(true);
    expect(requiresTwoOperands(undefined, decimal)).to.equal(false);
  });

  it('canEnableNegativeResult con restas y más de dos operandos', () => {
    expect(canEnableNegativeResult({
      subtractionSelected: true, sumSelected: true, operandCount: '3',
    })).to.equal(true);
    expect(canEnableNegativeResult({
      subtractionSelected: true, sumSelected: true, operandCount: 2,
    })).to.equal(false);
  });

  it('speedBadges sin tiempo máximo no concede insignias', () => {
    expect(speedBadges(1000, 0)).to.deep.equal({
      bronze: false, silver: false, gold: false, platinum: false,
    });
  });
});

describe('applyConfig', () => {
  it('copia solo valores verdaderos de las claves conocidas', () => {
    const target = {nivel: 10, cuentaAtras: 30, otra: 1};
    applyConfig({nivel: 5, cuentaAtras: 0, desconocida: 9}, target);
    expect(target).to.deep.equal({nivel: 5, cuentaAtras: 30, otra: 1});
  });

  it('ignora una configuración ausente', () => {
    const target = {nivel: 10};
    expect(applyConfig(null, target)).to.deep.equal({nivel: 10});
  });
});
