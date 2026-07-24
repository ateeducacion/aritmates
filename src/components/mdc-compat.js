/**
 * Compatibilidad mínima con la API de MDC usada por Aritmates,
 * sin depender de @material/dialog, @material/drawer ni @material/textfield.
 *
 * Se apoya en el CSS MDC ya copiado en css/mdc.*.min.css y en las clases
 * mdc-dialog--open / mdc-drawer--open del markup existente.
 *
 * @see docs/migration/COMPONENTES.md
 */

/**
 * Sustituto de MDCDialog: open() / close() con clases MDC.
 */
export class MDCDialog {
  /**
   * @param {HTMLElement} root elemento .mdc-dialog
   */
  constructor(root) {
    this.root = root;
    this._scrim = root ? root.querySelector('.mdc-dialog__scrim') : null;
    this._onScrim = (ev) => {
      if (ev.target === this._scrim) this.close();
    };
    this._onKey = (ev) => {
      if (ev.key === 'Escape') this.close();
    };
  }

  open() {
    if (!this.root) return;
    this.root.classList.add('mdc-dialog--open');
    this.root.style.display = 'flex';
    document.body.classList.add('mdc-dialog-scroll-lock');
    if (this._scrim) this._scrim.addEventListener('click', this._onScrim);
    document.addEventListener('keydown', this._onKey);
  }

  close() {
    if (!this.root) return;
    this.root.classList.remove('mdc-dialog--open', 'mdc-dialog--opening');
    this.root.style.display = 'none';
    document.body.classList.remove('mdc-dialog-scroll-lock');
    if (this._scrim) this._scrim.removeEventListener('click', this._onScrim);
    document.removeEventListener('keydown', this._onKey);
  }
}

/**
 * Sustituto de MDCDrawer: propiedad .open (boolean).
 * Para drawer modal: clase mdc-drawer--open; el scrim es el sibling .mdc-drawer-scrim.
 */
export class MDCDrawer {
  /**
   * @param {HTMLElement} root elemento .mdc-drawer
   */
  constructor(root) {
    this.root = root;
    this._onScrim = () => {
      this.open = false;
    };
  }

  static attachTo(root) {
    return new MDCDrawer(root);
  }

  get open() {
    return !!(this.root && this.root.classList.contains('mdc-drawer--open'));
  }

  set open(value) {
    if (!this.root) return;
    const scrim = this.root.nextElementSibling &&
      this.root.nextElementSibling.classList.contains('mdc-drawer-scrim')
      ? this.root.nextElementSibling
      : document.querySelector('.mdc-drawer-scrim');

    if (value) {
      this.root.classList.add('mdc-drawer--open');
      this.root.style.display = 'flex';
      if (scrim) {
        scrim.style.display = 'block';
        scrim.addEventListener('click', this._onScrim);
      }
      document.body.style.overflow = 'hidden';
    } else {
      this.root.classList.remove('mdc-drawer--open', 'mdc-drawer--opening');
      this.root.style.display = 'none';
      if (scrim) {
        scrim.style.display = 'none';
        scrim.removeEventListener('click', this._onScrim);
      }
      document.body.style.overflow = '';
    }
  }
}

/**
 * Sustituto de MDCTextField: no-op funcional.
 * El markup mdc-text-field + CSS ya aporta el aspecto; el input nativo funciona.
 */
export class MDCTextField {
  /**
   * @param {HTMLElement} _root
   */
  constructor(_root) {
    // Intencionalmente vacío: floating label animada de MDC no se emula.
  }
}

export default { MDCDialog, MDCDrawer, MDCTextField };
