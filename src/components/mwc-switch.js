/**
 * Sustituto nativo de @material/mwc-switch.
 *
 * Mantiene el tag <mwc-switch>, propiedades/atributos `checked` y `disabled`,
 * y eventos `change` / `click` (bubbles), para no alterar app.js ni plantillas.
 *
 * Apariencia: switch Material (track + thumb), color activo vía
 * --mdc-theme-secondary / --colorPrincipal (#0F4C81 en Aritmates).
 *
 * @see docs/migration/COMPONENTES.md
 */

const STYLE = `
:host {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  cursor: pointer;
  width: 36px;
  height: 20px;
  position: relative;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  flex-shrink: 0;
}
:host([hidden]) { display: none !important; }
:host([disabled]) {
  cursor: default;
  pointer-events: none;
  opacity: 0.38;
}
.track {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 14px;
  margin-top: -7px;
  border-radius: 7px;
  background: rgba(0, 0, 0, 0.38);
  transition: background-color 90ms cubic-bezier(0.4, 0, 0.2, 1);
}
:host([checked]) .track {
  background: var(--mdc-theme-secondary, var(--colorPrincipal, #0F4C81));
  opacity: 0.5;
}
.thumb {
  position: absolute;
  top: 50%;
  left: 0;
  width: 20px;
  height: 20px;
  margin-top: -10px;
  border-radius: 50%;
  background: #fafafa;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  transition: transform 90ms cubic-bezier(0.4, 0, 0.2, 1),
              background-color 90ms cubic-bezier(0.4, 0, 0.2, 1);
}
:host([checked]) .thumb {
  transform: translateX(16px);
  background: var(--mdc-theme-secondary, var(--colorPrincipal, #0F4C81));
}
:host(:focus-visible) .thumb {
  box-shadow: 0 0 0 8px rgba(15, 76, 129, 0.18), 0 1px 3px rgba(0, 0, 0, 0.4);
}
:host([checked]:focus-visible) .thumb {
  box-shadow: 0 0 0 8px rgba(15, 76, 129, 0.25), 0 1px 3px rgba(0, 0, 0, 0.4);
}
`;

const ElementBase = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};

class MwcSwitch extends ElementBase {
  static get observedAttributes() {
    return ['checked', 'disabled'];
  }

  constructor() {
    super();
    this._onActivate = this._onActivate.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
    if (typeof this.attachShadow === 'function') {
      this._root = this.attachShadow({ mode: 'open' });
    } else {
      this._root = { innerHTML: '', querySelector: () => null };
    }
  }

  connectedCallback() {
    if (!this._root.querySelector('.track')) {
      this._root.innerHTML = `
        <style>${STYLE}</style>
        <span class="track" part="track" aria-hidden="true"></span>
        <span class="thumb" part="thumb" aria-hidden="true"></span>
      `;
    }
    if (!this.hasAttribute('role')) this.setAttribute('role', 'switch');
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', this.disabled ? '-1' : '0');
    }
    this.setAttribute('aria-checked', this.checked ? 'true' : 'false');
    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
    this.addEventListener('click', this._onActivate);
    this.addEventListener('keydown', this._onKeydown);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._onActivate);
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

  /**
   * Toggle por click del usuario.
   * Dispara change (como mwc-switch). El evento click nativo burbujea
   * para los listeners jQuery .on('click', …) de app.js.
   */
  _onActivate(ev) {
    if (this.disabled) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      return;
    }
    // Clicks sintéticos desde teclado: no volver a hacer toggle
    if (this._ignoreClick) {
      this._ignoreClick = false;
      return;
    }
    this.checked = !this.checked;
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  _onKeydown(ev) {
    if (this.disabled) return;
    if (ev.key === ' ' || ev.key === 'Enter') {
      ev.preventDefault();
      this.checked = !this.checked;
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
      // Propagar click para listeners jQuery sin re-toggle
      this._ignoreClick = true;
      this.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        composed: true,
        cancelable: true,
      }));
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('mwc-switch')) {
  customElements.define('mwc-switch', MwcSwitch);
}

export default MwcSwitch;
