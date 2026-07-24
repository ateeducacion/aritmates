const expect = require('chai').expect;
import combinations from '../src/utils/combinations.js';
import sh from '../src/utils/shorthash.js';

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
