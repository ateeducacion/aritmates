const expect = require('chai').expect;
import {MDCDialog, MDCDrawer, MDCTextField} from '../src/components/mdc-compat.js';

describe('mdc-compat', () => {
  it('exporta MDCDialog, MDCDrawer y MDCTextField', () => {
    expect(MDCDialog).to.be.a('function');
    expect(MDCDrawer).to.be.a('function');
    expect(MDCTextField).to.be.a('function');
  });

  it('MDCDrawer.attachTo devuelve instancia con open', () => {
    const root = {classList: {contains: () => false, add() {}, remove() {}}, style: {}, nextElementSibling: null};
    const d = MDCDrawer.attachTo(root);
    expect(d).to.be.instanceOf(MDCDrawer);
    expect(d).to.have.property('open');
  });
});
