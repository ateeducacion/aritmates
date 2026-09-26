import {expect} from 'chai';
import PaperCheckbox from '../src/components/paper-checkbox.js';
import MwcSwitch from '../src/components/mwc-switch.js';
import PaperDropdownMenu from '../src/components/paper-dropdown-menu.js';
import {PaperItem, PaperItemBody} from '../src/components/paper-item.js';
import {MDCDialog, MDCDrawer, MDCTextField} from '../src/components/mdc-compat.js';
import PaperExpansionPanel from '../src/widgets/paper-expansion-panel.js';
import {mount, fakeNode, withFakeDocument, withMouseEvent} from './helpers/fakeDom.js';

const key = (k) => ({key: k, prevented: false, preventDefault() {
  this.prevented = true;
}});

// paper-checkbox and mwc-switch share the same contract.
for (const [name, Clase, role] of [
  ['paper-checkbox', PaperCheckbox, 'checkbox'],
  ['mwc-switch', MwcSwitch, 'switch'],
]) {
  describe(`${name}: estado, accesibilidad y teclado`, () => {
    it('al conectarse fija rol, foco y estado ARIA', () => {
      const el = mount(Clase);
      el.connectedCallback();
      expect(el.getAttribute('role')).to.equal(role);
      expect(el.getAttribute('tabindex')).to.equal('0');
      expect(el.getAttribute('aria-checked')).to.equal('false');
      expect(el.getAttribute('aria-disabled')).to.equal('false');
      expect(el.listenerCount('click')).to.equal(1);
      expect(el.listenerCount('keydown')).to.equal(1);
    });

    it('respeta un rol y un tabindex ya puestos', () => {
      const el = mount(Clase);
      el.setAttribute('role', 'menuitemcheckbox');
      el.setAttribute('tabindex', '3');
      el.connectedCallback();
      expect(el.getAttribute('role')).to.equal('menuitemcheckbox');
      expect(el.getAttribute('tabindex')).to.equal('3');
    });

    it('checked y disabled se reflejan en atributos y en ARIA', () => {
      const el = mount(Clase);
      el.connectedCallback();
      el.checked = true;
      expect(el.hasAttribute('checked')).to.equal(true);
      expect(el.getAttribute('aria-checked')).to.equal('true');
      el.checked = true; // same value: no change
      el.checked = false;
      expect(el.getAttribute('aria-checked')).to.equal('false');
      el.disabled = true;
      expect(el.getAttribute('aria-disabled')).to.equal('true');
      expect(el.getAttribute('tabindex')).to.equal('-1');
      el.disabled = false;
      expect(el.getAttribute('tabindex')).to.equal('0');
    });

    it('un clic cambia el estado y avisa con change', () => {
      const el = mount(Clase);
      el.connectedCallback();
      el.dispatchEvent(new Event('click'));
      expect(el.checked).to.equal(true);
      expect(el.dispatched).to.include('change');
    });

    it('desactivado ignora clic y teclado', () => {
      const el = mount(Clase);
      el.disabled = true;
      el.connectedCallback();
      const ev = new Event('click', {cancelable: true});
      el.dispatchEvent(ev);
      el._onKeydown(key(' '));
      expect(el.checked).to.equal(false);
      expect(el.dispatched).to.not.include('change');
    });

    it('Espacio y Enter cambian el estado; otras teclas no', () => withMouseEvent(() => {
      const el = mount(Clase);
      el.connectedCallback();
      const space = key(' ');
      el._onKeydown(space);
      expect(space.prevented).to.equal(true);
      expect(el.checked).to.equal(true);
      el._onKeydown(key('Enter'));
      expect(el.checked).to.equal(false);
      el._onKeydown(key('a'));
      expect(el.checked).to.equal(false);
    }));

    it('al desconectarse retira sus escuchadores', () => {
      const el = mount(Clase);
      el.connectedCallback();
      el.disconnectedCallback();
      expect(el.listenerCount('click')).to.equal(0);
      expect(el.listenerCount('keydown')).to.equal(0);
    });
  });
}

describe('paper-checkbox: compatibilidad con Polymer', () => {
  it('además de change emite iron-change', () => {
    const el = mount(PaperCheckbox);
    el._onClick();
    expect(el.dispatched).to.deep.equal(['change', 'iron-change']);
  });
});

