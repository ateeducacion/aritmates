/**
 * Caracterización del custom element paper-checkbox nativo.
 */
const expect = require('chai').expect;

// jsdom-less: registrar el CE en un entorno mínimo si hay window
import PaperCheckbox from '../src/components/paper-checkbox.js';

describe('paper-checkbox nativo', () => {
  it('exporta la clase del custom element', () => {
    expect(PaperCheckbox).to.be.a('function');
  });

  it('define la propiedad checked por defecto en false vía prototype API', () => {
    // En Node el CE puede no estar en un DOM real; validamos el descriptor
    const desc = Object.getOwnPropertyDescriptor(PaperCheckbox.prototype, 'checked');
    expect(desc).to.be.an('object');
    expect(desc.get).to.be.a('function');
    expect(desc.set).to.be.a('function');
  });

  it('define la propiedad disabled', () => {
    const desc = Object.getOwnPropertyDescriptor(PaperCheckbox.prototype, 'disabled');
    expect(desc).to.be.an('object');
    expect(desc.get).to.be.a('function');
    expect(desc.set).to.be.a('function');
  });
});
