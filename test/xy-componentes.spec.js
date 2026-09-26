import {expect} from 'chai';
import XySlider from '../src/components/xy-slider.js';
import XyTips from '../src/components/xy-tips.js';
import {mount, fakeNode, withFakeDocument} from './helpers/fakeDom.js';

function slider(attrs = {}) {
  const input = fakeNode({value: '0', focused: false, focus() {
    this.focused = true;
  }});
  const con = fakeNode();
  const el = mount(XySlider, {attrs, shadow: {'slider': input, 'slider-con': con}});
  return {el, input, con};
}

function withGlobal(name, value, fn) {
  const had = name in globalThis;
  const previous = globalThis[name];
  globalThis[name] = value;
  try {
    return fn();
  } finally {
    if (had) globalThis[name] = previous;
    else delete globalThis[name];
  }
}

describe('xy-slider', () => {
  it('monta la plantilla con los valores por defecto', () => {
    const {el} = slider();
    expect(el.shadowRoot.innerHTML).to.include("min=0 max=100 step=1");
    expect(el.shadowRoot.innerHTML).to.include('dir=top');
    expect([el.min, el.max, el.step, el.defaultvalue]).to.deep.equal([0, 100, 1, 0]);
    expect([el.suffix, el.prefix]).to.deep.equal(['', '']);
    expect([el.disabled, el.showtips, el.vertical]).to.deep.equal([false, false, false]);
  });

  it('usa los atributos del marcado, incluido el nombre accesible', () => {
    const {el, input} = slider({'min': '1', 'max': '20', 'step': '1', 'defaultvalue': '10',
      'disabled': '', 'suffix': ' s', 'aria-label': 'Nivel'});
    expect(el.shadowRoot.innerHTML).to.include('disabled type');
    el.connectedCallback();
    expect(el.slider).to.equal(input);
    expect(input.getAttribute('aria-label')).to.equal('Nivel');
    el.focus();
    expect(input.focused).to.equal(true);
  });

  it('al mover el control avisa con input y al soltar con change', () => {
    const {el, input, con} = slider({showtips: ''});
    el.connectedCallback();
    input.value = '40';
    let stopped = false;
    input.fire('input', {stopPropagation: () => {
      stopped = true;
    }});
    expect(stopped).to.equal(true);
    expect(el._oninput).to.equal(true);
    expect(con.tips).to.equal(40);
    expect(con.style.props['--percent']).to.equal(0.4);
    input.fire('change');
    expect(el._oninput).to.equal(false);
    expect(el.dispatched).to.deep.equal(['input', 'change']);
  });

  it('la rueda del ratón mueve cinco pasos solo cuando el control tiene el foco', () => {
    const {el, input} = slider({step: '2'});
    el.connectedCallback();
    input.value = '50';
    const wheel = (deltaY) => el._listeners.wheel[0]({deltaY, preventDefault() {}});
    withGlobal('getComputedStyle', () => ({zIndex: '1'}), () => wheel(-1));
    expect(el.value).to.equal(50);
    withGlobal('getComputedStyle', () => ({zIndex: '2'}), () => {
      wheel(-1);
      expect(el.value).to.equal(40);
      wheel(1);
      expect(el.value).to.equal(50);
    });
  });

  it('disabled, showtips y el resto de propiedades se reflejan en atributos', () => {
    const {el, input, con} = slider();
    el.connectedCallback();
    el.disabled = true;
    expect(input.getAttribute('disabled')).to.equal('disabled');
    el.disabled = false;
    expect(input.getAttribute('disabled')).to.equal(null);
    el.showtips = true;
    expect(el.showtips).to.equal(true);
    el.value = 30;
    expect(con.tips).to.equal(30);
    el.showtips = null;
    el.value = 20;
    expect(con.tips).to.equal('');
    el.min = 10;
    el.max = 50;
    el.step = 5;
    el.prefix = '+';
    el.suffix = ' pts';
    expect([el.min, el.max, el.step, el.prefix]).to.deep.equal(['10', '50', '5', '+']);
    expect(con.suffix).to.equal(' pts');
    expect(input.max).to.equal('50');
  });

  it('mientras se arrastra no reescribe los atributos', () => {
    const {el, input} = slider();
    el.connectedCallback();
    el._oninput = true;
    el.setAttribute('max', '10');
    expect(input.max).to.equal(undefined);
  });

  it('en vertical observa su tamaño y deja de hacerlo al desconectarse', () => {
    const observed = [];
    class FakeResizeObserver {
      constructor(cb) {
        this.cb = cb;
      }
      observe(target) {
        observed.push(target);
        this.cb([{contentRect: {height: 120}}]);
      }
      unobserve(target) {
        observed.splice(observed.indexOf(target), 1);
      }
    }
    withGlobal('ResizeObserver', FakeResizeObserver, () => {
      const {el, con} = slider({vertical: ''});
      expect(el.shadowRoot.innerHTML).to.include('dir=right');
      el.connectedCallback();
      expect(observed).to.have.length(1);
      expect(con.style.props['--h']).to.equal('120px');
      el.disconnectedCallback();
      expect(observed).to.have.length(0);
    });
    const {el} = slider();
    el.connectedCallback();
    el.disconnectedCallback();
  });
});

describe('xy-tips', () => {
  const tips = (attrs = {}) => mount(XyTips, {attrs, shadow: {}});

  it('lee y escribe sus atributos con valores por defecto', () => {
    const el = tips();
    expect(el.shadowRoot.innerHTML).to.include('<slot></slot>');
    expect([el.color, el.dir, el.tips, el.type, el.suffix, el.prefix, el.show])
        .to.deep.equal(['', 'top', null, null, '', '', false]);
    el.color = 'red';
    el.dir = 'left';
    el.tips = '5';
    el.suffix = ' s';
    el.prefix = '+';
    el.show = true;
    el.type = 'success';
    expect([el.color, el.dir, el.tips, el.suffix, el.prefix, el.show])
        .to.deep.equal(['red', 'left', '5', ' s', '+', true]);
    expect(el.getAttribute('type')).to.equal('success');
  });

  it('el color se aplica como variable CSS', () => {
    const el = tips();
    el.color = '#0C2C84';
    expect(el.style.props['--color']).to.equal('#0C2C84');
  });

  it('con dir="auto" elige el lado con sitio', () => {
    const cases = [
      [{left: 200, top: 10, width: 20, height: 20}, 'bottom'],
      [{left: 200, top: 700, width: 20, height: 20}, 'top'],
      [{left: 10, top: 300, width: 20, height: 20}, 'right'],
      [{left: 990, top: 300, width: 20, height: 20}, 'left'],
    ];
    withFakeDocument((doc) => {
      doc.body.scrollWidth = 1024;
      doc.body.scrollHeight = 768;
      for (const [rect, dir] of cases) {
        const el = tips({dir: 'auto'});
        el.getBoundingClientRect = () => rect;
        el.connectedCallback();
        expect(el.dir, JSON.stringify(rect)).to.equal(dir);
      }
    });
    const fixed = tips({dir: 'left'});
    fixed.connectedCallback();
    expect(fixed.dir).to.equal('left');
  });
});
