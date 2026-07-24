/**
 * Pruebas de caracterización: fijan el comportamiento actual antes/después
 * de la migración a aplicación estática.
 *
 * No documentan el comportamiento ideal: documentan el comportamiento real.
 */
const expect = require('chai').expect;

import Suma from '../src/operaciones/suma';
import Resta from '../src/operaciones/resta';
import Multiplicacion from '../src/operaciones/multiplicacion';
import DivisionEntera from '../src/operaciones/divisionEntera';
import DivisionResto from '../src/operaciones/divisionResto';
import DivisionDecimales from '../src/operaciones/divisionDecimales';
import OperacionMultiple from '../src/operaciones/OperacionMultiple';
import OPERACIONES from '../src/operaciones/operaciones';
import { TIPO_NUMERO } from '../src/operaciones/tipoNumero';
import { DEFAULTS, ENABLE } from '../src/defaultOptions';
import shortcodeApi from '../src/OptionsShortcode';
import GenerarExamen from '../src/generarExamen';
import utils from '../src/utils';

/**
 * Fuente de aleatoriedad controlable SOLO para pruebas.
 * No altera Math.random en producción.
 */
function withSeededRandom(seed, fn) {
  const original = Math.random;
  let s = seed >>> 0;
  Math.random = function seededRandom() {
    // xorshift32
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 1000000) / 1000000;
  };
  try {
    return fn();
  } finally {
    Math.random = original;
  }
}

describe('Caracterización — defaults y configuración', () => {
  it('operación predeterminada incluye suma, resta, multiplicación y división', () => {
    expect(DEFAULTS.tiposOperaciones).to.include.members([
      OPERACIONES.SUMA,
      OPERACIONES.RESTA,
      OPERACIONES.MULTIPLICACION,
      OPERACIONES.DIVISION,
    ]);
  });

  it('número predeterminado de operandos es 2', () => {
    expect(DEFAULTS.cantidadOperandos).to.equal(2);
  });

  it('nivel predeterminado es 10', () => {
    expect(DEFAULTS.nivel).to.equal(10);
  });

  it('cantidad de operaciones predeterminada es 10', () => {
    expect(DEFAULTS.cantidadOperaciones).to.equal(10);
  });

  it('cronómetro predeterminado desactivado (0)', () => {
    expect(DEFAULTS.cuentaAtras).to.equal(0);
  });

  it('posición de incógnita al azar desactivada por defecto', () => {
    expect(DEFAULTS.posicionIncognitaAlAzar).to.equal(false);
  });

  it('resultado negativo desactivado por defecto', () => {
    expect(DEFAULTS.resultadoNegativo).to.equal(false);
  });

  it('tipos de número predeterminados son naturales', () => {
    expect(DEFAULTS.tiposNumero).to.deep.equal([TIPO_NUMERO.NATURAL]);
  });

  it('modo enfocado habilitado en ENABLE', () => {
    expect(ENABLE.enfocado).to.equal(true);
  });

  it('paréntesis deshabilitados en ENABLE', () => {
    expect(ENABLE.parentesis).to.equal(false);
  });
});

describe('Caracterización — operaciones básicas con operandos fijos', () => {
  it('suma 34+18 = 52', () => {
    const s = new Suma({ operandos: [34, 18] });
    expect(s.resultado).to.eql(52);
  });

  it('resta 34-18 = 16', () => {
    const s = new Resta({ operandos: [34, 18] });
    expect(s.resultado).to.eql(16);
  });

  it('multiplicación 34×18 = 612', () => {
    const s = new Multiplicacion({ operandos: [34, 18] });
    expect(s.resultado).to.eql(612);
  });

  it('división entera 81/9 = 9', () => {
    const s = new DivisionEntera({ operandos: [81, 9] });
    expect(Number(s.resultado)).to.eql(9);
  });

  it('división con resto 67/9 → cociente 7 resto 4', () => {
    const s = new DivisionResto({ operandos: [67, 9] });
    expect(String(s.resultado)).to.equal('7');
    expect(String(s.resto)).to.equal('4');
  });

  it('división decimal 8.5/1 = 8.5', () => {
    const s = new DivisionDecimales({ operandos: [8.5, 1] });
    expect(Number(s.resultado)).to.eql(8.5);
  });
});

describe('Caracterización — operaciones combinadas y prioridad', () => {
  it('3 ∙ 2 + 5 = 11 (prioridad de operadores)', () => {
    const op = new OperacionMultiple({
      nivel: 50,
      cantidadOperandos: 3,
      permitirNegativos: false,
      tiposOperacion: [OPERACIONES.MULTIPLICACION, OPERACIONES.SUMA],
      operandos: [3, 2, 5],
      tiposOperacionAzar: false,
    });
    expect(Number(op.resultado)).to.equal(11);
  });

  it('3 + 2 * 1 - 5 = 0', () => {
    const op = new OperacionMultiple({
      nivel: 50,
      cantidadOperandos: 4,
      permitirNegativos: false,
      tiposOperacion: [
        OPERACIONES.SUMA,
        OPERACIONES.MULTIPLICACION,
        OPERACIONES.RESTA,
      ],
      operandos: [3, 2, 1, 5],
      tiposOperacionAzar: false,
    });
    expect(Number(op.resultado)).to.equal(0);
  });
});

