const expect = require('chai').expect;
import combinations from '../src/utils/combinations.js';
import sh from '../src/utils/shorthash.js';
import utils from '../src/utils.js';

describe('utils nativos (fase 2)', () => {
  describe('combinations', () => {
    it('coincide con combinations@1.0.0 para [a,b,c]', () => {
      expect(combinations(['a', 'b', 'c'])).to.deep.equal([
        ['a'], ['b'], ['c'],
        ['a', 'b'], ['a', 'c'], ['b', 'c'],
        ['a', 'b', 'c'],
      ]);
    });

    it('con un solo elemento devuelve [[x]]', () => {
      expect(combinations(['x'])).to.deep.equal([['x']]);
    });
  });

  describe('shorthash.unique', () => {
    it('es determinista y coincide con shorthash conocido', () => {
      expect(sh.unique('hello')).to.equal('79RmP');
      expect(sh.unique(JSON.stringify({a: 1, b: [2, 3]}))).to.equal('2lPQ2n');
      expect(sh.unique('hello')).to.equal(sh.unique('hello'));
    });
  });
});

describe('utils: listas, barajado y hoja de ejercicios', () => {
  it('compara listas por orden y tamaño', () => {
    expect(utils.isArraysCompareSimilar([1, 2], 'x')).to.equal(false);
    expect(utils.isArraysCompareSimilar([1, 2], [1])).to.equal(false);
    expect(utils.isArraysCompareSimilar([1, 2], [2, 1])).to.equal(false);
    expect(utils.isArraysCompareSimilar([1, 2], [1, 2])).to.equal(true);
    expect(utils.findArrayInArray([3], [[1], [3]])).to.equal(1);
    expect(utils.findArrayInArray([9], [[1], [3]])).to.equal(-1);
  });

  it('shuffle usa Math.random si no recibe una fuente válida', () => {
    const out = utils.shuffle([1, 2, 3], 'no es una función');
    expect(out.slice().sort()).to.deep.equal([1, 2, 3]);
  });

  it('reparte los ejercicios en tablas de filas y columnas', () => {
    const html = utils.organizeInTables(['a', 'b', 'c', 'd', 'e'], 2, 't', 'c', 1, 2);
    expect(html.match(/<table/g)).to.have.length(2);
    expect(html).to.include('class="t primera"');
    expect(html).to.include('<span class="num">5.)</span> e');
    const unica = utils.organizeInTables(['a', 'b'], 2, 't', 'c');
    expect(unica.match(/<table/g)).to.have.length(1);
  });
});
