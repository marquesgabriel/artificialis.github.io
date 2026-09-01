import { render, fireEvent } from '@testing-library/react';
import * as THREE from 'three';
import { Viewer3D } from './Viewer3d';
import { dripperSupportObject } from '../../objects/dripper/dripperSupport';

// jsdom has no WebGL context - three.js's WebGLRenderer would throw trying to
// get one. Everything else in `three` (Scene, geometry, math) stays real.
vi.mock('three', async (importOriginal) => {
  const actual = await importOriginal<typeof import('three')>();
  return { ...actual, WebGLRenderer: vi.fn() };
});

function fakeRenderer() {
  return {
    setSize: vi.fn(),
    setPixelRatio: vi.fn(),
    domElement: document.createElement('canvas'),
    render: vi.fn(),
    dispose: vi.fn(),
  };
}

describe('Viewer3D', () => {
  beforeEach(() => {
    // vite.config.js's mockReset:true wipes vi.mock factory implementations
    // before every test, so this has to be re-applied here rather than once
    // in the factory above.
    vi.mocked(THREE.WebGLRenderer).mockImplementation(function () {
      return fakeRenderer() as unknown as THREE.WebGLRenderer;
    });
  });

  it('mounts and unmounts without throwing', () => {
    const { unmount, container } = render(
      <Viewer3D object={dripperSupportObject} params={dripperSupportObject.defaults} />
    );
    expect(container.querySelector('canvas')).toBeInTheDocument();
    expect(() => unmount()).not.toThrow();
  });

  it('rebuilds the mesh when params change', () => {
    const buildGeometrySpy = vi.spyOn(dripperSupportObject, 'buildGeometry');
    const { rerender, unmount } = render(
      <Viewer3D object={dripperSupportObject} params={dripperSupportObject.defaults} />
    );
    const callsAfterMount = buildGeometrySpy.mock.calls.length;

    rerender(
      <Viewer3D object={dripperSupportObject} params={{ ...dripperSupportObject.defaults, dripperDepth: 20 }} />
    );

    expect(buildGeometrySpy.mock.calls.length).toBeGreaterThan(callsAfterMount);
    unmount();
    buildGeometrySpy.mockRestore();
  });

  it('ignores mouse movement before a drag starts', () => {
    const { container, unmount } = render(
      <Viewer3D object={dripperSupportObject} params={dripperSupportObject.defaults} />
    );
    expect(() => fireEvent.mouseMove(window, { clientX: 10, clientY: 10 })).not.toThrow();
    expect(container.querySelector('canvas')).toBeInTheDocument();
    unmount();
  });

  it('rotates via mouse drag', () => {
    const { container, unmount } = render(
      <Viewer3D object={dripperSupportObject} params={dripperSupportObject.defaults} />
    );
    const el = container.firstElementChild as Element;
    fireEvent.mouseDown(el, { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(window, { clientX: 50, clientY: 30 });
    fireEvent.mouseUp(window);
    unmount();
  });

  it('rotates via touch drag', () => {
    const { container, unmount } = render(
      <Viewer3D object={dripperSupportObject} params={dripperSupportObject.defaults} />
    );
    const el = container.firstElementChild as Element;
    fireEvent.touchStart(el, { touches: [{ clientX: 0, clientY: 0 }] });
    fireEvent.touchMove(window, { touches: [{ clientX: 20, clientY: 15 }] });
    fireEvent.touchEnd(window);
    unmount();
  });

  it('zooms on wheel', () => {
    const { container, unmount } = render(
      <Viewer3D object={dripperSupportObject} params={dripperSupportObject.defaults} />
    );
    const el = container.firstElementChild as Element;
    expect(() => fireEvent.wheel(el, { deltaY: 100, cancelable: true })).not.toThrow();
    unmount();
  });

  it('resizes on window resize', () => {
    const { unmount } = render(<Viewer3D object={dripperSupportObject} params={dripperSupportObject.defaults} />);
    expect(() => fireEvent(window, new Event('resize'))).not.toThrow();
    unmount();
  });
});