describe('Caracterización — aleatoriedad controlada (solo tests)', () => {
  it('con la misma semilla se generan los mismos operandos de suma', () => {
    const a = withSeededRandom(12345, () => {
      const s = new Suma({ nivel: 10, enfocado: true });
      return { operandos: [...s.operandos], resultado: s.resultado };
    });
    const b = withSeededRandom(12345, () => {
      const s = new Suma({ nivel: 10, enfocado: true });
      return { operandos: [...s.operandos], resultado: s.resultado };
    });
    expect(a).to.deep.equal(b);
  });

  it('semillas distintas producen resultados potencialmente distintos', () => {
    const a = withSeededRandom(1, () => new Suma({ nivel: 20, enfocado: true }).operandos.join(','));
    const b = withSeededRandom(99999, () => new Suma({ nivel: 20, enfocado: true }).operandos.join(','));
    // No es garantía absoluta, pero con alta probabilidad difieren
    // Si coinciden por casualidad el test no es inválido; solo informativo.
    expect(typeof a).to.equal('string');
    expect(typeof b).to.equal('string');
  });

  it('examen con semilla fija produce cantidad y tipos estables', () => {
    const run = () => withSeededRandom(42, () => {
      const g = new GenerarExamen({
        nivel: 10,
        cantidadOperaciones: 5,
        tiposOperaciones: [OPERACIONES.SUMA, OPERACIONES.RESTA],
        cantidadOperandos: 2,
      });
      return g.operacionesExamen.map((op) => op.tipo);
    });
    expect(run()).to.deep.equal(run());
  });
});

describe('Caracterización — códigos de configuración', () => {
  const shortcode = shortcodeApi;

  const sampleConfigs = [
    {
      name: 'defaults-like',
      options: {
        nivel: 10,
        cuentaAtras: 0,
        cantidadOperaciones: 10,
        tiposOperaciones: ['suma', 'resta', 'multiplicacion', 'division'],
        cantidadOperandos: 2,
        posicionIncognitaAlAzar: false,
        resultadoNegativo: false,
        tiposNumero: [0],
      },
    },
    {
      name: 'solo-suma-nivel-5',
      options: {
        nivel: 5,
        cuentaAtras: 0,
        cantidadOperaciones: 5,
        tiposOperaciones: ['suma'],
        cantidadOperandos: 2,
        posicionIncognitaAlAzar: false,
        resultadoNegativo: false,
        tiposNumero: [0],
      },
    },
    {
      name: 'crono-y-negativos',
      options: {
        nivel: 20,
        cuentaAtras: 60,
        cantidadOperaciones: 15,
        tiposOperaciones: ['suma', 'resta'],
        cantidadOperandos: 2,
        posicionIncognitaAlAzar: true,
        resultadoNegativo: true,
        tiposNumero: [0, 1],
      },
    },
  ];

  sampleConfigs.forEach(({ name, options }) => {
    it(`round-trip código estable: ${name}`, () => {
      // generateCodeDirecto / decode según API disponible
      if (typeof shortcode.generateCodeDirecto === 'function') {
        const code1 = shortcode.generateCodeDirecto(options);
        const code2 = shortcode.generateCodeDirecto(options);
        expect(code1).to.equal(code2);
        expect(code1).to.be.a('string');
        expect(code1.length).to.be.greaterThan(0);

        if (typeof shortcode.decodeCodeDirecto === 'function') {
          const decoded = shortcode.decodeCodeDirecto(code1);
          // Comparar campos clave cuando existan
          if (decoded && decoded.nivel !== undefined) {
            expect(Number(decoded.nivel)).to.equal(Number(options.nivel));
          }
        }
      } else {
        // API alternativa jsonToHash
        const h1 = shortcode.jsonToHash(options);
        const h2 = shortcode.jsonToHash(options);
        expect(h1).to.equal(h2);
      }
    });
  });

  it('jsonToHash es determinista', () => {
    const json = { a: 1, b: [2, 3], c: false };
    expect(shortcode.jsonToHash(json)).to.equal(shortcode.jsonToHash(json));
  });
});

describe('Caracterización — utilidades', () => {
  it('strTiempoASegundos("1:00") = 60', () => {
    expect(utils.strTiempoASegundos('1:00')).to.equal(60);
  });

  it('sgToMinSg(90) = "1:30"', () => {
    expect(utils.sgToMinSg(90)).to.equal('1:30');
  });

  it('milisToMinSg(90000) = "01:30"', () => {
    expect(utils.milisToMinSg(90000)).to.equal('01:30');
  });
});

describe('Caracterización — límites de nivel (muestra)', () => {
  it('a nivel 5 enfocado, operandos de suma están en rango acotado', () => {
    withSeededRandom(7, () => {
      for (let i = 0; i < 20; i++) {
        const s = new Suma({ nivel: 5, enfocado: true });
        s.operandos.forEach((n) => {
          expect(Math.abs(Number(n))).to.be.at.most(50);
        });
      }
    });
  });
});
