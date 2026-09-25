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
import {seededRandom} from '../src/operaciones/random';

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

describe('Caracterización — aleatoriedad inyectada', () => {
  it('la misma semilla reproduce operandos y resultado de una suma', () => {
    const run = () => {
      const s = new Suma({nivel: 10, enfocado: true, random: seededRandom(12345)});
      return {operandos: [...s.operandos], resultado: s.resultado};
    };
    expect(run()).to.deep.equal(run());
  });

  it('semillas distintas producen operandos distintos', () => {
    const a = new Suma({nivel: 20, enfocado: true, random: seededRandom(1)}).operandos.join(',');
    const b = new Suma({nivel: 20, enfocado: true, random: seededRandom(99999)}).operandos.join(',');
    expect(a).to.not.equal(b);
  });

  it('un examen con semilla fija repite tipos y textos', () => {
    const run = () => {
      const g = new GenerarExamen({
        nivel: 10,
        cantidadOperaciones: 5,
        tiposOperaciones: [OPERACIONES.SUMA, OPERACIONES.RESTA],
        cantidadOperandos: 2,
        random: seededRandom(42),
      });
      return g.operacionesExamen.map((op) => op.toString());
    };
    expect(run()).to.deep.equal(run());
    expect(run()).to.have.length(5);
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
        cantidadOperaciones: 10,
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
        cantidadOperaciones: 20,
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
      const copy = JSON.parse(JSON.stringify(options));
      const code = shortcode.generateCodeDirecto(copy);
      expect(code).to.match(/^#[A-Z][0-9A-Z]+/);
      expect(code).to.equal(shortcode.generateCodeDirecto(JSON.parse(JSON.stringify(options))));
      const decoded = shortcode.codigoDirectoToOptions(code);
      expect(Number(decoded.nivel)).to.equal(Number(options.nivel));
      expect(Number(decoded.cantidadOperaciones)).to.equal(Number(options.cantidadOperaciones));
      expect(Number(decoded.cantidadOperandos)).to.equal(Number(options.cantidadOperandos));
      expect(decoded.resultadoNegativo).to.equal(options.resultadoNegativo);
      expect(decoded.posicionIncognitaAlAzar).to.equal(options.posicionIncognitaAlAzar);
      expect(decoded.tiposOperaciones.slice().sort()).to.deep.equal(options.tiposOperaciones.slice().sort());
      expect(decoded.tiposNumero.slice().sort()).to.deep.equal(options.tiposNumero.slice().sort());
      if (options.cuentaAtras) {
        expect(Number(decoded.cuentaAtras)).to.equal(Number(options.cuentaAtras));
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
    for (let i = 0; i < 20; i++) {
      const s = new Suma({nivel: 5, enfocado: true, random: seededRandom(7 + i)});
      s.operandos.forEach((n) => {
        expect(Math.abs(Number(n))).to.be.at.most(50);
      });
      expect(s.operandos).to.include(5);
    }
  });
});
