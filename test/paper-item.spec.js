const expect = require('chai').expect;
import { PaperItem, PaperItemBody } from '../src/components/paper-item.js';

describe('paper-item nativo', () => {
  it('exporta PaperItem y PaperItemBody', () => {
    expect(PaperItem).to.be.a('function');
    expect(PaperItemBody).to.be.a('function');
  });
});
