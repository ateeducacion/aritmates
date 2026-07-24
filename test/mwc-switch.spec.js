/**
 * API del custom element mwc-switch nativo.
 */
const expect = require('chai').expect;
import MwcSwitch from '../src/components/mwc-switch.js';

describe('mwc-switch nativo', () => {
  it('exporta la clase del custom element', () => {
    expect(MwcSwitch).to.be.a('function');
  });

  it('define checked y disabled', () => {
    expect(Object.getOwnPropertyDescriptor(MwcSwitch.prototype, 'checked')).to.be.an('object');
    expect(Object.getOwnPropertyDescriptor(MwcSwitch.prototype, 'disabled')).to.be.an('object');
  });
});
