/**
 * Golden master: fija lo que genera hoy el motor para una rejilla de opciones
 * y semillas. No describe el comportamiento ideal, sino el real, para que un
 * cambio en la salida sea siempre deliberado.
 *
 * Regenerar tras un cambio intencionado:
 *   UPDATE_GOLDEN=1 npm test
 */
import fs from 'node:fs';
import path from 'node:path';
import {expect} from 'chai';
import Suma from '../src/operaciones/suma';
import Resta from '../src/operaciones/resta';
import Multiplicacion from '../src/operaciones/multiplicacion';
import DivisionEntera from '../src/operaciones/divisionEntera';
import DivisionResto from '../src/operaciones/divisionResto';
import DivisionDecimales from '../src/operaciones/divisionDecimales';
import OperacionMultiple from '../src/operaciones/OperacionMultiple';
import GenerarExamen from '../src/generarExamen';
import OPERACIONES from '../src/operaciones/operaciones';
import {TIPO_NUMERO} from '../src/operaciones/tipoNumero';
import {seededRandom} from '../src/operaciones/random';

const FILE = path.join(process.cwd(), 'test/fixtures/golden.json');
const SEEDS = [1, 2, 3, 4];

// Record a thrown error as data: it is current behavior too.
function safe(fn) {
  try {
    return fn();
  } catch (error) {
    return {lanza: error.message};
  }
}

// Rendering is a pure template of the numbers: record it for one seed only.
function describeOp(op, rendering = true) {
  const respuesta = safe(() => op.respuesta());
  return {
    texto: safe(() => op.toString()),
    textoIncognita: safe(() => op.toString(true, true)),
    html: rendering ? safe(() => op.toHtml()) : undefined,
    impresion: rendering ? safe(() => op.toPrint()) : undefined,
    resultado: op.resultado,
    resto: op.resto,
    respuesta,
    aciertaConRespuesta: safe(() => op.esRespuesta(respuesta)),
    errores: (op.errors || []).map((e) => e.error),
  };
}

function divisionCases() {
  const cases = {};
  const classes = {DivisionEntera, DivisionResto, DivisionDecimales};
  const variants = {
    base: {},
    enfocado: {enfocado: true},
    negativos: {permitirNegativos: true},
    resultadoNegativo: {resultadoNegativo: true},
    dividendo: {operandos: [84]},
    divisor: {operandos: [undefined, 7]},
    ambos: {operandos: [84, 8]},
    ambosDecimales: {operandos: [8.4, 4]},
    tresOperandos: {cantidadOperandos: 3},
    incognitaInicial: {incognita: 1},
    multiplo10: {multiplo10: true},
    multiplo100: {multiplo100: true},
    // How OperacionMultiple builds chained divisions (a / b / c).
    tresConOperandos: {cantidadOperandos: 3, operandos: [84, 8]},
  };
  for (const [name, Clase] of Object.entries(classes)) {
    for (const nivel of [1, 5, 10, 20, 50, 100]) {
      for (const [variant, opts] of Object.entries(variants)) {
        for (const seed of SEEDS) {
          const op = new Clase({nivel, ...opts, random: seededRandom(seed)});
          cases[`${name}|n${nivel}|${variant}|s${seed}`] = describeOp(op, seed === 1);
          if (name === 'DivisionResto') {
            cases[`${name}|n${nivel}|${variant}|s${seed}`].entradaUsuario =
              safe(() => op.toStringUserInput({incognita: 7, resto: 2}));
          }
        }
      }
    }
  }
  return cases;
}

function simpleCases() {
  const cases = {};
  const classes = {Suma, Resta, Multiplicacion};
  const variants = {
    base: {},
    tresOperandos: {cantidadOperandos: 3},
    enfocado: {enfocado: true},
    negativos: {permitirNegativos: true},
    resultadoNegativo: {permitirNegativos: true, resultadoNegativo: true},
    multiplo10: {multiplo10: true},
    multiplo100: {multiplo100: true},
    decimales: {decimales: true},
    primerOperando: {operandos: [12]},
  };
  for (const [name, Clase] of Object.entries(classes)) {
    for (const nivel of [3, 10, 50]) {
      for (const [variant, opts] of Object.entries(variants)) {
        for (const seed of [1, 2]) {
          const op = new Clase({nivel, ...opts, random: seededRandom(seed)});
          cases[`${name}|n${nivel}|${variant}|s${seed}`] = describeOp(op, seed === 1);
        }
      }
    }
  }
  return cases;
}