describe('mwc-switch: el teclado no cambia el estado dos veces', () => {
  it('el clic sintético que emite tras Espacio no vuelve a conmutar', () => withMouseEvent(() => {
    const el = mount(MwcSwitch);
    el.connectedCallback();
    el._onKeydown(key(' '));
    expect(el.checked).to.equal(true);
    expect(el.dispatched).to.deep.equal(['change', 'click']);
    expect(el._ignoreClick).to.equal(false);
  }));
});

describe('paper-dropdown-menu', () => {
  it('label, disabled y value se reflejan en atributos', () => {
    const el = mount(PaperDropdownMenu);
    expect(el.label).to.equal('');
    el.label = 'Resultado';
    expect(el.getAttribute('label')).to.equal('Resultado');
    el.label = '';
    expect(el.hasAttribute('label')).to.equal(false);
    el.disabled = true;
    expect(el.disabled).to.equal(true);
    el.disabled = false;
    expect(el.disabled).to.equal(false);
    el.value = 30;
    expect(el.value).to.equal('30');
    el.value = null;
    expect(el.hasAttribute('value')).to.equal(false);
  });

  it('sin shadow DOM conectar y cambiar atributos no falla', () => {
    const el = mount(PaperDropdownMenu);
    el.connectedCallback();
    el.attributeChangedCallback('label');
    el.disconnectedCallback();
    expect(el._select).to.equal(null);
  });

  it('con un select usa su valor y avisa del cambio', () => {
    const el = mount(PaperDropdownMenu);
    const select = fakeNode({value: '40', disabled: false});
    const label = fakeNode();
    el._root = {querySelector: (s) => (s === '.label' ? label : null)};
    el._select = select;
    expect(el.value).to.equal('40');
    el.label = 'Igual a';
    el._syncLabel();
    expect(label.textContent).to.equal('Igual a');
    expect(select.getAttribute('aria-label')).to.equal('Igual a');
    el.disabled = true;
    el.attributeChangedCallback('disabled');
    expect(select.disabled).to.equal(true);
    el._onSelectChange();
    expect(el.getAttribute('value')).to.equal('40');
    expect(el.dispatched).to.deep.equal(['value-changed', 'change']);
    el.value = '50'; // programmatic: no event
    expect(select.value).to.equal('50');
    expect(el.dispatched).to.have.length(2);
  });

  it('reconstruye las opciones a partir de los hijos', () => {
    withFakeDocument(() => {
      const el = mount(PaperDropdownMenu);
      const select = fakeNode({value: ''});
      el._select = select;
      el.querySelectorAll = (tag) => (tag === 'paper-item' ?
        [{textContent: ' 10 '}, {textContent: ''}] :
        [{textContent: '', value: '20'}]);
      el._rebuildOptions();
      expect(select.children.map((o) => o.value)).to.deep.equal(['', '10', '20']);
    });
  });
});

describe('paper-item', () => {
  it('se construye fuera del navegador sin shadow DOM', () => {
    expect(new PaperItem()).to.be.instanceOf(PaperItem);
    expect(new PaperItemBody()).to.be.instanceOf(PaperItemBody);
  });
});

