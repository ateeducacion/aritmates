/**
 * Sustitutos nativos de paper-item y paper-item-body (Polymer).
 * Solo layout: contenedores de bloque usados dentro de paneles y dropdown.
 *
 * @see docs/migration/COMPONENTES.md
 */

const ITEM_STYLE = `
:host {
  display: block;
  position: relative;
  min-height: 48px;
  padding: 8px 16px;
  box-sizing: border-box;
  font-family: Roboto, "Helvetica Neue", sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.87);
}
:host([hidden]) { display: none !important; }
`;

const BODY_STYLE = `
:host {
  display: block;
  overflow: hidden;
}
:host([two-line]) {
  /* espacio similar a paper-item-body two-line */
}
:host([hidden]) { display: none !important; }
`;

const ElementBase = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};

class PaperItem extends ElementBase {
  constructor() {
    super();
    if (typeof this.attachShadow === 'function') {
      this.attachShadow({ mode: 'open' }).innerHTML =
        `<style>${ITEM_STYLE}</style><slot></slot>`;
    }
  }
}

class PaperItemBody extends ElementBase {
  constructor() {
    super();
    if (typeof this.attachShadow === 'function') {
      this.attachShadow({ mode: 'open' }).innerHTML =
        `<style>${BODY_STYLE}</style><slot></slot>`;
    }
  }
}

if (typeof customElements !== 'undefined') {
  if (!customElements.get('paper-item')) {
    customElements.define('paper-item', PaperItem);
  }
  if (!customElements.get('paper-item-body')) {
    customElements.define('paper-item-body', PaperItemBody);
  }
}

export { PaperItem, PaperItemBody };
export default PaperItem;
