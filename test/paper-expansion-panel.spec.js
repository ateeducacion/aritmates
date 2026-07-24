const expect = require('chai').expect;
import PaperExpansionPanel from '../src/widgets/paper-expansion-panel.js';

describe('paper-expansion-panel nativo', () => {
  it('exporta la clase', () => {
    expect(PaperExpansionPanel).to.be.a('function');
  });

  it('define opened', () => {
    const desc = Object.getOwnPropertyDescriptor(PaperExpansionPanel.prototype, 'opened');
    expect(desc).to.be.an('object');
    expect(desc.get).to.be.a('function');
    expect(desc.set).to.be.a('function');
  });
});