describe('paper-expansion-panel', () => {
  it('opened, header, summary, icon y no-animation leen sus atributos', () => {
    const el = mount(PaperExpansionPanel);
    expect(el.opened).to.equal(false);
    el.opened = true;
    el.opened = true; // no change
    expect(el.hasAttribute('opened')).to.equal(true);
    el.opened = false;
    el.header = 'Suma';
    expect(el.header).to.equal('Suma');
    el.header = '';
    expect(el.hasAttribute('header')).to.equal(false);
    el.setAttribute('summary', 'Cómo sumar');
    el.setAttribute('icon', 'icons:help-outline');
    el.setAttribute('no-animation', '');
    expect(el.summary).to.equal('Cómo sumar');
    expect(el.icon).to.equal('icons:help-outline');
    expect(el.noAnimation).to.equal(true);
  });

  it('sin shadow DOM al pulsar la cabecera se abre y avisa', () => {
    const el = mount(PaperExpansionPanel);
    el.connectedCallback();
    el._onHeaderActivate();
    expect(el.opened).to.equal(true);
    expect(el.dispatched).to.deep.equal(['toggle']);
    el.disconnectedCallback();
  });

  it('dibuja cabecera, resumen, icono y estado ARIA', () => {
    withFakeDocument(() => {
      const parts = {
        '.header': fakeNode(), '.title': fakeNode(), '.summary': fakeNode(),
        '.toggle': fakeNode(), '.content': fakeNode(),
      };
      const el = mount(PaperExpansionPanel);
      el._root = {innerHTML: '', querySelector: (s) => parts[s]};
      el.setAttribute('header', 'Resta');
      el.setAttribute('summary', 'Resumen');
      el.setAttribute('icon', 'icons:help-outline');
      el.connectedCallback();
      expect(parts['.title'].children[0].textContent).to.equal('help_outline');
      expect(parts['.title'].children[1].textContent).to.equal('Resta');
      expect(parts['.summary'].hidden).to.equal(false);
      expect(parts['.toggle'].textContent).to.equal('expand_more');
      expect(parts['.header'].getAttribute('aria-expanded')).to.equal('false');

      parts['.header'].fire('click');
      expect(el.opened).to.equal(true);
      expect(parts['.summary'].hidden).to.equal(true);
      expect(parts['.toggle'].textContent).to.equal('expand_less');
      expect(parts['.content'].getAttribute('aria-hidden')).to.equal('false');

      el.removeAttribute('icon');
      expect(parts['.title'].children).to.have.length(1);
      el.disconnectedCallback();
      expect(parts['.header'].listenerCount('click')).to.equal(0);
    });
  });
});

describe('mdc-compat', () => {
  it('MDCDialog abre, bloquea el scroll y cierra con Escape o el fondo', () => {
    withFakeDocument((doc) => {
      const scrim = fakeNode();
      const root = fakeNode({querySelector: () => scrim});
      const dialog = new MDCDialog(root);
      dialog.open();
      expect(root.classList.contains('mdc-dialog--open')).to.equal(true);
      expect(root.style.display).to.equal('flex');
      expect(doc.body.classList.contains('mdc-dialog-scroll-lock')).to.equal(true);

      doc.listeners.keydown.forEach((fn) => fn({key: 'Enter'}));
      expect(root.style.display).to.equal('flex');
      doc.listeners.keydown.forEach((fn) => fn({key: 'Escape'}));
      expect(root.style.display).to.equal('none');
      expect(doc.listeners.keydown).to.have.length(0);

      dialog.open();
      scrim.fire('click', {target: scrim});
      expect(root.classList.contains('mdc-dialog--open')).to.equal(false);
    });
  });

  it('MDCDialog sin raíz no hace nada', () => {
    const dialog = new MDCDialog(null);
    dialog.open();
    dialog.close();
    expect(dialog.root).to.equal(null);
  });

  it('MDCDrawer abre y cierra con su fondo, aunque no sea hermano', () => {
    const scrim = fakeNode();
    withFakeDocument((doc) => {
      const root = fakeNode({nextElementSibling: null});
      const drawer = MDCDrawer.attachTo(root);
      drawer.open = true;
      expect(drawer.open).to.equal(true);
      expect(scrim.style.display).to.equal('block');
      expect(doc.body.style.overflow).to.equal('hidden');
      scrim.fire('click');
      expect(drawer.open).to.equal(false);
      expect(scrim.style.display).to.equal('none');
      expect(doc.body.style.overflow).to.equal('');
    }, {scrim});
  });

  it('MDCDrawer sin raíz no hace nada y MDCTextField es inocuo', () => {
    const drawer = new MDCDrawer(null);
    drawer.open = true;
    expect(drawer.open).to.equal(false);
    expect(new MDCTextField(fakeNode())).to.be.instanceOf(MDCTextField);
  });
});

