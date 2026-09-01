import '@testing-library/jest-dom';

// jsdom doesn't implement requestAnimationFrame - needed by anything driving
// a render loop (e.g. Viewer3D's three.js animation loop).
if (typeof window !== 'undefined' && !window.requestAnimationFrame) {
  window.requestAnimationFrame = (cb: FrameRequestCallback) => window.setTimeout(() => cb(Date.now()), 0);
  window.cancelAnimationFrame = (id: number) => window.clearTimeout(id);
}
