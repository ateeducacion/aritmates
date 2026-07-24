const expect = require('chai').expect;
import PaperDropdownMenu from '../src/components/paper-dropdown-menu.js';

describe('paper-dropdown-menu nativo', () => {
  it('exporta la clase', () => {
    expect(PaperDropdownMenu).to.be.a('function');
  });

  it('define value y disabled', () => {
    expect(Object.getOwnPropertyDescriptor(PaperDropdownMenu.prototype, 'value')).to.be.an('object');
    expect(Object.getOwnPropertyDescriptor(PaperDropdownMenu.prototype, 'disabled')).to.be.an('object');
  });
});