describe('Componentes con shadow DOM', () => {
  it('casilla e interruptor crean su interior al conectarse, una sola vez', () => {
    for (const [Clase, part] of [[PaperCheckbox, 'box'], [MwcSwitch, 'track']]) {
      const el = mount(Clase, {shadow: {}});
      el.connectedCallback();
      expect(el._root.innerHTML).to.include(`class="${part}"`);
    }
    const ya = mount(PaperCheckbox, {shadow: {'.box': fakeNode()}});
    ya.connectedCallback();
    expect(ya._root.innerHTML).to.equal('');
  });

  it('un interruptor desactivado empieza fuera del orden de tabulación', () => {
    const el = mount(MwcSwitch, {attrs: {disabled: ''}});
    el.connectedCallback();
    expect(el.getAttribute('tabindex')).to.equal('-1');
    const click = {prevented: false, stopped: false,
      preventDefault() {
        this.prevented = true;
      },
      stopImmediatePropagation() {
        this.stopped = true;
      }};
    el._onActivate(click);
    expect(click.prevented && click.stopped).to.equal(true);
  });

  it('paper-item y paper-item-body pintan su hueco para el contenido', () => {
    const item = mount(PaperItem, {shadow: {}});
    const body = mount(PaperItemBody, {shadow: {}});
    expect(item.shadowRoot.innerHTML).to.include('<slot></slot>');
    expect(body.shadowRoot.innerHTML).to.include('<slot></slot>');
  });

  it('el panel se dibuja en su shadow DOM y reacciona a los atributos', () => {
    withFakeDocument(() => {
      const parts = {
        '.header': fakeNode(), '.title': fakeNode(), '.summary': fakeNode(),
        '.toggle': fakeNode(), '.content': fakeNode(),
      };
      const el = mount(PaperExpansionPanel, {shadow: parts});
      el.connectedCallback();
      expect(el._root.innerHTML).to.include('class="header"');
      el.setAttribute('opened', '');
      expect(parts['.header'].getAttribute('aria-expanded')).to.equal('true');
      expect(parts['.title'].children[0].textContent).to.equal(' ');
    });
  });

  it('el desplegable crea su select, sigue a sus hijos y avisa de los cambios', () => {
    const observers = [];
    class FakeMutationObserver {
      constructor(cb) {
        this.cb = cb;
        observers.push(this);
      }
      observe() {}
      disconnect() {
        this.disconnected = true;
      }
    }
    const previous = globalThis.MutationObserver;
    globalThis.MutationObserver = FakeMutationObserver;
    try {
      withFakeDocument(() => {
        const select = fakeNode({value: ''});
        const label = fakeNode();
        const el = mount(PaperDropdownMenu, {
          attrs: {label: 'Resultado', disabled: ''},
          shadow: {'select': select, '.label': label},
        });
        let hijos = [{textContent: '30'}];
        el.querySelectorAll = (tag) => (tag === 'paper-item' ? hijos : []);
        el.connectedCallback();
        expect(el._root.innerHTML).to.include('<select');
        expect(select.disabled).to.equal(true);
        expect(label.textContent).to.equal('Resultado');
        expect(select.children.map((o) => o.value)).to.deep.equal(['', '30']);

        hijos = [{textContent: '30'}, {textContent: '40'}];
        select.value = '30';
        observers[0].cb();
        expect(select.children.map((o) => o.value)).to.deep.equal(['', '30', '40']);
        expect(select.value).to.equal('30');

        el.label = '';
        el._syncLabel();
        expect(label.hidden).to.equal(true);
        expect(select.getAttribute('aria-label')).to.equal(null);

        select.value = '';
        select.fire('change');
        expect(el.hasAttribute('value')).to.equal(false);
        el._suppress = true;
        el._onSelectChange();
        expect(el.dispatched.filter((t) => t === 'change')).to.have.length(1);

        el.disconnectedCallback();
        expect(observers[0].disconnected).to.equal(true);
        expect(select.listenerCount('change')).to.equal(0);
      });
    } finally {
      if (previous === undefined) delete globalThis.MutationObserver;
      else globalThis.MutationObserver = previous;
    }
  });

  it('el cajón usa el fondo que tiene justo al lado', () => {
    withFakeDocument(() => {
      const scrim = fakeNode();
      scrim.classList.add('mdc-drawer-scrim');
      const drawer = new MDCDrawer(fakeNode({nextElementSibling: scrim}));
      drawer.open = true;
      expect(scrim.style.display).to.equal('block');
    });
  });
});