function multipleCases() {
  const cases = {};
  const combos = [
    [OPERACIONES.SUMA, OPERACIONES.RESTA],
    [OPERACIONES.SUMA, OPERACIONES.DIVISION_ENTERA],
    [OPERACIONES.SUMA, OPERACIONES.DIVISION_DECIMAL],
    [OPERACIONES.SUMA, OPERACIONES.MULTIPLICACION],
    [OPERACIONES.RESTA, OPERACIONES.MULTIPLICACION],
    [OPERACIONES.MULTIPLICACION, OPERACIONES.DIVISION_ENTERA],
    [OPERACIONES.RESTA, OPERACIONES.DIVISION_RESTO],
    [OPERACIONES.DIVISION_DECIMAL, OPERACIONES.DIVISION_DECIMAL],
    [OPERACIONES.DIVISION_ENTERA, OPERACIONES.DIVISION_ENTERA],
  ];
  const numeros = {
    natural: [TIPO_NUMERO.NATURAL],
    entero: [TIPO_NUMERO.ENTERO],
    decimal: [TIPO_NUMERO.DECIMAL],
  };
  for (const tipos of combos) {
    for (const [numName, tiposNumero] of Object.entries(numeros)) {
      for (const resultadoNegativo of [false, true]) {
        for (const seed of SEEDS) {
          const op = new OperacionMultiple({
            nivel: 10, cantidadOperandos: 3, tiposOperacion: tipos,
            tiposOperacionAzar: false, tiposNumero, resultadoNegativo,
            random: seededRandom(seed),
          });
          const key = `${tipos.join('+')}|${numName}|neg${resultadoNegativo}|s${seed}`;
          cases[key] = describeOp(op, seed === 1);
        }
      }
    }
  }
  return cases;
}

function examCases() {
  const cases = {};
  const configs = {
    todas: {tiposOperaciones: [OPERACIONES.SUMA, OPERACIONES.RESTA,
      OPERACIONES.MULTIPLICACION, OPERACIONES.DIVISION]},
    restoYDecimal: {tiposOperaciones: [OPERACIONES.DIVISION_RESTO],
      tiposNumero: [TIPO_NUMERO.DECIMAL]},
    multiple: {tiposOperaciones: [OPERACIONES.SUMA, OPERACIONES.MULTIPLICACION],
      cantidadOperandos: 3, operacionMultiple: true},
    negativos: {tiposOperaciones: [OPERACIONES.RESTA, OPERACIONES.SUMA],
      tiposNumero: [TIPO_NUMERO.ENTERO], resultadoNegativo: true},
    multiplos: {tiposOperaciones: [OPERACIONES.SUMA, OPERACIONES.MULTIPLICACION],
      tiposNumero: [TIPO_NUMERO.MULTIPLO10, TIPO_NUMERO.MULTIPLO100]},
    enfocadoAzar: {tiposOperaciones: [OPERACIONES.SUMA, OPERACIONES.DIVISION],
      enfocado: true, posicionIncognitaAlAzar: true},
    // cantidadOperaciones 0 = sin límite: the only mode that reloads.
    infinito: {tiposOperaciones: [OPERACIONES.SUMA, OPERACIONES.DIVISION_RESTO],
      cantidadOperaciones: 0},
    infinitoMultiple: {tiposOperaciones: [OPERACIONES.RESTA, OPERACIONES.MULTIPLICACION],
      cantidadOperaciones: 0, cantidadOperandos: 3, operacionMultiple: true},
  };
  for (const [name, opts] of Object.entries(configs)) {
    for (const seed of SEEDS) {
      const examen = new GenerarExamen({
        cantidadOperaciones: 8, ...opts, random: seededRandom(seed),
      });
      const inicial = examen.operacionesExamen.map((op) => op.toString());
      const html = safe(() => examen.toHtml());
      const impresion = safe(() => examen.toPrint());
      if (examen.operacionesInfinitas) examen.crearMasOperaciones();
      cases[`${name}|s${seed}`] = {
        ejercicios: inicial,
        texto: examen.toString(),
        html,
        impresion,
        trasCrearMas: examen.operacionesExamen.map((op) => safe(() => op.toString())),
        errores: (examen.errors || []).map((e) => e.error),
      };
    }
  }
  return cases;
}

describe('Golden master del motor', () => {
  // Through JSON so undefined, NaN and Decimal compare like the fixture.
  const actual = JSON.parse(JSON.stringify({
    simples: simpleCases(),
    divisiones: divisionCases(),
    multiples: multipleCases(),
    examenes: examCases(),
  }));

  if (process.env.UPDATE_GOLDEN) {
    fs.mkdirSync(path.dirname(FILE), {recursive: true});
    fs.writeFileSync(FILE, JSON.stringify(actual, null, 1) + '\n');
  }
  const expected = JSON.parse(fs.readFileSync(FILE, 'utf8'));

  for (const group of Object.keys(expected)) {
    it(`${group}: la salida coincide con test/fixtures/golden.json`, () => {
      expect(actual[group]).to.deep.equal(expected[group]);
    });
  }
});
