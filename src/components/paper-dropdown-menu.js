/**
 * Sustituto nativo de @polymer/paper-dropdown-menu.
 *
 * Conserva el tag y la API usada en Aritmates:
 * - .value (get/set) — texto del ítem seleccionado
 * - .disabled
 * - atributo label
 * - evento `value-changed` (y `change` nativo)
 *
 * Lee opciones de hijos light DOM:
 *   <paper-listbox><paper-item>10</paper-item>…</paper-listbox>
 * o de <option> nativos.
 *
 * @author Área de Tecnología Educativa (versión simplificada 1.3+)
 * @see docs/migration/COMPONENTES.md
 */

const STYLE = `
:host {
  display: inline-block;
  position: relative;
  font-family: Roboto, "Helvetica Neue", sans-serif;
  font-size: 14px;
  min-width: 7em;
  vertical-align: middle;
}
:host([hidden]) { display: none !important; }
:host([disabled]) {
  opacity: 0.5;
  pointer-events: none;
}
.label {
  display: block;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.54);
  margin-bottom: 2px;
}
select {
  display: block;
  width: 100%;
  min-width: 7em;
  padding: 6px 28px 6px 8px;
  font: inherit;
  color: rgba(0, 0, 0, 0.87);
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.42);
  border-radius: 0;
  background: transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' width='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23757575' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") no-repeat right 0 center;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  outline: none;
}
select:focus {
  border-bottom-color: var(--colorPrincipal, #0F4C81);
  border-bottom-width: 2px;
  padding-bottom: 5px;
}
/* Ocultar markup Polymer de opciones en light DOM */
::slotted(paper-listbox),
::slotted(paper-item),
::slotted(.dropdown-content) {
  display: none !important;
}
`;

const ElementBase = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};

class PaperDropdownMenu extends ElementBase {
  static get observedAttributes() {
    return ['label', 'disabled'];
  }

  constructor() {
    super();
    this._onSelectChange = this._onSelectChange.bind(this);
    if (typeof this.attachShadow === 'function') {
      this._root = this.attachShadow({ mode: 'open' });
    } else {
      this._root = null;
    }
    this._select = null;
    this._suppress = false;
  }

  connectedCallback() {
    this._render();
    this._rebuildOptions();
    // Observar mutaciones de hijos por si el slot se rellena tarde
    if (typeof MutationObserver !== 'undefined') {
      this._mo = new MutationObserver(() => this._rebuildOptions());
      this._mo.observe(this, { childList: true, subtree: true, characterData: true });
    }
  }

  disconnectedCallback() {
    if (this._mo) this._mo.disconnect();
    if (this._select) this._select.removeEventListener('change', this._onSelectChange);
  }

  attributeChangedCallback(name) {
    if (!this._root) return;
    if (name === 'label') this._syncLabel();
    if (name === 'disabled' && this._select) {
      this._select.disabled = this.disabled;
    }
  }

  get label() {
    return this.getAttribute('label') || '';
  }

  set label(v) {
    if (v == null || v === '') this.removeAttribute('label');
    else this.setAttribute('label', v);
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(v) {
    if (v) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  get value() {
    if (this._select) return this._select.value;
    return this.getAttribute('value') || '';
  }

  set value(v) {
    const s = v == null ? '' : String(v);
    if (this._select) {
      this._suppress = true;
      this._select.value = s;
      this._suppress = false;
    }
    if (s) this.setAttribute('value', s);
    else this.removeAttribute('value');
  }

  _render() {
    if (!this._root) return;
    this._root.innerHTML = `
      <style>${STYLE}</style>
      <span class="label" part="label"></span>
      <select part="select"></select>
      <slot></slot>
    `;
    this._select = this._root.querySelector('select');
    this._select.addEventListener('change', this._onSelectChange);
    this._syncLabel();
    this._select.disabled = this.disabled;
  }

  _syncLabel() {
    const el = this._root && this._root.querySelector('.label');
    if (!el) return;
    el.textContent = this.label;
    el.hidden = !this.label;
  }

  _collectOptions() {
    const texts = [];
    // paper-item dentro del host
    this.querySelectorAll('paper-item').forEach((item) => {
      const t = (item.textContent || '').trim();
      if (t) texts.push(t);
    });
    // option nativos
    this.querySelectorAll('option').forEach((opt) => {
      const t = (opt.textContent || opt.value || '').trim();
      if (t) texts.push(t);
    });
    return texts;
  }

  _rebuildOptions() {
    if (!this._select) return;
    const prev = this.value;
    const opts = this._collectOptions();
    this._select.innerHTML = '';
    // Opción vacía inicial (paper-dropdown a menudo empieza sin selección)
    const empty = document.createElement('option');
    empty.value = '';
    empty.textContent = '';
    this._select.appendChild(empty);
    opts.forEach((t) => {
      const o = document.createElement('option');
      o.value = t;
      o.textContent = t;
      this._select.appendChild(o);
    });
    if (prev) this._select.value = prev;
  }

  _onSelectChange() {
    if (this._suppress) return;
    const v = this._select.value;
    if (v) this.setAttribute('value', v);
    else this.removeAttribute('value');
    this.dispatchEvent(new CustomEvent('value-changed', {
      bubbles: true,
      composed: true,
      detail: { value: v },
    }));
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('paper-dropdown-menu')) {
  customElements.define('paper-dropdown-menu', PaperDropdownMenu);
}

export default PaperDropdownMenu;
