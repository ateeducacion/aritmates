import {expect} from 'chai';
import Suma from '../src/operaciones/suma';
import Resta from '../src/operaciones/resta';
import GenerarExamen from '../src/generarExamen';
import {OPERACIONES} from '../src/operaciones/operaciones';
import {seededRandom} from '../src/operaciones/random';

const sum = (values) => values.reduce((a, b) => a + b, 0);

describe('Complementarios («resultado igual a»)', () => {
  for (const complementario of [10, 30, 50, 100]) {
    for (const permitirNegativos of [false, true]) {
      for (const cantidadOperandos of [2, 3]) {
        it(`Suma de ${cantidadOperandos} operandos suma ${complementario}` +
            ` (negativos: ${permitirNegativos})`, () => {
          for (let seed = 1; seed <= 25; seed++) {
            const op = new Suma({
              complementario, permitirNegativos, cantidadOperandos,
              random: seededRandom(seed),
            });

            expect(op.resultado, `seed ${seed}`).to.equal(complementario);
            expect(sum(op.operandos), `seed ${seed}: ${op}`)
                .to.equal(complementario);
            if (!permitirNegativos) {
              op.operandos.forEach((x) =>
                expect(x, `seed ${seed}: ${op}`).to.be.at.least(0));
            }
            if (complementario == 100) {
              op.operandos.forEach((x) =>
                expect(x % 10, `seed ${seed}: ${op}`).to.equal(0));
            }
          }
        });
      }
    }
  }

  it('Suma respeta un operando enviado por el usuario', () => {
    for (let seed = 1; seed <= 10; seed++) {
      const op = new Suma({
        complementario: 30, operandos: [12], random: seededRandom(seed),
      });
      expect(op.operandos).to.deep.equal([12, 18]);
    }
  });

  it('Resta con complementario da ese resultado', () => {
    for (const complementario of [10, 30, 100]) {
      for (let seed = 1; seed <= 25; seed++) {
        const op = new Resta({complementario, random: seededRandom(seed)});
        expect(op.operandos[0] - op.operandos[1], `seed ${seed}: ${op}`)
            .to.equal(complementario);
      }
    }
  });

  it('en un examen todas las sumas y restas cuadran con el complementario', () => {
    const examen = new GenerarExamen({
      cantidadOperaciones: 20,
      complementario: 30,
      tiposOperaciones: [OPERACIONES.SUMA, OPERACIONES.RESTA],
      random: seededRandom(7),
    });

    examen.operacionesExamen.forEach((op) => {
      const [a, b] = op.operandos;
      const valor = op.getTipo() == OPERACIONES.SUMA ? a + b : a - b;
      expect(valor, op.toString()).to.equal(30);
    });
  });
});
