import '@testing-library/jest-dom';

// jsdom doesn't implement requestAnimationFrame - needed by anything driving
// a render loop (e.g. Viewer3D's three.js animation loop).
if (typeof window !== 'undefined' && !window.requestAnimationFrame) {
  window.requestAnimationFrame = (cb: FrameRequestCallback) => window.setTimeout(() => cb(Date.now()), 0);
  window.cancelAnimationFrame = (id: number) => window.clearTimeout(id);
}

// jsdom doesn't implement ResizeObserver either - needed by Viewer3D to
// self-correct its renderer/camera sizing once its container actually has
// a real size. Fires the callback once on observe(), matching the real
// API's initial-observation behavior closely enough for tests that don't
// depend on genuine layout changes.
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = class {
    private callback: ResizeObserverCallback;
    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
    }
    observe() {
      this.callback([], this as unknown as ResizeObserver);
    }
    unobserve() {}
    disconnect() {}
  };
}
