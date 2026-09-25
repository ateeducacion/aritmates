import Suma from '../src/operaciones/suma';
import Resta from '../src/operaciones/resta';
import Multiplicacion from '../src/operaciones/multiplicacion';
import DivisionEntera from '../src/operaciones/divisionEntera';
import {seededRandom} from '../src/operaciones/random';
import {evaluateArithmetic} from '../src/operaciones/evaluate';
import {subtractionsAsNegativeSums} from '../src/operaciones/expression';
import OPERACIONES from '../src/operaciones/operaciones';
import {scoreBadges, speedBadges} from '../src/application/badges';

const expect = require('chai').expect;

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
