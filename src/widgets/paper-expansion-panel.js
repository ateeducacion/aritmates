/**
 * Sustituto nativo de paper-expansion-panel (antes Polymer).
 *
 * Atributos: header, summary, icon, opened, no-animation
 * Propiedad: opened (boolean, reflect)
 * Evento: toggle (al abrir/cerrar)
 * Slot por defecto: contenido colapsable
 *
 * Iconos de cabecera/toggle: fuente Material Icons (ya cargada en la app).
 * No usa iron-icons ni iron-collapse.
 *
 * @see docs/migration/COMPONENTES.md
 */

const STYLE = `
:host {
  display: block;
  font-family: Roboto, "Helvetica Neue", sans-serif;
}
.header {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px 0 16px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  background: transparent;
  border: none;
  width: 100%;
  box-sizing: border-box;
  text-align: left;
}
.header:focus-visible {
  outline: 2px solid var(--colorPrincipal, #0F4C81);
  outline-offset: -2px;
}
.title {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.title .mi {
  font-size: 20px;
  width: 24px;
  height: 24px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.54);
}
.summary {
  flex: 1;
  color: rgba(0, 0, 0, 0.54);
  font-size: 14px;
}
.toggle {
  flex-shrink: 0;
  border: none;
  background: transparent;
  color: rgba(0, 0, 0, 0.38);
  cursor: pointer;
  padding: 8px;
  margin: 0;
  font-family: "Material Icons";
  font-size: 24px;
  line-height: 1;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.toggle:hover {
  background: rgba(0, 0, 0, 0.04);
}
.content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.2s ease;
  background: white;
  font-size: 14px;
  line-height: 20px;
}
.content > .inner {
  overflow: hidden;
  min-height: 0;
  padding-top: 0;
}
:host([opened]) .content {
  grid-template-rows: 1fr;
}
:host([opened]) .content > .inner {
  padding-top: 0.5em;
}
:host([no-animation]) .content {
  transition: none;
}
.mi {
  font-family: "Material Icons";
  font-weight: normal;
  font-style: normal;
  display: inline-block;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
}
`;

const ElementBase = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};

/**
 * Convierte iconos estilo iron ("icons:help-outline" o "help-outline") a nombre Material Icons.
 */
function materialIconName(icon) {
  if (!icon) return '';
  const raw = String(icon).includes(':') ? String(icon).split(':').pop() : String(icon);
  return raw.replace(/-/g, '_');
}

class PaperExpansionPanel extends ElementBase {
  static get observedAttributes() {
    return ['header', 'summary', 'icon', 'opened', 'no-animation'];
  }

  constructor() {
    super();
    this._onHeaderActivate = this._onHeaderActivate.bind(this);
    if (typeof this.attachShadow === 'function') {
      this._root = this.attachShadow({ mode: 'open' });
    } else {
      this._root = null;
    }
  }

  connectedCallback() {
    this._render();
    this._bind();
  }

  disconnectedCallback() {
    const header = this._root && this._root.querySelector('.header');
    if (header) header.removeEventListener('click', this._onHeaderActivate);
  }

  attributeChangedCallback() {
    if (this._root && this._root.querySelector('.header')) {
      this._syncDom();
    }
  }

  get opened() {
    return this.hasAttribute('opened');
  }

  set opened(value) {
    const next = Boolean(value);
    if (next === this.opened) return;
    if (next) this.setAttribute('opened', '');
    else this.removeAttribute('opened');
  }

  get header() {
    return this.getAttribute('header') || '';
  }

  set header(value) {
    if (value == null || value === '') this.removeAttribute('header');
    else this.setAttribute('header', value);
  }

  get summary() {
    return this.getAttribute('summary') || '';
  }

  get icon() {
    return this.getAttribute('icon') || '';
  }

  get noAnimation() {
    return this.hasAttribute('no-animation');
  }

  _render() {
    if (!this._root) return;
    this._root.innerHTML = `
      <style>${STYLE}</style>
      <button type="button" class="header" part="header" aria-expanded="false">
        <span class="title" part="title"></span>
        <span class="summary" part="summary" hidden></span>
        <span class="toggle mi" part="toggle" aria-hidden="true">expand_more</span>
      </button>
      <div class="content" part="content">
        <div class="inner">
          <slot></slot>
        </div>
      </div>
    `;
    this._syncDom();
  }

  _bind() {
    if (!this._root) return;
    const header = this._root.querySelector('.header');
    header.addEventListener('click', this._onHeaderActivate);
  }

  _syncDom() {
    if (!this._root) return;
    const titleEl = this._root.querySelector('.title');
    const summaryEl = this._root.querySelector('.summary');
    const toggleEl = this._root.querySelector('.toggle');
    const contentEl = this._root.querySelector('.content');
    const headerBtn = this._root.querySelector('.header');

    const iconName = materialIconName(this.icon);
    const headerText = this.header;
    titleEl.innerHTML = '';
    if (iconName) {
      const ic = document.createElement('span');
      ic.className = 'mi';
      ic.textContent = iconName;
      titleEl.appendChild(ic);
    }
    titleEl.appendChild(document.createTextNode(headerText || '\u00a0'));

    const sum = this.summary;
    if (sum && !this.opened) {
      summaryEl.hidden = false;
      summaryEl.textContent = sum;
    } else {
      summaryEl.hidden = true;
      summaryEl.textContent = '';
    }

    toggleEl.textContent = this.opened ? 'expand_less' : 'expand_more';
    contentEl.setAttribute('aria-hidden', this.opened ? 'false' : 'true');
    headerBtn.setAttribute('aria-expanded', this.opened ? 'true' : 'false');
  }

  _onHeaderActivate(ev) {
    // No togglear si el click es en un control del slot (no aplica: slot está en content)
    this.opened = !this.opened;
    this._syncDom();
    this.dispatchEvent(new Event('toggle', { bubbles: true, composed: true }));
  }
}

if (typeof customElements !== 'undefined') {
  // Redefinir si existía la versión Polymer (este módulo se importa en su lugar)
  if (customElements.get('paper-expansion-panel')) {
    // En navegadores no se puede redefinir; confiar en que no se cargó Polymer
    console.warn('[paper-expansion-panel] ya registrado; se mantiene la definición existente');
  } else {
    customElements.define('paper-expansion-panel', PaperExpansionPanel);
  }
}

export default PaperExpansionPanel;
