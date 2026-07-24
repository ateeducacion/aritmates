/**
 * Sustituto nativo de @polymer/paper-checkbox.
 *
 * Mantiene el tag <paper-checkbox>, la propiedad/atributo `checked`,
 * `disabled`, el texto hijo como etiqueta y el evento `change` (bubbles),
 * para no alterar app.js ni las plantillas HTML.
 *
 * Apariencia: checkbox Material 18×18 alineado con paper-checkbox legacy.
 * No incluye ripple completo de Polymer (cambio visual mínimo intencional;
 * validar con capturas visuales).
 *
 * @see docs/migration/COMPONENTES.md
 */

const STYLE = `
:host {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  cursor: pointer;
  line-height: normal;
  vertical-align: middle;
  -webkit-tap-highlight-color: transparent;
  font-family: Roboto, "Helvetica Neue", sans-serif;
  font-size: 14px;
  color: var(--primary-text-color, rgba(0, 0, 0, 0.87));
  outline: none;
  user-select: none;
}
:host([hidden]) { display: none !important; }
:host([disabled]) {
  cursor: default;
  pointer-events: none;
  color: var(--paper-checkbox-label-color, rgba(0, 0, 0, 0.38));
  opacity: 0.7;
}
.box {
  box-sizing: border-box;
  width: 18px;
  height: 18px;
  min-width: 18px;
  margin-right: 8px;
  border: 2px solid var(--paper-checkbox-unchecked-color, rgba(0, 0, 0, 0.54));
  border-radius: 2px;
  background: transparent;
  position: relative;
  transition: background-color 140ms, border-color 140ms;
}
:host([checked]) .box {
  background-color: var(--paper-checkbox-checked-color, var(--primary-color, #3f51b5));
  border-color: var(--paper-checkbox-checked-color, var(--primary-color, #3f51b5));
}
:host([disabled]) .box {
  border-color: var(--paper-checkbox-unchecked-color, rgba(0, 0, 0, 0.26));
  background: transparent;
}
:host([disabled][checked]) .box {
  background-color: var(--paper-checkbox-unchecked-color, rgba(0, 0, 0, 0.26));
  border-color: transparent;
}
.box::after {
  content: "";
  position: absolute;
  display: none;
  left: 4px;
  top: 0px;
  width: 5px;
  height: 10px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
:host([checked]) .box::after {
  display: block;
}
.label {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  white-space: normal;
}
:host(:focus-visible) .box {
  box-shadow: 0 0 0 8px rgba(63, 81, 181, 0.15);
}
`;

// HTMLElement no existe en el runner de tests Node; usar base vacía allí.
const ElementBase = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};

class PaperCheckbox extends ElementBase {
  static get observedAttributes() {
    return ['checked', 'disabled'];
  }

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
    if (typeof this.attachShadow === 'function') {
      this._root = this.attachShadow({ mode: 'open' });
    } else {
      this._root = { innerHTML: '', querySelector: () => null };
    }
  }

  connectedCallback() {
    if (!this._root.querySelector('.box')) {
      this._root.innerHTML = `
        <style>${STYLE}</style>
        <span class="box" part="box" aria-hidden="true"></span>
        <span class="label" part="label"><slot></slot></span>
      `;
    }
    if (!this.hasAttribute('role')) this.setAttribute('role', 'checkbox');
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');
    this.setAttribute('aria-checked', this.checked ? 'true' : 'false');
    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
    this.addEventListener('click', this._onClick);
    this.addEventListener('keydown', this._onKeydown);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._onClick);
    this.removeEventListener('keydown', this._onKeydown);
  }

  attributeChangedCallback(name) {
    if (name === 'checked') {
      this.setAttribute('aria-checked', this.checked ? 'true' : 'false');
    }
    if (name === 'disabled') {
      this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
      this.setAttribute('tabindex', this.disabled ? '-1' : '0');
    }
  }

  get checked() {
    return this.hasAttribute('checked');
  }

  set checked(value) {
    const next = Boolean(value);
    if (next === this.checked) return;
    if (next) this.setAttribute('checked', '');
    else this.removeAttribute('checked');
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    if (value) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  _onClick(ev) {
    if (this.disabled) return;
    // Evitar doble toggle si el click viene del label interno
    this.checked = !this.checked;
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    // Compatibilidad con listeners iron-change de Polymer
    this.dispatchEvent(new CustomEvent('iron-change', { bubbles: true, composed: true }));
  }

  _onKeydown(ev) {
    if (this.disabled) return;
    if (ev.key === ' ' || ev.key === 'Enter') {
      ev.preventDefault();
      this._onClick(ev);
    }
  }
}

// Solo registrar en navegador si no existe (p. ej. tests o import duplicado)
if (typeof customElements !== 'undefined' && !customElements.get('paper-checkbox')) {
  customElements.define('paper-checkbox', PaperCheckbox);
}

export default PaperCheckbox;
