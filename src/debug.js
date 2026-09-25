/**
 * Legacy debug flag.
 *
 * Much of the math engine still reads a bare `debug` identifier. That only
 * resolves if the global object has the property; otherwise the first
 * operation throws ReferenceError. Production keeps it false. Tests may set
 * `globalThis.debug = true` to trace a single run.
 */
if (typeof globalThis.debug !== 'boolean') {
  globalThis.debug = false;
}
