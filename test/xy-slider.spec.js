const expect = require('chai').expect;
import XySlider from '../src/components/xy-slider.js';

describe('xy-slider vendored', () => {
  it('exporta la clase XySlider', () => {
    expect(XySlider).to.be.a('function');
  });
});
