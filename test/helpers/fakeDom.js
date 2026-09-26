/**
 * Minimal DOM stand-ins for unit tests that run in Node.
 *
 * The custom elements extend an empty class outside the browser, so a test
 * can mix in the attribute and event API they rely on and exercise their
 * logic (property ↔ attribute reflection, ARIA, keyboard, events). Rendering
 * is covered by the Playwright tests in a real browser.
 */

/**
 * Subclass `Base` with a fake attribute/event API and return an instance.
 * `attrs` are present from the constructor on, as with markup attributes.
 * `shadow` maps element ids to the nodes a fake shadow root returns.
 */
export function mount(Base, {attrs = {}, shadow = null} = {}) {
  class Fake extends Base {}
  Object.assign(Fake.prototype, elementApi(attrs));
  if (shadow) {
    Fake.prototype.attachShadow = function() {
      this.shadowRoot = fakeNode({
        getElementById: (id) => shadow[id] || null,
        querySelector: (selector) => shadow[selector] || null,
      });
      return this.shadowRoot;
    };
  }
  const el = new Fake();
  el._listeners = el._listeners || {};
  el.dispatched = el.dispatched || [];
  return el;
}

function elementApi(initial) {
  return {
    get _attrs() {
      // Lazily created so the component constructor can already read it.
      const map = new Map(Object.entries(initial));
      Object.defineProperty(this, '_attrs', {value: map});
      return map;
    },
    get style() {
      const style = fakeStyle();
      Object.defineProperty(this, 'style', {value: style});
      return style;
    },
    getAttribute(name) {
      return this._attrs.has(name) ? this._attrs.get(name) : null;
    },
    hasAttribute(name) {
      return this._attrs.has(name);
    },
    setAttribute(name, value) {
      const old = this.getAttribute(name);
      this._attrs.set(name, String(value));
      this._changed(name, old);
    },
    removeAttribute(name) {
      if (!this._attrs.has(name)) return;
      const old = this.getAttribute(name);
      this._attrs.delete(name);
      this._changed(name, old);
    },
    // Browsers call attributeChangedCallback for observed attributes.
    _changed(name, old) {
      const observed = this.constructor.observedAttributes || [];
      if (observed.includes(name) && this.attributeChangedCallback) {
        this.attributeChangedCallback(name, old, this.getAttribute(name));
      }
    },
    addEventListener(type, fn) {
      this._listeners = this._listeners || {};
      (this._listeners[type] = this._listeners[type] || []).push(fn);
    },
    removeEventListener(type, fn) {
      this._listeners[type] = (this._listeners[type] || []).filter((f) => f !== fn);
    },
    dispatchEvent(ev) {
      this.dispatched = this.dispatched || [];
      this.dispatched.push(ev.type);
      ((this._listeners || {})[ev.type] || []).forEach((fn) => fn(ev));
      return true;
    },
    listenerCount(type) {
      return ((this._listeners || {})[type] || []).length;
    },
  };
}

/** A style object that records custom properties set with setProperty. */
function fakeStyle() {
  const props = {};
  return {
    props,
    setProperty(name, value) {
      props[name] = value;
    },
    getPropertyValue(name) {
      return props[name];
    },
  };
}

/** A node with classList, style, listeners and a text/attribute bag. */
export function fakeNode(extra = {}) {
  const classes = new Set();
  const listeners = {};
  const attrs = {};
  return {
    style: fakeStyle(),
    hidden: false,
    textContent: '',
    children: [],
    _html: '',
    // Like the DOM, assigning markup replaces the children.
    get innerHTML() {
      return this._html;
    },
    set innerHTML(value) {
      this._html = value;
      this.children = [];
    },
    classList: {
      add: (...c) => c.forEach((x) => classes.add(x)),
      remove: (...c) => c.forEach((x) => classes.delete(x)),
      contains: (c) => classes.has(c),
    },
    setAttribute(name, value) {
      attrs[name] = String(value);
    },
    getAttribute(name) {
      return name in attrs ? attrs[name] : null;
    },
    removeAttribute(name) {
      delete attrs[name];
    },
    addEventListener(type, fn) {
      (listeners[type] = listeners[type] || []).push(fn);
    },
    removeEventListener(type, fn) {
      listeners[type] = (listeners[type] || []).filter((f) => f !== fn);
    },
    fire(type, ev = {}) {
      (listeners[type] || []).forEach((fn) => fn({type, ...ev}));
    },
    listenerCount(type) {
      return (listeners[type] || []).length;
    },
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    ...extra,
  };
}

/** Node has Event but not MouseEvent; provide it while a test runs. */
export function withMouseEvent(fn) {
  const had = 'MouseEvent' in globalThis;
  if (!had) globalThis.MouseEvent = class MouseEvent extends Event {};
  try {
    return fn();
  } finally {
    if (!had) delete globalThis.MouseEvent;
  }
}

/** Run `fn` with a fake global `document`, restoring the previous one. */
export function withFakeDocument(fn, {scrim = null} = {}) {
  const previous = globalThis.document;
  const doc = {
    body: fakeNode(),
    listeners: {},
    addEventListener(type, f) {
      (this.listeners[type] = this.listeners[type] || []).push(f);
    },
    removeEventListener(type, f) {
      this.listeners[type] = (this.listeners[type] || []).filter((x) => x !== f);
    },
    querySelector: (sel) => (sel === '.mdc-drawer-scrim' ? scrim : null),
    createElement: (tag) => fakeNode({tagName: tag.toUpperCase()}),
    createTextNode: (text) => ({nodeType: 3, textContent: text}),
  };
  globalThis.document = doc;
  try {
    return fn(doc);
  } finally {
    if (previous === undefined) delete globalThis.document;
    else globalThis.document = previous;
  }
}
